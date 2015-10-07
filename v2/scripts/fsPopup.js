var capMode;
var clickedElem;


function click(obj, evt)
{
	if (obj.className == "disabled") return;
	clickedElem = obj;
	//var bkg = chrome.extension.getBackgroundPage();
	//bkg.console.log('foo');

	if (obj.id != "mnuCaptureEntire" && obj.id != "mnuCaptureVisible" && obj.id != "mnuCaptureSelection" && obj.id != "mnuCaptureBrowser" && obj.id != "mnuMiscellaneousFolder")
		window.close();
		
	var ext = getExtension();
		
	switch (obj.id)
	{
		case "mnuPreferences"		: 
		case "mnuPreferencesLite"	:
									  ext.openExtensionPreferences(); break;
		
		case "mnuCaptureSelection"	: capMode = cModeSelected; break;
		case "mnuCaptureSelectionLite"	: ext.capturePage(cActionEdit ,cModeSelected); break;
		
	}	
}

function mouseOver(obj, evt)
{
	//if (obj != clickedElem && obj.id != "mnuEdit" && obj.id != "mnuSave" && obj.id != "mnuSavePDF" && obj.id != "mnuUpload" && obj.id != "mnuPrint" && obj.id != "mnuClipboard" && obj.id != "mnuEmail" && obj.id != "mnuSendOneNote" && obj.id != "mnuExtEdit")	
	//	document.getElementById("mnuTools").style.display = "none";
		
	/*if (obj != clickedElem && (!obj.parentNode || obj.parentNode.getAttribute('rel') != "mnuTools"))
		document.getElementById("mnuTools").style.display = "none";
		
	if (obj != clickedElem && (!obj.parentNode || obj.parentNode.getAttribute('rel') != "mnuMiscellaneous"))
		document.getElementById("mnuMiscellaneous").style.display = "none";
	*/		
}

function load()
{
	console.log("!",$);
	
	/*var itr = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT, null, false);
	var currentNode;  
   
	while (currentNode = itr.nextNode()) 
	{  
   		if (currentNode.nodeName == "LI")
		{
			currentNode.onclick = function(evt){evt.preventDefault(); click(this, evt); return true;};
			currentNode.onmouseover = function(evt){mouseOver(this, evt);};
		}
	} */

	$("#mnuCaptureSelectionLite").click(function(){
		var ext = getExtension();
		window.close();
		ext.capturePage(cActionEdit ,cModeSelected);
	})

	$("#logout").click(function(){
        localStorage.login = "";
        localStorage.passwd =  "";
        localStorage.settings = "";
        showLogin();
	});

	$("#settings").click(function(){
		var ext = getExtension();
		window.close();
	       ext.openExtensionPreferences();
	});

	if (!localStorage['login']) {
		showLogin();
	} else {
		$("#connected").html("Connected as <b>" + localStorage['login'] + "</b>");

	}
	
}

function showLogin(){
	$("#main2").hide();
	$("#container").removeClass("screenshot");
	$("#loginDiv").show(500);

	$("#savePreferences").click(function(){
        fd = new FormData();
        fd.append('user', $("#login").val() );
        fd.append('password', $("#passwd").val() );
        $('body').addClass('upload');
        $('#loading').show();
        $.ajax({
            type: 'POST',
            url: 'http://codingninjas.co/rpc/post.php',
            data: fd,
            processData: false,
            contentType: false
        }).done(function(data) {
            $('body').removeClass('upload');
            $('#loading').hide();
            $('#progress').hide();
        	$("#errors").html(data);
        	if (data.indexOf("SUCCESS") == 0) {
		        localStorage.login = $("#login").val();
		        localStorage.passwd =  $("#passwd").val();
		        localStorage.userid = data.replace("SUCCESS:", "").split(":::")[0];
		        localStorage.settings = data;
		        $("#errors").hide();
		        showMain(true);
        	} else {
        		$("#errors").show();
        	}
        });
	});
}

function showMain(showConnectedOK){
	$("#loginDiv").hide(500);
	$("#main2").show(500);
	$("#container").addClass("screenshot");
	if (showConnectedOK) {
		$("#connected").show();

	}
	$("#connected").html("Connected as " + localStorage['login']);
}


document.addEventListener('DOMContentLoaded', function () {
	if (getExtension().checkBadgeAction()) 
	{
		window.close();
		return;
	}
	else
		load();
});

