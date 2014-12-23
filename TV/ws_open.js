console.log("Activated plugin! Auto open video.");

function auto_open() {
	var url = $("a.myButton").attr("href");
	location.href = url;
}

setTimeout(auto_open, 200);