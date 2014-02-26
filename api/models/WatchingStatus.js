/**
 * WatchingStatus
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var tvdb = require("cachedTVDB");

module.exports = {

  attributes: {
  	user: {
  		type: 'integer',
  		required: true
  	},
  	
    series: {
    	type: 'integer',
    	required: true
    },
    
    status: {
    	type: 'string',
    	required: true
    },
    
    getSeries: function(callback) {
    	tvdb.getSeriesInfo(this.series, callback);
    },
    
    getUser: function(callback) {
    	User.findOneById(this.user).done(function(data)
    	{
    		callback(data);
    	});
    }
    
  }

};
