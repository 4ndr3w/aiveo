var tvdb = require("thetvdb-api")("330AB5AC7F0792B4"),
	memjs = require('memjs'),
	memcache = new memjs.Client.create();

var default_poster = "no poster";
var banners_mirror = "http://thetvdb.com/banners/";

function searchForSeries(name, callback)
{
	memcache.get(name+"-search", function(err, result)
	{
		if ( err || !result )
		{
			tvdb.getSeries(name, function(err, results)
			{			
				if ( err || !results )
					callback([]);
				else
				{
					if ( !Array.isArray(results.Data.Series) )
						results.Data.Series = [results.Data.Series];
					var current = 0;
					function processPosterArt()
					{
						if ( current < results.Data.Series.length )
						{
							getSeriesInfo(results.Data.Series[current].seriesid, function(series, episodes)
							{
								results.Data.Series[current] = series;
								current++;
								processPosterArt();
							});
						}
						else
						{
							memcache.set(name+"-search", JSON.stringify(results), function(err)
							{
								if ( err ) console.log("Memcache set error!");
							}, 864000);
							callback(results.Data.Series);
						}
					}
					processPosterArt();
				}	
			});
		}
		else
		{
			callback(JSON.parse(result).Data.Series);
		}
	});
};


function fetchAllSeriesInfo(seriesID, callback)
{
	tvdb.getSeriesAllById(seriesID, function(err, data)
	{
		if ( err || !data )
			callback(undefined, undefined);
		else
		{
			data.Data.Series.poster = banners_mirror+data.Data.Series.poster;
			memcache.set(seriesID+"-info", JSON.stringify(data.Data.Series), function(err)
			{
				if ( err ) console.log("Memcache set error!");
			}, 864000);
			memcache.set(seriesID+"-episodes", JSON.stringify(data.Data.Episode), function(err)
			{
				if ( err ) console.log("Memcache set error!");
			}, 864000);
			callback(data.Data.Series, data.Data.Episode);
		}
	});
}

function getSeriesInfo(seriesID, callback)
{
	memcache.get(seriesID+"-info", function(err, result)
	{
		if ( err || !result )
		{
			fetchAllSeriesInfo(seriesID, function(info, episodes)
			{
				callback(info);
			});
		}
		else
		{
			callback(JSON.parse(result));
		}
	});
}

function getSeriesEpisodeInfo(seriesID, callback)
{
	memcache.get(seriesID+"-episodes", function(err, result)
	{
		if ( err || !result )
		{
			fetchAllSeriesInfo(seriesID, function(info, episodes)
			{
				callback(episodes);
			});
		}
		else
		{
			callback(JSON.parse(result));
		}
	});
}


function getPoster(seriesID, callback)
{
	memcache.get(seriesID+"-poster", function(err, result)
	{
		if ( err || !result )
		{
			tvdb.getBanners(seriesID, function(err, banner)
        	{
                var highestRated = -1;
                var toBeat = -1;
                if ( banner.Banners.Banner == undefined )
                {
                	callback(default_poster);
                	return;
                }
                for ( var i = 0; i < banner.Banners.Banner.length; i++ )
                {
                        thisBanner = banner.Banners.Banner[i];
                        if ( thisBanner.BannerType == "poster" )
                        {
                                if ( thisBanner.Rating > toBeat )
                                {
                                        toBeat = thisBanner.Rating;
                                        highestRated = i;
                                }
                        }
                }

                if ( highestRated != -1 )
                {
                	url = banners_mirror+banner.Banners.Banner[highestRated].BannerPath;
                    memcache.set(seriesID+"-poster", url, function(err)
					{
						if ( err ) console.log("Memcache set error!");
					}, 864000);
                    callback(url);
                }
                else
                	callback(default_poster);
        	});
		}
		else
			callback(result);
	});
}


exports.searchForSeries = searchForSeries;	
exports.getSeriesInfo = getSeriesInfo;
exports.getSeriesEpisodeInfo = getSeriesEpisodeInfo;
exports.getPoster = getPoster;


