/**
 * Library
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	
	updateForUser: function(user, series, status)
	{
		WatchingStatus.find({user: user.id, series: series.id}).done(function(e, obj)
		{
			if ( !e && obj )
			{
				obj.status = status;
				
			}
		})
	};
	
	getStatusForSeries: function(user, series, callback)
	{
		WatchingStatus.find({user: user.id, series: series.id}).done(function(e, obj)
		{
			if ( !e && obj )
				callback(obj.status);
			else
				callback()
		});
	}
	
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
