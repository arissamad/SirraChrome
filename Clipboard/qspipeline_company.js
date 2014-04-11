console.log("Activated plugin!");

function init_qspipeline() {
	var cd = $("#company_details");
	
	if(cd.length == 1) {
		// We are in View Company screen
	} else {
		// We are in Edit Company screen
		console.log("In edit company");
		var header = $(".box_header");
		header.append("<div style='float:right;'><button id='edit_checkBtn'>Check school name</button></div>");
	}
	
	var bc = cd.find(".business_card");
	bc.append("<button id='zendeskBtn'>Open in Zendesk</button>&nbsp;");
	bc.append("<button id='checkBtn'>Check school name</button>")
	bc.append("<div style='height:10px'></div>");
	
	var newSectionJq = $("<div id='company_details'><div class='inner_box'><div class='box_header'><h2>QuickSchools Sales Tracking</h2></div><div class='box_content'></div></div></div>");
	cd.after(newSectionJq);
	
	var salesContentJq = newSectionJq.find(".box_content");
	
	salesContentJq.append("<button id='sales_called'>Called</button>&nbsp;");
	salesContentJq.append("<button id='sales_rdm'>Talked with Decision Maker</button>");
	salesContentJq.append("<div style='height: 10px;'></div>");
	salesContentJq.append("<button id='sales_demoscheduled'>Demo Scheduled</button>&nbsp;");
	salesContentJq.append("<button id='sales_demogiven'>Demo Given</button>&nbsp;");
	
	var zendeskBtn = bc.find("#zendeskBtn");
	var checkBtn = bc.find("#checkBtn");
	var edit_checkBtn = $("#edit_checkBtn");
	
	zendeskBtn.click(function() {
		console.log("Click zendesk");
	
		var title = document.title;
		var i0 = title.indexOf("[");
		var i1 = title.indexOf("]");
		if(i0 < 0 && i1 < 0) {
			i0 = title.indexOf("(");
			i1 = title.indexOf(")");
		}
		i0++;
	
		var schoolCode = title.substring(i0, i1);
	
		if(schoolCode != null && schoolCode != "") {
			window.open("http://qsglue.heroku.com/tickets.html?schoolCode=" + schoolCode);
		}
	});
	
	checkBtn.click(function() {
		var originalName = $("#company_name").find(".js-change-name").text();
		var schoolCode = getSchoolCode(originalName);
		
		console.log("Checking proper name for school code " + schoolCode);
		
		$.ajax("https://control.quickschools.com/sms/api/v1/schools/schoolCode:" + schoolCode + ".json", {
			success: function(data) {
				console.log("Got data:", data);
				if(data.success == false) {
					alert(data.error);
				} else {
					var properName = "[" + data.schoolCode + "] " + data.schoolName;
					
					if(properName == originalName) {
						alert("Company name is correct!\n\n" + properName);
					} else {
						alert("Your company name is incorrect. It should be:\n\n" + properName + "\n\nYours is:\n\n" + originalName);
					}
				}
			}
		});
	});
	
	edit_checkBtn.click(function() {
		var originalName = $("#company_name").find(".js-change-name").text();
		var schoolCode = getSchoolCode(originalName);
		
		$.ajax("https://control.quickschools.com/sms/api/v1/schools/schoolCode:" + schoolCode + ".json", {
			success: function(data) {
				console.log("Got data:", data);
				if(data.success == false) {
					alert(data.error);
				} else {
					var properName = "[" + data.schoolCode + "] " + data.schoolName;
					
					if(properName == originalName) {
						alert("Company name is correct!\n\n" + properName);
					} else {
						input.val(properName);
						alert("Your company name is incorrect. Updated from:\n\n" + originalName + "\n\nTo:\n\n" + properName);
					}
				}
			}
		});
	});
	
	function getSchoolCode(originalName) {
		var i0 = originalName.indexOf("[");
	    var i1 = originalName.indexOf("]");
	    
	    if (i0 < 0 && i1 < 0) {
	        i0 = originalName.indexOf("(");
	        i1 = originalName.indexOf(")");
	    }
	    i0++;
	    
	    var schoolCode = originalName.substring(i0, i1).toLowerCase();
		
	    return schoolCode;
	}
	
	$("#sales_called").click(function() {
		record("Call");
	});
	$("#sales_rdm").click(function() {
		record("ReachedDecisionMaker");
	});
	$("#sales_demoscheduled").click(function() {
		record("DemoScheduled");
	});
	$("#sales_demogiven").click(function() {
		record("DemoGiven");
	});
	
	function record(action) {

		var companyId = $("#data").attr("data-id");
		var schoolName = $("#company_name").find(".js-change-name").text();

		var page = "salestracking";
		if(action == "DemoScheduled") {
			page = "demoscheduling";
		}
		
		var peopleSection = $(document).find(".js_people_holder");
		var firstPerson = peopleSection.find(".items").first().find("tr").first();
		
		var customerName = firstPerson.find(".name .deal_name").first().text();
		var customerEmail = firstPerson.find(".name p a").text();
		var customerPhone = firstPerson.find(".phone span.phone").first().attr("title");
		
		if(customerPhone == null) customerPhone = "";
		
		var url = "http://www.sirrateam.com/" + page + "?pipelineUri=companies/" + companyId +
			"&schoolName=" + schoolName + "&eventType=" + action +
			"&customerPhone=" + customerPhone + "&customerEmail=" + customerEmail + "&customerName="+customerName;
		
		console.log("URL: " + url);
		var newWindow = window.open(url, "pipeline_sirrateam");
		newWindow.focus();
	}
}

setTimeout(init_qspipeline, 500);