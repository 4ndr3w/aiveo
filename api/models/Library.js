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
		console.log(user);
		console.log(series);
		Library.findOne({user: user, series: series}).done(function(e, obj)
		{
			console.log(e);
			console.log(obj);
			if ( !e && obj )
			{
				console.log(obj);
				obj.status = status;
				obj.save(function(err)
				{
					// done
				});
			}
			else
			{
				Library.create({user: user, series: series, status: status}).done(function(e, obj)
				{
					console.log(e);
					console.log(obj);
					return;
				});
			}
		})
	},
	
	getStatusForSeries: function(user, series, callback)
	{
		Library.findOne({user: user, series: series}).done(function(e, obj)
		{
			if ( !e && obj )
				callback(obj.status);
			else
				callback("Add to Library");
		});
	},
	
	getForUsers: function(friends, callback)
	{
		if ( friends == undefined )
		{
			callback(null, []);
			return;
		}
		
		var data = [];
		var index = 0;
		function fetch()
		{
			
			console.log(data);
			if ( index < friends.length )
			{
				User.findOneByUsername(friends[index], function (err, user)
				{

					Library.find({user: user.id}).done(function(err, obj)
					{
						if ( obj != undefined )
						{
							if ( !Array.isArray(obj) )
								obj = [obj];
							for ( var i = 0; i < obj.length; i++ )
							{
								obj[i].username = friends[index];	
							}
							data = data.concat(obj);
						}
						index++;
						fetch();
					});
				});
			}
			else
				callback(null, data);
		}
		fetch();
	},
	
	getUserFeed: function(friends, callback)
	{
		var index = 0;
		var feed = new Array();
		function fetch()
		{
			if ( index < friends.length )
			{
				User.findOneByUsername(friends[index]).done(function(err, data)
				{
					Library.find({})
				});
			}
			else
			{
				callback(null, feed);
			}
		}
		fetch();
		
	},
	
	getForUsersAndSeries: function(series, friends, callback)
	{
		if ( friends == undefined )
		{
			callback(null, []);
			return;
		}
		
		var data = [];
		var index = 0;
		function fetch()
		{
			if ( index < friends.length )
			{
				User.findOneByUsername(friends[index], function (err, user)
				{
					if ( user != undefined && !err)
					{
						Library.find({user: user.id, series: series}, function(err, obj)
						{
							if ( !Array.isArray(obj) )
								obj = [obj];
							for ( var i = 0; i < obj.length; i++ )
							{
								obj[i].username = friends[index];	
							}
							data = data.concat(obj);
							index++;
							fetch();
						});
					}
					else
					{
						index++;
						fetch();
					}
				});
			}
			else
				callback(null, data);
		}
		fetch();
	},
	
  attributes: {
  	user: {
  		type: 'string',
  		required: true
  	},
  	
    series: {
    	type: 'integer',
    	required: true
    },
    
    status: {
    	type: 'string',
    	required: true,
		in: ["Plan to Watch", "Currently Watching", "Completed", "Dropped"]
    },
	
	progress: {
		type: 'integer',
		defaultsTo: 0
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