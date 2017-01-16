plugin = new InstagramPlugin()
setInterval(function() {
	plugin.checkForVideo()
}, 1000)

function InstagramPlugin() {
	this.foundVideo = false;
}

InstagramPlugin.prototype.checkForVideo = function() {
	var video = $("video")
	hasVideo = video.length == 1
	
	if(hasVideo && !this.foundVideo) {
		this.foundVideo = true
		console.log("Video now on-screen")
		
		video.attr("controls", "controls")
		video.css("z-index", 5000)
		
		parent = video.parent().parent().parent().parent().parent()
		
		newDiv = $("<div class='jefferson-holder'></div>")
		
		this.videoEl = video[0];
		this.videoEl.addEventListener('timeupdate', this.checkTime.bind(this));
		
		newDiv.append(this.makeStyleBlock());
		newDiv.append(this.makeButton("Set Start", this.clickedStart));
		newDiv.append(this.makeButton("Set End", this.clickedEnd));
		newDiv.append(this.makeButton("Preview", this.clickedPreview));
		newDiv.append(this.makeButton("Save", this.clickedSave));
		
		this.startTimeText = this.makeText("Start time: ");
		newDiv.append(this.startTimeText);
		
		this.endTimeText = this.makeText("End time: ");
		newDiv.append(this.endTimeText);
		
		parent.append(newDiv);
	}
	
	if(!hasVideo && this.foundVideo) {
		this.foundVideo = false
		console.log("Video turned off")
	}
}

InstagramPlugin.prototype.clickedStart = function() {
	this.startTime = this.videoEl.currentTime;
	this.startTimeText.setValue(_.round(this.startTime, 1) + "s");
};

InstagramPlugin.prototype.clickedEnd = function() {
	this.endTime = this.videoEl.currentTime;
	this.endTimeText.setValue(_.round(this.endTime, 1) + "s");
};

InstagramPlugin.prototype.clickedPreview = function() {
	this.isPreviewMode = true;
	this.videoEl.currentTime = this.startTime;
	this.videoEl.play();
};

InstagramPlugin.prototype.clickedSave = function() {
	
};

InstagramPlugin.prototype.checkTime = function() {
	if(this.isPreviewMode != true) return;
	
	if(this.endTime != null) {
		if(this.videoEl.currentTime > this.endTime) {
			this.videoEl.pause();
			delete this.isPreviewMode;
		}
	}
};

InstagramPlugin.prototype.makeStyleBlock = function() {
	str = "<style>";
	str += ".jefferson-holder {";
	str += "display: block;";
	str += "z-index: 5000;";
	str += "}";
	str += ".jefferson-button {";
	str += "display: inline-block;";
	str += "text-align: center;";
	str += "padding: 2px 20px;";
	str += "border: 1px solid #3897f0;";
	str += "color: #3897f0;";
	str += "border-radius: 3px;";
	str += "font-size: 14px;";
	str += "background: white;";
	str += "margin-right: 10px;";
	str += "cursor: pointer;";
	str += "}";
	str += ".jefferson-button:hover {";
	str += "background: #7FDBFF";
	str += "}";
	str += ".jefferson-text {";
	str += "display: block;";
	str += "margin: 5px 0px 0px 20px;";
	str += "}";
	str += "</style>";
	return $(str)
};

InstagramPlugin.prototype.makeButton = function(name, callback) {
	var button = $("<div class='jefferson-button'>" + name + "</div>")
	button.on('click', function(e) {
		e.stopPropagation();
		callback.bind(this)();
	}.bind(this));
	return button;
};

InstagramPlugin.prototype.makeText = function(label) {
	var div = $("<div class='jefferson-text'>" + label + "<span class='jefferson-value'></span></div>");
	div.setValue = function(text) {
		div.find('.jefferson-value').text(text);
	}
	return div;
};