var capMode;
var clickedElem;


function switchPane(evt, id)
{
	return;
	var menu2 = document.getElementById(id);
	menu2.style.display = "block";
	menu2.style.right = "5px"; 
	menu2.style.top = Math.min(document.body.clientHeight - menu2.clientHeight - 5, evt.pageY) + "px"; 
}

function updateLastAction()
{
	return;
	var txt = getExtension().getLADescription();
	
	document.getElementById("spnLastAction").innerHTML = txt;
	document.getElementById("spnLastAction").title = txt + " (" + getOption(cShortcutPref, cDefaultShortcut) + ")";
	document.getElementById("spnShortcut").innerHTML = getOption(cShortcutPref, cDefaultShortcut);
	document.getElementById("spnShortcutVisible").innerHTML = getOption(cShortcutPrefVisible, cDefaultShortcutVisible);
	document.getElementById("spnShortcutEntire").innerHTML = getOption(cShortcutPrefEntire, cDefaultShortcutEntire);
	document.getElementById("spnShortcutSelection").innerHTML = getOption(cShortcutPrefSelection, cDefaultShortcutSelection);
}

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
		case "mnuResume"			: ext.resumeEditing(); break;
		case "mnuPreferences"		: 
		case "mnuPreferencesLite"	:
									  ext.openExtensionPreferences(); break;
		case "mnuQuickLaunch"		: ext.captureLastUsedMode(); break;
		//case "mnuQuickLaunch"	: ext.openCaptureSettings(); break;
		
		case "mnuCaptureEntire"		: capMode = cModeEntire; switchPane(evt, "mnuTools"); break;
		case "mnuCaptureVisible"	: capMode = cModeVisible; switchPane(evt, "mnuTools"); break;
		case "mnuCaptureSelection"	: capMode = cModeSelected; switchPane(evt, "mnuTools"); break;
		case "mnuCaptureBrowser"	: capMode = cModeBrowser; switchPane(evt, "mnuTools"); break;
		case "mnuMiscellaneousFolder"	:  switchPane(evt, "mnuMiscellaneous"); break;
		
		case "mnuViewDemo"			: ext.openDemoPage(); break;
		case "mnuSupport"			: ext.openSupportPage(); break;
		case "mnuAPI"				: ext.openAPIPage(); break;
		case "mnuUpgrade"			: ext.doUpgrade(); break;
		case "mnuUniblue"			: ext.openUnibluePromo(); break;
		case "mnuRegister"			: ext.doRegister(); break;
		case "mnuEnterLicense"		: ext.enterLicense(); break;
		
		case "mnuCaptureEntireLite"		: ext.capturePage(cActionEdit ,cModeEntire); break;
		case "mnuCaptureVisibleLite"	: ext.capturePage(cActionEdit ,cModeVisible); break;
		case "mnuCaptureSelectionLite"	: ext.capturePage(cActionEdit ,cModeSelected); break;
		
		case "mnuEdit"				: ext.capturePage(cActionEdit ,capMode); break;
		case "mnuSave"				: ext.capturePage(cActionSave ,capMode); break;
		case "mnuSavePDF"			: ext.capturePage(cActionSavePDF ,capMode); break;
		case "mnuUpload"			: ext.capturePage(cActionUpload ,capMode); break;
		case "mnuPrint"				: ext.capturePage(cActionPrint ,capMode); break;
		case "mnuClipboard"			: ext.capturePage(cActionClipboard ,capMode); break;
		case "mnuEmail"				: ext.capturePage(cActionEMail ,capMode); break;
		case "mnuExtEdit"			: ext.capturePage(cActionPaint ,capMode); break;
		case "mnuSendOneNote"		: ext.capturePage(cActionSendOneNote, capMode); break;
		case "mnuOpenFile"			: ext.openFile(); break;
		case "mnuOpenClipboard"		: ext.openClipboard(); break;
		case "mnuLicenseInfo"		: ext.showLicenseInfo(); break;
		case "mnuAbout"				: ext.showAbout(); break;
		case "mnuCodeNinjasNative"	: ext.installNative(); break;
	}	
}

function mouseOver(obj, evt)
{
	//if (obj != clickedElem && obj.id != "mnuEdit" && obj.id != "mnuSave" && obj.id != "mnuSavePDF" && obj.id != "mnuUpload" && obj.id != "mnuPrint" && obj.id != "mnuClipboard" && obj.id != "mnuEmail" && obj.id != "mnuSendOneNote" && obj.id != "mnuExtEdit")	
	//	document.getElementById("mnuTools").style.display = "none";
		
	if (obj != clickedElem && (!obj.parentNode || obj.parentNode.getAttribute('rel') != "mnuTools"))
		document.getElementById("mnuTools").style.display = "none";
		
	if (obj != clickedElem && (!obj.parentNode || obj.parentNode.getAttribute('rel') != "mnuMiscellaneous"))
		document.getElementById("mnuMiscellaneous").style.display = "none";
		
}

function load()
{
	//console.log("!",$);
	
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
	
//	updateLastAction();
//	updateAccessibility();
}

function showLogin(){
	$("#main2").hide();
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
	if (showConnectedOK) {
		$("#connected").show();

	}
	$("#connected").html("Connected as " + localStorage['login']);
}

function updateAccessibility()
{
	getExtension().getMenuSettings(function (settings)	{
		for(var key in settings)
		{
			var elem = document.getElementById(key);
			if (elem == undefined) alert("Element " + key + " not found");
			else
			{
				switch (settings[key])
				{
					case "visible"	: elem.style.display = "block"; break;
					case "hidden"	: elem.style.display = "none"; break;
					case "disabled"	: elem.className = "disabled"; break;
					case "enabled"	: elem.className = ""; break;
				}
				
			}
		}
		
		document.getElementById("mnuMain").style.display = "block";
	});
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

