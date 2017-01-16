console.log("vidtome.js");

function removeIframe() {
	$("iframe").remove();
}

setTimeout(removeIframe, 0);

function clickButton() {
	console.log("Click");
	
	$("input[name='imhuman'").click();	
}

setTimeout(clickButton, 6500);