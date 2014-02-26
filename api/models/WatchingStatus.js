/**
 * WatchingStatus
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	'user': {
  		type: 'integer',
  		required: true
  	},
  	
    'series': {
    	type: 'integer',
    	required: true
    },
    
    'status': {
    	type: 'string',
    	required: true
    }
  }

};
