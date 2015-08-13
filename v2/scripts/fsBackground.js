var tabId, tabURL, tabTitle, imgData = [];
var extVersion = "0.0";
var updateURL = "";
var capAction, capMode;
var lastAction, lastMode;
var executeScriptTO;
var capId = 0, processedId = 0;
var guiItemsLocked = false;
var resumeMenuEnabled = false;
var shortcutProcessing = false;
var ignoreShortcuts = false;
var commPortName = "CodeNinjas Comm Port #" + Math.ceil(Math.random() * 45309714203);
var capResult, capResultDataURL, capResultFileNameLite;
var fUpdating = false;


function enableHotkey(fEnable)
{
	if (fEnable) 
		setTimeout(function() {
			shortcutProcessing = false;
		}, 500);
	else
		shortcutProcessing = true;
}

function getVersionInfo() 
{
	var request = new XMLHttpRequest();
	request.open("GET", chrome.extension.getURL("manifest.json"), true);
	request.onreadystatechange = function() 
	{
		if (this.readyState == XMLHttpRequest.DONE) 
		{
			extVersion = JSON.parse(this.responseText).version;
			updateURL = JSON.parse(this.responseText).update_url;

			if (isWindows())
				fsNativePlugin.init(function() {
					logToConsole("Callback from fsNative");
				}.bind(this));
			else 
				displayAnnouncements();
		}
	};
	request.send();
}

function displayAnnouncements()
{
	
	//chrome.browserAction.setBadgeText({text: "New!"});
	return;
}

function getInstalledPageURL()
{
	var addonString = "&app=" + (isOpera() ? "op" : "ch");
	
	if (isNativeSupported()) return "http://getCodeNinjas.com/installed.php?ver=" + extVersion + addonString + "&native=1";
	else return "http://getCodeNinjas.com/installed.php?lite=true&ver=" + extVersion + addonString;
}

function nativeHostUpdated(newVersion)
{
	logToConsole("Native module has updated to the " + newVersion + " version.");
	
	//gaTrack('UA-1025658-9', 'CodeNinjas.com', "NativeHostUpdated"); 
	
	if (newVersion == extVersion)
	{
		//showBadge("http://getCodeNinjas.com/updated.php?app=" + (isOpera() ? "op" : "ch") + "&ver=" + newVersion);
	}
}

function pluginEvent(obj)
{
	var topic = obj.topic,
		data = obj.data;
		
	if (topic == "status")
	{
		if (obj.code == statusHostReady)
			pluginCommand("setAddonVersion", {version:extVersion, browser: isOpera() ? "Opera" : "Chromium"});
		else
		{
			alert("CodeNinjas failed to update. The updater reported the following error: \r\n-----------------------------------------------\r\n" + obj.data + "\r\n-----------------------------------------------\r\n\r\nCodeNinjas will have to work in Lite mode.");
			logToConsole("Error from native module: " + obj.data);
		}
	}
	else if (topic == "openURL")
    {
		openURL(data);
	}
	else if (topic == "enableResumeMenu")
	{
		logToConsole("enableResumeMenu " + data);
		resumeMenuEnabled = data == "enable";
		
		setTimeout(function () {updateContextMenu();}, 10);
	}
	else if (topic == "setupMode")
	{
		localStorage[cPluginProModePref] = data != "false";
		
		updateContextMenu();
	}
	else if (topic == "setRegistered")
	{
		localStorage[cRegisteredPref] = data != "false";
		updateContextMenu();
	}
	else if (topic == "getInfo")
	{
		var request = new XMLHttpRequest();
		request.open("GET", data, true);
		request.onreadystatechange = function() 
		{
			if (this.readyState == XMLHttpRequest.DONE) 
			{
				pluginCommand("processInfo", {data:this.responseText});
			}
		};
		request.send();
	} 
	else if (topic == "saveCrashData")
	{
		//gaTrack('UA-1025658-9', 'CodeNinjas.com', "AV-" + encodeURIComponent(data)); 
	}
}

