var tvdb = require("thetvdb-api")("330AB5AC7F0792B4");
var cache = require("./cachedTVDB");
/*
tvdb.getSeries("Doctor Who (2005)", function(err, tv)
{
	console.log(tv.Data.Series);
	tvdb.getBanners(78804, function(err, banner)
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
			console.log(banner.Banners.Banner[highestRated]);
	});

});
*/

/*cache.getPoster(78804, function(url)
{
	console.log(url);
});*/

cache.getSeriesInfo(78804, function(d)
{
console.log(d);
});
