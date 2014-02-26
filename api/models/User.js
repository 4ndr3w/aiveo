/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

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
  	
  	getSeries: function (callback) {
  		WatchingStatus.findByUser(this.id, function(err, data)
  		{
  			if ( !err )
  				callback(data);
  		});
  	}
  	
  }

};
