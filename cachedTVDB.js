var tvdb = require("thetvdb-api")("330AB5AC7F0792B4"),
	redislib = require("redis"),
    redis = redislib.createClient();

default_poster = "no poster";
banners_mirror = "http://thetvdb.com/banners/";

function searchForSeries(name, callback)
{
	redis.get(name+"-search", function(err, result)
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
					redis.set(name+"-search", JSON.stringify(results), redislib.print);
					callback(results.Data.Series);
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
			redis.set(seriesID+"-info", JSON.stringify(data.Data.Series), redislib.print);
			redis.set(seriesID+"-episodes", JSON.stringify(data.Data.Episode), redislib.print);
			callback(data.Data.Series, data.Data.Episode);
		}
	});
}

function getSeriesInfo(seriesID, callback)
{
	redis.get(seriesID+"-info", function(err, result)
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
	redis.get(seriesID+"-episodes", function(err, result)
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
	redis.get(seriesID+"-poster", function(err, result)
	{
		if ( err || !result )
		{
			tvdb.getBanners(seriesID, function(err, banner)
        	{
                var highestRated = -1;
                var toBeat = -1;
                for ( var i = 0; i < banner.Banners.Banner.length; i++ )
                {
                        thisBanner = banner.Banners.Banner[i];
                        if ( thisBanner.BannerType == "poster" )
                        {
                                thisBanner.Rating = thisBanner.Rating*thisBanner.RatingCount;
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
                    redis.set(seriesID+"-poster", url, redislib.print);
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


