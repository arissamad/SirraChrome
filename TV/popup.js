$(document).ready(function() {
	var firebaseRef;
	var clipTbody = $(".clip-table tbody");
	
	var application = $(".application");
	var addDialog = $(".add-dialog");
	var nameInput = $(".name-input");
	var clipInput = $(".clip-input");
	var saveButton = $(".save");
	var cancelButton = $(".cancel");
	var deleteButton = $(".delete");
	var alert = $(".alert.message");
	
	var copyConfirmation = $(".copy-confirmation");
	var viewClip = $(".view-clip");
	var doneClipButton = $(".done-clip-btn");
	
	var nameToDelete;
	
	addDialog.hide();
	alert.hide();
	copyConfirmation.hide();
	viewClip.hide();
	
	$(".add-text").click(function() {
		setEditMode(false);
		
		alert.hide();
		addDialog.toggle();
		nameInput.focus();
		
		nameToDelete = null;
	});
	
	saveButton.click(function() {
		var name = nameInput.val();
		var clip = clipInput.val();
		addDialog.hide();
		alert.show();
		alert.text("Great! We've saved the clip");
		setTimeout(function() {
			alert.hide();
		}, 3000);
		
		var id = name;
		
		var saveObject = {};
		saveObject[name] = {name: name, clip: clip};
		
		firebaseRef.update(saveObject);
		nameInput.val("");
		clipInput.val("");
		
		if(nameToDelete != null && nameToDelete != name) {
			firebaseRef.child(nameToDelete).remove();
		}
		nameToDelete = null;
	});
	
	// Login functions
	var loginButton = $(".btn-login");
	var loginSection = $(".login-section");
	var signinButton = $(".btn-signin");
	
	var usernameInput = $(".username-input");
	
	loginButton.click(function() {
		application.hide();
		loginSection.show();
	});
	
	signinButton.click(function() {
		var username = usernameInput.val();
		
		firebaseRef = new Firebase('https://sirratv.firebaseIO.com/users/' + username);
		
		application.show();
		loginSection.hide();
		
		localStorage.setItem("username", username);
		
		// Firebase updates with new values
		firebaseRef.on("value", function(snapshot) {
			clipTbody.empty();
			var list = snapshot.val();
			if(list == null) return;
			
			for(var attr in list) {
				var obj = list[attr];
				addRow(obj.name, obj.clip);
			}
			
		});
	});
	
	// Handle search
	var searchInput = $(".search-input");
	searchInput.keyup(function(e) {
		if(e.keyCode == 13) {
			
			clipTbody.find("tr:visible").first().click();
			return;
		}
		var searchString = searchInput.val().toLowerCase();
		var trs = clipTbody.children();
		trs.show();
		
		if(searchString.length == 0) {
			
		} else {
			for(var i=0; i<trs.length; i++) {
				var tr = $(trs[i]);
				
				var text = tr.find("td").text();
				if(text.toLowerCase().indexOf(searchString) >= 0) {
					console.log("Found:" + text);
					tr.show();
		 		} else {
		 			tr.hide();
		 		}
			}
		}
	});
	
	// Support functions
	function addRow(name, clip) {
		var newTr = $("<tr><td class='name-td'>" + name + "</td><td class='clip-td'>" + clip + "</td>" + 
				"<td class='edit-td'><a><span class='glyphicon glyphicon-search'></span> <span class='glyphicon glyphicon-pencil'></span></a></td></tr>");
		clipTbody.append(newTr);
		
		newTr.click(function() {
			clickedShow(name, clip);
			console.log("Copied:" + clip);
		});
		
		newTr.find(".glyphicon-pencil").click(function(e) {
			e.stopPropagation();
			
			alert.hide();
			addDialog.show();
			
			nameInput.val(name);
			clipInput.val(clip);
			
			clipInput.focus();
			
			setEditMode(true, name);
		});
		
		newTr.find(".glyphicon-search").click(function(e) {
			e.stopPropagation();
			
			alert.hide();
			addDialog.hide();
			application.hide();
			
			viewClip.show();
	        viewClip.find(".copy-text").text(clip);
		});
	}
	
	function clickedShow(name, url){
        application.hide();
        addDialog.hide();
        
        copyConfirmation.show();
        copyConfirmation.find(".copy-text").text(name + " - " + url);
        
        setTimeout(function() {
        	window.close();
        }, 1500);

        chrome.tabs.update({
    		url: url
		});
    }
	
	function setEditMode(isEditMode, name) {
		if(isEditMode == true) {
			deleteButton.show();
			nameToDelete = name;
		} else {
			deleteButton.hide();
		}
	}
	
	deleteButton.click(function() {
		alert.show();
		alert.text("We've deleted the clip.");
		setTimeout(function() {
			alert.hide();
		}, 3000);
		
		addDialog.hide();
		
		firebaseRef.child(nameToDelete).remove();
		nameToDelete = null;
	});
	
	cancelButton.click(function() {
		addDialog.hide();
	});
	
	doneClipButton.click(function() {
		viewClip.hide();
		
		application.show();
	});
	
	var initialUsername = localStorage.getItem("username");
	if(initialUsername != null) {
		usernameInput.val(initialUsername);
		signinButton.click();
		
	}
	
	setTimeout(function() {
		searchInput.focus();
	}, 100);
	
});
