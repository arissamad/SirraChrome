console.log("Activated plugin! Auto-close filehoot ads.");

function auto_open() {
	$("iframe").remove();
	$(".panel-body").remove()
	
	//$("#player_ads").remove();
}

setTimeout(auto_open, 1000);