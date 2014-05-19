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
		Library.findOne({user: user.toString(), series: series}).exec(function(e, obj)
		{
			if ( !e && obj )
			{
				obj.status = status;
				obj.save(function(err)
				{
					// done
				});
			}
			else
			{
				Library.create({user: user.toString(), series: series, status: status}).exec(function(e, obj)
				{
					return;
				});
			}
		})
	},

	getStatusForSeries: function(user, series, callback)
	{
		Library.findOne({user: user, series: series}).exec(function(e, obj)
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
			if ( index < friends.length )
			{
				User.findOneByUsername(friends[index], function (err, user)
				{
					Library.find({user: user.id}).exec(function(err, obj)
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
  		model: 'user',
  	},

    series: {
    	model: 'series',
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

  	rating:{
  		type: 'integer',
      defaultsTo: 0,
      in: [0,1,2,3,4,5]
  	},

    getSeries: function(callback) {
    	tvdb.getSeriesInfo(this.series, callback);
    },

    getUser: function(callback) {
    	User.findOneById(this.user).exec(function(data)
    	{
    		callback(data);
    	});
    }
  }
};
