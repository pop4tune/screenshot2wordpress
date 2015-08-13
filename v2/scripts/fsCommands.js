function openSettings()
{
	lockItems();
	pluginCommand("openSettings");
	unlockItems();
}

function openExtensionPreferences()
{
	chrome.tabs.create({url: "fsOptions.html"});
}

function doRegister()
{
}

function openDemoPage()
{
}

function openSupportPage()
{
	openURL("http://getCodeNinjas.com/sup/frm12.htm");
}

function openAPIPage()
{
}


function resumeEditing()
{
	lockItems();
	pluginCommand("resumeEditing");
	unlockItems();
}

function captureLastUsedMode()
{
	capturePage(lastAction, lastMode);
}

function openCaptureSettings()
{
	lockItems();
	pluginCommand("ieCaptureOptions");
	unlockItems();	
}

function doUpgrade()
{
	lockItems();
	//pluginCommand("upgradeToPro");
	unlockItems();	
}

function enterLicense()
{
	lockItems();
	//pluginCommand("enterLicense");
	unlockItems();	
}

function openFile()
{
	lockItems();
	pluginCommand("openFile");
	unlockItems();	
}

function openClipboard()
{
	lockItems();
	pluginCommand("openFromClipboard");
	unlockItems();	
}

function notSupported()
{
	//openURL("http://getCodeNinjas.com/not-supported.php");
}

function showLicenseInfo()
{
	lockItems();
	//pluginCommand("showLicensingInfo");
	unlockItems();
}

function showAbout()
{
	lockItems();
	pluginCommand("showAboutWindow");
	unlockItems();
	//alert(1);
	/*
	var port = chrome.runtime.connectNative('com.getCodeNinjas.api');
	//alert(port);
	port.onMessage.addListener(function(msg) {
	  console.log("Received: " + msg.text);
	});
	port.onDisconnect.addListener(function() {
	  console.log("Disconnected");
	});
	port.postMessage({ text: "Hello, my_application" });*/
}

function installNative()
{
	chrome.tabs.create({url: "fsNativeInstall.html"});
}