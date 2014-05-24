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
var async = require("async");

module.exports = {
	
	index: function(req,res)
	{
		User.findOneById(req.session.user.id, function(err, currentUser)
		{
      User.find({user: currentUser.friends}).exec(function(err, friends)
      {
        var friendIDs = new Array();
        for ( f in friends )
        {
          friendIDs.push(friends[f].id);
        }
        Library.find({user:friendIDs}).populate("series").populate("user").sort("updatedAt").exec(function(err, friendsData)
        {
          res.view({title:"Friends", friends: friendsData, session: req.session});
        });
      });
		});
	},
  

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to FriendsController)
   */
  _config: {}

  
};
