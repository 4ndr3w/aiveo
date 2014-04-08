/**
 * LibraryController
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
    
	index: function(req,res)
	{
		Library.find({user:req.session.user.id}).populate("series").sort("updatedAt desc").done(function (err, userLibrary)
		{
			res.view({title:"Library", library: userLibrary, session: req.session});	
		});
	},
	
  
	setLibraryStatus: function(req,res)
	{
		Library.updateForUser(req.session.user.id, parseInt(req.param("series")), req.param("status"));
		res.send("done");
	},
	
	setProgressStatus: function(req,res)
	{
		Library.findOne({user: req.session.user.id, series: parseInt(req.param("series"))}).populate("series").done(function(err, data)
		{
			var progress = parseInt(req.param("progress"));
			if ( !err && data && data.series.totalEpisodes >= progress )
			{
        data.status = "Currently Watching";
				data.progress = progress;
				data.save(function(err)
				{
					// done!
				});
			}
			res.send("done");
		});
	},

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to LibraryController)
   */
  _config: {}

  
};
