console.log("Activated plugin v2!");

function init_qspipeline() {
	$(".sp-sidetower").remove();

	highlight("vidzi.tv", "yellow");
	highlight("videoweed", "chartreuse");
	highlight("vid.ag", "pink");
	highlight("vidto.me", "PaleTurquoise");
}

function highlight(text, color) {
	var spans = $("span:contains('" + text + "')");
	
	for(var i=0; i<spans.length; i++) {
		var span = $(spans[i]);
		span.css("background-color", color);
	}
}

setTimeout(init_qspipeline, 200);