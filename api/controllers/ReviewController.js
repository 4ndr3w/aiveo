/**
 * ReviewController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
  
  index: function(req,res)
  {
    User.findOne({id:req.session.user.id}).populate("reviews").exec(function(err, user)
    {
        async.map(user.reviews, 
                   function(obj, done)
                   {
                     Series.findOne({id:obj.series}).exec(function(err, result)
                     {
                       obj.series = result;
                       done(err, obj);
                     });
                   },
                   function(err, results)
                   {
                      res.view({title:"My Reviews", myReviews: results});
                   }
        );
      });
  },
  
  new: function(req,res)
  {
    if( req.param("title") )
    {
      Review.create({
          user:req.session.user.id,
          series: req.param("series"),
          title: req.param("title"),
          body: req.param("body")
      }).exec(function(err) {
        res.redirect("/review");
      });
    }
    else
    {
      Series.findOne({id:parseInt(req.param("series"))}).exec(function(err, series)
      {
        res.view({title:"Review", series: series});
      });
    }
  },
  
  view: function(req,res)
  {
    Review.findOne({id: req.param("id")}).populate("user").populate("series").exec(function(err, data)
    {
      res.view({title: "Review - "+data.title, review:data});
    });
  },
  
  series: function(req,res)
  {
    Series.findOne({id:parseInt(req.param("series"))}).populate("reviews").exec(function(err, series)
    {
      res.view({series:series});
    });
  },
};
