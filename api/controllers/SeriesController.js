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

var tvdb = require("cachedTVDB");

module.exports = {
    
    search: function(req,res) {
    	var results = tvdb.searchForSeries(req.param("query"), function(results)
    	{
    		console.log(results);
    		res.view({results:results});
    	});
    },
  
	view: function(req,res) {
		var series = tvdb.getSeriesInfo(req.param("series"), function(series, episode)
		{
		console.log(series);
			res.view({series: series});
		});
	},

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SeriesController)
   */
  _config: {}

  
};
