/**
 * ReviewController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
  
  index: function(req,res)
  {
    User.findOne({user:req.session.user.id}).populate("reviews").done(function(err, user)
    {
      res.view({myReviews: user.reviews});
    });
  },
  
  new: function(req,res)
  {
    Series.findOne({id:parseInt(req.param("series"))}).done(function(err, series)
    {
      res.view({title:"Review", series: series});
    });
  },
  
  view: function(req,res)
  {
    Review.findOne({id: req.param("id")}).done(function(err, data)
    {
      res.view({title: "Review - "+data.title, review:data});
    });
  },
  
  series: function(req,res)
  {
    Series.findOne({id:parseInt(req.param("series"))}).populate("reviews").done(function(err, series)
    {
      res.view({series:series});
    });
  },
};
