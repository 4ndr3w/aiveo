/**
 * ReviewController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
  
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
    Series.findOne({id:parseInt(req.param("series"))}).done(function(err, series)
    {
      Review.find({series:parseInt(req.param("series"))}).done(function(err, data)
      {
        res.view({reviews: data, series:series});
      });
    });
  },
};