function lockItems()
{
	guiItemsLocked = true;
	chrome.contextMenus.removeAll();
	
	chrome.browserAction.setTitle({title: "CodeNinjas Editor is currently displayed.\r\nPlease close it to take the next capture.\r\n\r\n(switching to CodeNinjas Pro also helps!)"});
	chrome.browserAction.setPopup({popup: ""});
}

function unlockItems()
{
	guiItemsLocked = false;
	
	setTimeout(function () {updateContextMenu();}, 10);
	
	chrome.browserAction.setTitle({title: "Capture page"});
	chrome.browserAction.setPopup({popup: "fsPopup.html"});
}


try {
	chrome.extension.onMessage.addListener(
	  function(request, sender, sendResponse) {
		  
		switch (request.message)
		{
			case "getPortName": sendResponse({portName: commPortName}); break;
			case "loadScript": 
				clearTimeout(executeScriptTO);
				chrome.tabs.executeScript(tabId, {file:"scripts/fsUtils.js"},
					function()
					{
						chrome.tabs.executeScript(tabId, {file:"scripts/fsSelection.js"},
							function()
							{
								chrome.tabs.executeScript(tabId, {file:"scripts/fsContent.js"},
									function()
									{
										doCapturing(capAction, capMode);
									}
								);
							}
						);
					}
				);
			break;
			
			case "execScript": 
				clearTimeout(executeScriptTO);
				doCapturing(capAction, capMode); 
			break;
			
			case "checkHotkey": 
				function checkKey(prefName, defaultShortcut, callback)
				{
					var prefShortcut = getOption(prefName, defaultShortcut);
					if (prefShortcut == request.data && !shortcutProcessing && !ignoreShortcuts)
					{
						ignoreShortcuts = true;
						callback();
						setTimeout(function() {ignoreShortcuts = false;}, 1000);
						return true;
					}
					return false;
				}
				
				function getShortcutAction(prefName, defaultValue)
				{
					if (!isNativeSupported()) return cActionEdit;
					switch (parseInt(getOption(prefName, defaultValue)))
					{
						case 1: return cActionSave; 
						case 2: return cActionSavePDF; 
						case 3: return cActionSendOneNote; 
						case 4: return cActionUpload; 
						case 5: return cActionPrint; 
						case 6: return cActionClipboard; 
						case 7: return cActionEMail; 
						case 8: return cActionPaint; 
						default: return cActionEdit; 
					}
				}
			

				var checked = checkKey(cShortcutPref, cDefaultShortcut, function() {captureLastUsedMode();}) ||
					checkKey(cShortcutPrefVisible, cDefaultShortcutVisible, function() {
						capturePage(getShortcutAction(cShortcutPrefVisibleAction, cDefaultShortcutVisibleAction), cModeVisible);
					}) ||
					checkKey(cShortcutPrefEntire, cDefaultShortcutEntire, function() {
						capturePage(getShortcutAction(cShortcutPrefEntireAction, cDefaultShortcutEntireAction), cModeEntire);
					}) ||
					checkKey(cShortcutPrefSelection, cDefaultShortcutSelection, function() {
						capturePage(getShortcutAction(cShortcutPrefSelectionAction, cDefaultShortcutSelectionAction), cModeSelected);
					}) ||
					(isNativeSupported() &&	checkKey(cShortcutPrefBrowser, cDefaultShortcutBrowser, function() {
						capturePage(getShortcutAction(cShortcutPrefBrowserAction, cDefaultShortcutBrowserAction), cModeBrowser);
					})); 
				
			break;
			
			case "checkFSAvailabilityEvt":
			{
				sendResponse({FSAvailable: true, FSUpgraded:localStorage[cPluginProModePref] === "true"});
				break;
			} 
			
			case "capturePageEvt":
			{
				var action = parseInt(request.Action);
				if (action == cActionUpgrade)	
					doUpgrade();
				else
					capturePage(action, request.Entire == "true" ? cModeEntire : cModeVisible);
				break;
			}
			
			case "switchToNativeEvt":
			{
				installNative();
				break;
			}
			
		}
	  });
} catch(e) {}

