console.log("Activated plugin! Shows extra info for kat2.");

function auto_open() {
	$(".sidebarCell").remove();
	$(".advertising").remove();
	var titles = $.find(".cellMainLink");

	for(var i=0; i<titles.length; i++) {
		var aTag = $(titles[i]);
		var titleDirty = aTag.text();
		var title = titleDirty.match(/^.*201./);

		var wurl = "https://www.google.com/?#q=wikipedia+" + title + "&btnI"; // btnI makes google open first search result
		var imdburl = "https://www.google.com/?#q=imdb+" + title + "&btnI";
		aTag.after("&nbsp;<i><a href='" + wurl + "' target='_blank'>Wikipedia</a></i>");
		aTag.after("&nbsp;<i><a href='" + imdburl + "' target='_blank'>IMDB</a></i>");
	}
}

setTimeout(auto_open, 200);