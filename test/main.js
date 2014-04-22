var assert = require("assert");
var Sails = require('sails');
var request = require("supertest");
var cachedTVDB = require("../cachedTVDB");


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
  
  describe("Series", function()
  {
    var test_series_id = 150471;
    var test_series_name = "Angel Beats!";
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
  
  describe("user", function()
  {
    it("should create without error", function(done)
    {
      User.create({username:"test", password:"test123", email:"test@aiveo.tv", friends: []}).exec(function(err, user)
      {
        if ( err ) throw err;
        done();
      });
    });
    
    it("should error if user is duplicated", function(done)
    {
      User.create({username:"test", password:"test123", email:"test@aiveo.tv", friends: []}).exec(function(err, user)
      {
        if (!err) throw err;
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
  });
});
