console.log("In close.js");

function auto_open() {
	$("head").remove();
	$("body").remove();
}

setTimeout(auto_open, 0);