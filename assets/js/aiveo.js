
function planToWatchSeries(id)
{
	$("#series"+id+"status").text("Plan to Watch");
	$.get("/library/setLibraryStatus?series="+id+"&status=Plan to Watch");
}

function currentlyWatchingSeries(id)
{
	$("#series"+id+"status").text("Currently Watching");
	$.get("/library/setLibraryStatus?series="+id+"&status=Currently Watching");
}

function completeSeries(id)
{
	$("#series"+id+"status").text("Completed");
	$.get("/library/setLibraryStatus?series="+id+"&status=Completed");
}

function dropSeries(id)
{
	$("#series"+id+"status").text("Dropped");
	$.get("/library/setLibraryStatus?series="+id+"&status=Dropped");
}

function setProgress(id, progress)
{
	total = parseInt($("#watchingProgressBar").attr("total-episodes"));
	completed = parseInt($("#watchingProgressBar").attr("completed-episodes"));
	if ( progress <= total )
		completed = progress;
	$("#watchingProgressBar").attr("completed-episodes", completed);
	$("#watchingProgressBar").css("width", Math.floor(completed/total*100)+"%");
	$("#watchingProgressBar").text(completed+"/"+total);

  $.ajax({
    url: "/library/setLibraryStatus?series="+id+"&status=Currently Watching",
    success: function()
    {
      console.log("success "+id+" "+completed);
      $.get("/library/setProgressStatus?series="+id+"&progress="+completed);
    }
  });
  $("#progressBarContainer").removeClass("hide");

}

$("#completedEpisodeButton").click(function()
{
	id = $(this).attr("series-id");
	total = parseInt($("#watchingProgressBar").attr("total-episodes"));
	completed = parseInt($("#watchingProgressBar").attr("completed-episodes"));
	if ( completed <= total )
		completed++;
	$("#watchingProgressBar").attr("completed-episodes", completed);
	$("#watchingProgressBar").css("width", Math.floor(completed/total*100)+"%");
	$("#watchingProgressBar").text(completed+"/"+total);

	$.get("/library/setProgressStatus?series="+id+"&progress="+completed);
});


function shadeStars(value)
{
	for ( var i = 0; i < 5; i++ )
	{
		if ( i < value )
		{
			$(".rating-"+(i+1)).addClass("glyphicon-star");
			$(".rating-"+(i+1)).removeClass("glyphicon-star-empty");
		}
		else
		{
			$(".rating-"+(i+1)).addClass("glyphicon-star-empty");
			$(".rating-"+(i+1)).removeClass("glyphicon-star");
		}
	}
}

$(".rating").click(function()
{
	var value = $(this).attr("value");
	shadeStars(value);
	$(this).parent().attr("rating",value);
	io.socket.get("/library/setRating?series="+$(this).attr("series")+"&rating="+value, function(response)
	{

	});
});

$(".rating").mouseover(function()
{
	shadeStars($(this).attr("value"));
});

$(".rating").mouseout(function()
{
	shadeStars($(this).parent().attr("rating"));
});

$(".ratingStar").click(function()
{
	seriesID = $(this).attr("series");
	rating = $(this).attr("rating");

});
