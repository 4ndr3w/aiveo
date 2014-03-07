/**
 * FriendsController
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

var tvdb = require("../../cachedTVDB");

module.exports = {
    
	index: function (req,res)
	{
		
		User.findOneById(req.session.user.id, function(err, currentUser)
		{
			Library.getForUsers(currentUser.friends, function(err, friendsData)
			{
				var index = 0;
				function process()
				{
					if ( index < friendsData.length )
					{
						var seriesID = friendsData[index].series;
						tvdb.getSeriesInfo(seriesID, function(series)
						{
							tvdb.getSeriesEpisodeInfo(seriesID, function(episode)
							{
								friendsData[index].series = series;
								friendsData[index].totalEpisodes = episode.length;
								
								index++;
								process();
							});
						});
					}
					else
					{
						res.view({title:"Friends", friends: friendsData, session: req.session});
					}
					
				}
				process();
				
			});
			
		});
		
	},
	
	feed: function(req,res)
	{
		User.findOneById(req.session.user.id, function(err, currentUser)
		{
			Library.getUserFeed(currentUser.friends, function(err, friendsData)
			{
				var index = 0;
				function process()
				{
					if ( index < friendsData.length )
					{
						var seriesID = friendsData[index].series;
						tvdb.getSeriesInfo(seriesID, function(series)
						{
							tvdb.getSeriesEpisodeInfo(seriesID, function(episode)
							{
								friendsData[index].series = series;
								friendsData[index].totalEpisodes = episode.length;
								
								index++;
								process();
							});
						});
					}
					else
					{
						res.view({title:"Friends", friends: friendsData, session: req.session});
					}
					
				}
				process();
				
			});
			
		});
	},
  

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to FriendsController)
   */
  _config: {}

  
};
