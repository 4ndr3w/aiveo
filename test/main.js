var assert = require("assert");
var Sails = require('sails');
var Cookies;
var test_user;
var request = require("supertest");
var cachedTVDB = require("../cachedTVDB");

var session_variable = "";

var test_series_id = 150471;
var test_series_name = "Angel Beats!";

var test_review = {title:"Test", series: test_series_id, body:"This is a test review"};

function silentErrorHandler(err)
{
  if ( err ) throw err;
}


describe("aiveo", function()
{
  it("should lift", function(cb)
  {
    Sails.lift({}, function(err, sails)
    {
      cb();
    });
  });

  describe("welcome", function()
  {
    it("should redirect to login", function(done)
    {
      request(Sails.ws.server).get("/").expect(302, done);
    });
  });


  describe("user", function()
  {
    it("should create without error", function(done)
    {
      User.create({username:"test", password:"test123", email:"test@aiveo.tv", friends: []}).exec(function(err, user)
      {
        if ( err ) throw err;
        test_user = user;
        done();
      });
    });

    it("should error if user is duplicated", function(done)
    {
      User.create({username:"test", password:"test123", email:"test@aiveo.tv", friends: []}).exec(function(err, user)
      {
        if (!err) throw new Error("Duplicate check failed");
        done();
     });
    });

    it("should authenticate", function(done)
    {
      User.findOne({username:"test"}).exec(function(err, user)
      {
        user.validate("test123", function(err, ok)
        {
          if ( err ) throw err;
          assert.equal(true, ok);
          done();
        });
      });
    });

    it("should authenticate via HTTP", function(done)
    {
      request(Sails.ws.server).get("/welcome/authenticate?username=test&password=test123")
      .expect(203)
      .end(function(err, res) {
        Cookies = res.headers['set-cookie'].pop().split(';')[0];
        done();
      });
    });
  });

  describe("Series", function()
  {

    it("should return data", function(cb)
    {
      this.timeout(5000);
      Series.find({id:test_series_id}).exec(function(err, data)
      {
        if ( err ) throw err;
        cb();
      });
    });

    it("should be valid data", function()
    {
      this.timeout(5000);
      Series.find({id:test_series_id}).exec(function(err, data)
      {
        if ( err ) throw err;
        assert.equal(1, data.length);
        assert.equal(test_series_name, data[0].SeriesName);
      });
    });

    it("should be cached", function(cb)
    {
      cachedTVDB.cache.get(test_series_id+"-info", function(err, result)
      {
        if ( err ) throw err;

        data = JSON.parse(result);
        assert.equal(test_series_name, data.SeriesName);
        cb();
      });
    });
  });
  describe("library", function()
  {
    it("should add to library", function(done)
    {
      var req = request(Sails.ws.server).get("/library/setLibraryStatus?series="+test_series_id+"&status=Completed");
      req.cookies = Cookies;
      req.expect(200).end(function(err, res)
      {
        if ( err ) throw err;
        User.findOne({username:"test"}).populate("library").exec(function(err, entry)
        {
          if ( err ) throw err;
          assert.notEqual(entry.library.length, 0);
          done();
        });
      });
    });

    it("should update series status", function(done)
    {
      var req = request(Sails.ws.server).get("/library/setProgressStatus?series="+test_series_id+"&progress=5");
      req.cookies = Cookies;
      req.expect(200).end(function(err, res)
      {
        if ( err ) throw err;
        Library.findOne({user:test_user.id, series:test_series_id}).exec(function(err, data)
        {
          if ( err ) throw err;
          assert.equal(data.progress, 5);
          assert.equal(data.status, "Currently Watching");
          done();
        });
      });
    });

    it("should set rating", function(done)
    {
      var req = request(Sails.ws.server).get("/library/setRating?series="+test_series_id+"&rating=5");
      req.cookies = Cookies;
      req.expect(200).end(function(err, res)
      {
        if ( err ) throw err;
        Library.findOne({user:test_user.id, series: test_series_id}).exec(function(err, data)
        {
          if ( err ) throw err;
          assert.equal(data.rating, 5);
          done();
        });
      });
    });
  });

  describe("reviews", function()
  {
    it("should create", function(done)
    {
      var req = request(Sails.ws.server).get("/review/new?title="+test_review.title+"&series="+test_review.series+"&body="+test_review.body);
      req.cookies = Cookies;
      req.expect(302).end(function(err, res)
      {
        if ( err ) throw err;
        Review.findOne({title:"Test", user: test_user.id}).populate("series").exec(function(err, data)
        {
          if ( err ) throw err;
          assert.equal(data.title, test_review.title);
          assert.equal(data.series.id, test_review.series);
          assert.equal(data.body, test_review.body);
          test_review.id = data.id;
          done();
        });
      });
    });

    it("should view by id", function(done)
    {
      var req = request(Sails.ws.server).get("/review/view/"+test_review.id);
      req.cookies = Cookies;
      req.expect(200).end(done);
    });

    it("should view by series", function(done)
    {
      var req = request(Sails.ws.server).get("/review/series/"+test_series_id);
      req.cookies = Cookies;
      req.expect(200).end(function(err, res)
      {
        if ( err ) throw err;
        assert.notEqual(res.text.indexOf(test_review.body), -1);
        done();
      });
    });
  });

  after(function()
  {
    delete test_review.id;
    Review.destroy(test_review).exec(function (err) { if ( err ) console.log(err); });
    Library.destroy({user:test_user.id}).exec(function (err) { if ( err ) console.log(err); });
    User.destroy({username:"test"}).exec(function (err) { if ( err ) console.log(err); });
  });
});
