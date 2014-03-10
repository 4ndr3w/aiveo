/**
 * SeriesController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var tvdb = require("../../cachedTVDB"),
	request = require("request");

module.exports = {
	
	
    search: function(req,res) {
    	var results = tvdb.searchForSeries(req.param("query"), function(results)
    	{
    		Library.findByUser(req.session.user.id, function(err, userLibrary)
			{
				function getLibraryStatus(seriesID)
				{
					for ( var i = 0; i < userLibrary.length; i++ )
					{
						if ( userLibrary[i].series == seriesID )
							return userLibrary[i].status;
					}
					return "Add to Library";
				}
				res.view({title: "Search - "+req.param("query"), results:results, getLibraryStatus: getLibraryStatus, session: req.session});
			});
    		
    	});
    },
  
	view: function(req,res) {
		tvdb.getSeriesInfo(parseInt(req.param("series")), function(series)
		{
			tvdb.getSeriesEpisodeInfo(parseInt(req.param("series")), function(episodes)
			{
				Library.findOne({user:req.session.user.id, series:parseInt(req.param("series"))}).done(function(err, entry)
				{
					if ( entry == undefined )
						entry = {status: "Add to Library", progress: 0};
					User.findOneById(req.session.user.id, function (err, loggedinUser)
					{
						Library.getForUsersAndSeries(parseInt(req.param("series")), loggedinUser.friends, function(err, friendWatchingData)
						{
							res.view({title:series.SeriesName, series: series, episodes: episodes, watchingStatus: entry.status, totalEpisodes:episodes.length, completedEpisodes: entry.progress, session: req.session, friends: friendWatchingData});
						});
					});
				});
			});
		});
	},
	
	poster: function(req,res)
	{
		res.set("content-type", "image/png");
		tvdb.cache.get(req.param("series")+"-poster", function(err, data)
		{
			if (err || !data )
			{
				tvdb.getSeriesInfo(parseInt(req.param("series")), function(series)
				{
					var getRequest = {
						method: "GET",
						url: series.poster,
						encoding: null
					};
					request(getRequest, function(err, response, body)
					{
						tvdb.cache.set(req.param("series")+"-poster", body, function(err, data)
						{
							res.write(body, 'binary');
							res.end();
						}, 1000, true);
					})
				});
			}
			else
			{
				res.write(data, 'binary');
				res.end();
			}
		});	
	},
	
	fanart: function(req,res)
	{
		res.set("content-type", "image/png");
		tvdb.cache.get(req.param("series")+"-fanart", function(err, data)
		{
			if (err || !data )
			{
				tvdb.getSeriesInfo(parseInt(req.param("series")), function(series)
				{
					
					var getRequest = {
						method: "GET",
						url: series.fanart,
						encoding: null
					};
					request(getRequest, function(err, response, body)
					{
						tvdb.cache.set(req.param("series")+"-fanart", body, function(err, data)
						{
							res.write(body, 'binary');
							res.end();
						}, 1000, true);
					});
				});
			}
			else
			{
				res.write(data, 'binary');
				res.end();
			}
		});	
	},

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SeriesController)
   */
  _config: {}

  
};
