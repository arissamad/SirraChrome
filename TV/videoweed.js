console.log("Activated plugin! Auto-close videoweed ads.");

function auto_open() {
	$($("#playerpageads_table td")[1]).remove();
	$(".ad").remove();
}

setTimeout(auto_open, 200);