/*
chrome.extension.onRequest.addListener(
	function(request, sender)
	{
		
	}
)*/

function checkBadgeAction()
{
	if (localStorage[cQueuedBadgeURLPref] && localStorage[cQueuedBadgeURLPref] != "undefined")
	{
		//openURL(localStorage[cQueuedBadgeURLPref]);
		//showBadge(undefined);
		localStorage[cFirstTimeRun] = false;
		localStorage[cCurrentVersion] = extVersion;
		return true;
	}
	return false;
}

function getMenuSettings(callback)
{
	chrome.windows.getLastFocused(function(window) {
		chrome.tabs.getSelected(window.id, function(tab) {
			chrome.tabs.executeScript(tab.id, {code:"{}"}, function () {
				
				var unsupported = (chrome.runtime.lastError !== undefined);
				var fPro = localStorage[cPluginProModePref] == "true";
				var fRegistered = localStorage[cRegisteredPref] == "true";
				var fLite = !isNativeSupported();
				
				callback({
					"mnuCaptureSelection"	: unsupported ? "disabled" : "visible",
					"mnuCaptureSelectionLite"	: "visible",
					"mnuPreferencesLite"		: fLite ? "visible" : "hidden"
				});
			});
		});
	});
}

function capturePage(Action, Mode)
{
	if (guiItemsLocked) return;
	
	capAction = Action;
	capMode = Mode;
	
	lastAction 	= capAction;
	lastMode 	= capMode;
	localStorage[cLastActionPref] 	= lastAction;
	localStorage[cLastModePref] 	= lastMode;
	
	updateLastAction();
	
	capId ++;

	chrome.windows.getLastFocused(function(window) {
		
		
		chrome.tabs.getSelected(null, function(tab)	{
			tabId = tab.id;
			chrome.tabs.executeScript(tab.id, {code:"{}"}, function () {
				var noExecScript = chrome.runtime.lastError !== undefined;
				
				// Окно захватываем напрямую в случае, если инжект скриптов невозможен, либо нам уже известны заголовок и url страницы
				if (Mode == cModeBrowser && (noExecScript || (tab.url !== undefined && tab.title !== undefined)))
					setTimeout(
						function()
						{
							logToConsole("Calling captureBrowser directly...");
							enableHotkey(false);
							lockItems();
							pluginCommand("captureBrowser", {action:Action + ":-", url:tab.url, title:tab.title});
							unlockItems();
							enableHotkey(true);
						},
						100
					);
				
				else
				{
					executeScriptTO = setTimeout(
						function()
						{
							doCapturing(Action, Mode);
						},
						1000
					);
												
					chrome.tabs.executeScript(tabId, {file:"scripts/fsScriptChecker.js"});
				}
			});
		});
	});
}

function getActionLocaleId(action)
{
	switch (action)
	{
		case cActionSave		: return "action_save"; 
		case cActionSavePDF		: return "action_save_pdf"; 
		case cActionClipboard	: return "action_copy";
		case cActionEMail		: return "action_email";
		case cActionPaint		: return "action_external";
		case cActionSendOneNote	: return "action_onenote";
		case cActionUpload		: return "action_upload";
		case cActionPrint		: return "action_print";
		default					: return "action_edit"; 
	}
}

function getLADescription()
{
	return "";
}

