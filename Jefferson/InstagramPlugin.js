plugin = new InstagramPlugin()
setInterval(function() {
	plugin.checkForVideo()
}, 1000)

setTimeout(function() {
	if(localStorage.getItem("jefferson-compilations") == null) {
		plugin.loadCompilations();
	} else {
		plugin.renderCompilationSelector();
	}
}, 1000)

function InstagramPlugin() {
	this.foundVideo = false;
}

InstagramPlugin.prototype.loadCompilations = function() {
	$.get("https://sirra-jefferson.herokuapp.com/api/compilations/getactive", function(compilationsStr) {
		localStorage.setItem("jefferson-compilations", compilationsStr);
		
		if(this.compilationSelector != null) {
			this.compilationSelector.remove();
		}
		
		this.renderCompilationSelector();
	}.bind(this));
};

InstagramPlugin.prototype.renderCompilationSelector = function() {
	compilations = JSON.parse(localStorage.getItem("jefferson-compilations"));
	currentId = localStorage.getItem("jefferson-currentId");
	
	console.log("Compilations is" + compilations);
	console.log("Current ID is ", currentId);
	
	this.compilationSelector = this.makeSelect(compilations, "id", "name");
	this.compilationSelector.change(function(e) {
		localStorage.setItem("jefferson-currentId", this.compilationSelector.val());
	}.bind(this));
	
	this.compilationSelector.val(currentId);
	
	$("body").append(this.compilationSelector);
};

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
		newDiv.append(this.makeButton("Refresh Compilations", this.loadCompilations));
		newDiv.append(this.makeButton("Grab Video", this.clickedGrabVideo));
		
		this.startTimeText = this.makeText("Start time: ");
		newDiv.append(this.startTimeText);
		
		this.endTimeText = this.makeText("End time: ");
		newDiv.append(this.endTimeText);
		
		this.progressText = this.makeText("Progress: ");
		newDiv.append(this.progressText);
		
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

InstagramPlugin.prototype.clickedGrabVideo = function() {
	var url = $(this.videoEl).attr("src");
	console.log("Grabbing ", url);
	
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "blob";
	
	request.addEventListener("progress", function(e) {
		if (e.lengthComputable) {
			var percentComplete = _.round(100 * e.loaded / e.total) + "%";
		} else {
			var percentComplete = e.loaded + " bytes";
		}
		this.updateProgress("Downloading video", percentComplete);
	}.bind(this));

	request.onload = function(e) {
	  var blob = request.response;
	  this.prepareToTransmit(blob);
	}.bind(this);
	
	request.send(null);
};

InstagramPlugin.prototype.prepareToTransmit = function(blob) {
	this.progressText.setValue("Saving video information...");
	
	$.get("https://sirra-jefferson.herokuapp.com/api/videos/updatevideo", {
		name: document.title,
		url: location.href,
		startTimeStr: this.startTime,
		endTimeStr: this.endTime,
		compilationId: this.compilationSelector.val()
	}, function() {
		this.progressText.setValue("Saved!");
		this.transmitVideoFile(blob);
	}.bind(this));
};

InstagramPlugin.prototype.transmitVideoFile = function(blob) {
	var url = "https://sirra-jefferson.herokuapp.com/upload/uploadvideo/1";

	var request = new XMLHttpRequest();
	request.open("POST", url, true);
	request.onload = function (e) {
	  console.log("Transmitted video file");
	};
	
	request.upload.addEventListener("progress", function(e) {
		if (e.lengthComputable) {
			var percentComplete = _.round(100 * e.loaded / e.total) + "%";
		} else {
			var percentComplete = e.loaded + " bytes";
		}
		this.updateProgress("Uploading video", percentComplete);
	}.bind(this));

	request.send(blob);
};

InstagramPlugin.prototype.updateProgress = function(type, progress) {
	this.progressText.setValue(type + " - " + progress + "");
};

InstagramPlugin.prototype.clickedSave = function() {
	$.get("https://sirra-jefferson.herokuapp.com/api/videos/updatevideo", {
		name: document.title,
		url: location.href,
		startTimeStr: this.startTime,
		endTimeStr: this.endTime
	}, function() {
		this.progressText.setValue("Saved!");
	}.bind(this));
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
	str += "padding: 2px 10px;";
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

InstagramPlugin.prototype.makeDownloadLink = function() {
	var link = $("<a>Download Video</a>");
	var src = $(this.videoEl).attr("src");
	link.attr("download", "download");
	link.attr("href", src);
	return link;
};

InstagramPlugin.prototype.makeSelect = function(options, idAttribute, displayAttribute) {

	var selectEl = $("<select style=\"position: fixed; top: 0px; left: 0px; z-index:10000;\"></select>");
	for(var i=0; i<options.length; i++) {
		var option = options[i];
		var optionEl = $("<option value='" + option[idAttribute] + "'>" + option[displayAttribute] + "</option>")
		selectEl.append(optionEl);
	}
	selectEl.click(function(e) {
		console.log("Got click");
		e.stopPropagation();
	});
	return selectEl;
};