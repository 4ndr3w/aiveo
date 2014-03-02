
function planToWatchSeries(id)
{
	$("#series"+id+"status").text("Plan to Watch");
}

function currentlyWatchingSeries(id)
{
	$("#series"+id+"status").text("Currently Watching");
}

function completeSeries(id)
{
	$("#series"+id+"status").text("Completed");
}

function dropSeries(id)
{
	$("#series"+id+"status").text("Dropped");
}