function doCapturing(Action, Mode)
{
	if (capId <= processedId++) 
	{
		capId = processedId;
		return;
	}
	
	var imgData = [];
	chrome.windows.getLastFocused(function(window) {
		chrome.tabs.getSelected(window.id,
			function(tab)
			{
				tabId            = tab.id;
				
				var port = chrome.tabs.connect(tabId, {name: commPortName});
				var markerDetected = false;
				
				port.postMessage({topic: "init", mode: Mode});
				port.onMessage.addListener(function(msg) {
					
					logToConsole(JSON.stringify(msg));
					
					switch(msg.topic)
					{
						case "initDone": 
						
							tabURL		= msg.url;
							tabTitle    = msg.title;
							enableHotkey(false);
							
							switch (Mode)
							{
								case cModeVisible	:
								case cModeEntire	: pluginCommand("captureInit"); port.postMessage({topic: "scrollNext"}); break;
								case cModeSelected	: pluginCommand("captureInit"); port.postMessage({topic: "selectArea"}); break;
								case cModeBrowser	: 
									enableHotkey(false);
									lockItems();
									pluginCommand("captureBrowser", {action:Action + ":-", url:tabURL, title:tabTitle});
									unlockItems();
									enableHotkey(true);
								break;
							}
						break;
						
						case "areaSelected": 
							port.postMessage({topic: "scrollNext"}); 
						break;
						
						case "areaSelectionCanceled": 
							enableHotkey(true); 
							port.onMessage.removeListener(arguments.callee);
						break;
						
						case "scrollDone": 
								chrome.tabs.captureVisibleTab(null, {format : "png"},
									function(data)
									{
										pluginCommand("captureTabPNG", {dataurl: data, datasize: data.length, x: msg.x, y: msg.y});
										port.postMessage({topic: "scrollNext"}); 
									});
						break;
						
						case "scrollFinished": 
							logToConsole("FINISHED (" + msg.rows + " x " + msg.cols + ")");
							
							msg.url = tabURL;
							msg.title = tabTitle;
							
							msg.key = "-";
							msg.action = Action;
							msg.browserVersion = parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);
							
							lockItems();
							pluginCommand("captureDone", msg);
							enableHotkey(true);
							unlockItems();
							
							port.onMessage.removeListener(arguments.callee);
						break;
					}
					
					
				});
			}
		);
	});
}

function genericOnClick(info, tab) 
{
	switch (info.menuItemId)
	{
		case mnuPreferences		: openExtensionPreferences(); break;
		case mnuCodeNinjasNative 	: installNative(); break;
	}
}

function updateLastAction()
{
	return;
}

var fEntered = false;
var mnuVisibleEdit, mnuVisibleSave, mnuVisibleSavePDF, mnuVisibleSendOneNote, mnuVisibleUpload, mnuVisiblePrint, mnuVisibleCopy, mnuVisibleEMail, mnuVisibleExtEditor, 
	mnuEntireEdit, mnuEntireSave, mnuEntireSavePDF, mnuEntireSendOneNote, mnuEntireUpload, mnuEntirePrint, mnuEntireCopy, mnuEntireEMail, mnuEntireExtEditor, 
	mnuSelectedEdit, mnuSelectedSave, mnuSelectedSavePDF, mnuSelectedSendOneNote, mnuSelectedUpload, mnuSelectedPrint, mnuSelectedCopy, mnuSelectedEMail, mnuSelectedExtEditor, 
	mnuBrowserEdit, mnuBrowserSave, mnuBrowserSavePDF, mnuBrowserSendOneNote, mnuBrowserUpload, mnuBrowserPrint, mnuBrowserCopy, mnuBrowserEMail, mnuBrowserExtEditor, 
	mnuResume, mnuOpenFile, mnuOpenClipboard, mnuPreferences, mnuRegister, mnuEnterLicense, mnuUpgrade, mnuViewDemo, mnuSupport, mnuAPI, mnuUniblue, mnuLicensingInfo, mnuAbout, mnuCodeNinjasNative;



function updateContextMenu()
{
	return; // no context menu please

}

function notificationBoxEvent(event) {
	alert(event);
}

function restoreBadge() {
	if (localStorage[cQueuedBadgeURLPref] && localStorage[cQueuedBadgeURLPref] != "undefined")
		showBadge(localStorage[cQueuedBadgeURLPref]);
}

function initAnalytics() {
	return;
}

lastAction 	= parseInt(getOption(cLastActionPref, cActionEdit));
lastMode 	= parseInt(getOption(cLastModePref, cModeEntire));

document.addEventListener('DOMContentLoaded', function () {
	restoreBadge();
	getVersionInfo();
	updateContextMenu();
});

