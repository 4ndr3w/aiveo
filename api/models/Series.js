/**
 * Series.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  adapter: 'tvdb',
  schema: false,
	attributes: {

    Actors: {
      type:"string"
    },
    Airs_DayOfWeek: {
      type:"string"
    },
    Airs_Time: {
      type:"string"
    },
    ContentRating: {
      type:"string"
    },
    FirstAired: {
      type:"string"
    },
    Genre:{
      type:"string"
    },
    IMDB_ID:{
      type:"string"
    },
    Language:{
      type:"string"
    },
    Network:{
      type:"string"
    },
    NetworkID:{
      type:"array"
    },
    Overview:{
      type:"string"
    },
    Rating:{
      type:"float"
    },
    RatingCount:{
      type:"integer"
    },
    Runtime:{
      type:"integer"
    },
    SeriesID:{
      type:"integer"
    },
    SeriesName:{
      type:"string"
    },
    Status:{
      type:"string"
    },
    added:{
      type:"array"
    },
    addedBy:{
      type:"array"
    },
    banner:{
      type:"string"
    },
    fanart:{
      type:"string"
    },
    lastupdated:{
      type:"integer"
    },
    poster:{
      type:"string"
    },
    zap2it_id:{
      type:"string"
    },
    episodes:{
      type:"array"
    },
    totalEpisodes:{
      type:"integer"
    }
	}

};
