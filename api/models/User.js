/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require("bcrypt"),
	salt = bcrypt.genSaltSync(10);
	
module.exports = {
  attributes: {
  	
  	username: {
  		type: 'string',
  		required: true,
  		unique: true
  	},
  	
  	password: {
  		type: 'string',
  		required:true
  	},
	
	friends: {
		type: 'array',
		defaultsTo: []
	},
	
	validate: function(password, cb)
	{
		bcrypt.compare(password, this.password, cb);
	},
  	
  	getSeries: function (callback) {
  		WatchingStatus.findByUser(this.id, function(err, data)
  		{
  			if ( !err )
  				callback(data);
  		});
  	}
  	
  },
  
  beforeCreate: function(values, done)
  {
	  bcrypt.hash(values.password, salt, function(err, hash)
	  {
		  if ( err )
		  	done(err);
		  else
		  {
			  values.password = hash;
			  done();
		  }
	  });
  }

};
