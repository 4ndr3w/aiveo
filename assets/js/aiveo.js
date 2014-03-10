
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
	console.log(completed<total);
	if ( progress < total )
		completed = progress;
	$("#watchingProgressBar").attr("completed-episodes", completed);
	$("#watchingProgressBar").css("width", Math.floor(completed/total*100)+"%");
	$("#watchingProgressBar").text(completed+"/"+total);
	
	$.get("/library/setProgressStatus?series="+id+"&progress="+completed);
}

$("#completedEpisodeButton").click(function()
{
	id = $(this).attr("series-id");
	total = parseInt($("#watchingProgressBar").attr("total-episodes"));
	completed = parseInt($("#watchingProgressBar").attr("completed-episodes"));
	console.log(completed<total);
	if ( completed < total )
		completed++;
	$("#watchingProgressBar").attr("completed-episodes", completed);
	$("#watchingProgressBar").css("width", Math.floor(completed/total*100)+"%");
	$("#watchingProgressBar").text(completed+"/"+total);
	
	$.get("/library/setProgressStatus?series="+id+"&progress="+completed);
});
