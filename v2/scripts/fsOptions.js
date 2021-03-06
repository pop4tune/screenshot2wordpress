var CodeNinjasSettings = {

	hkModifiers : "ctrl, alt",
	hkKey		: "Z",
	hkKeyCode	: 0,

	
	loadSettings : function()
	{
		$("#edtHotkeyLastUsedAction").val(getOption(cShortcutPref, cDefaultShortcut));
		$("#edtHotkeyVisible").val(getOption(cShortcutPrefVisible, cDefaultShortcutVisible));
		$("#edtHotkeySelection").val(getOption(cShortcutPrefSelection, cDefaultShortcutSelection));
		$("#edtHotkeyEntire").val(getOption(cShortcutPrefEntire, cDefaultShortcutEntire));
		$("#edtHotkeyBrowser").val(getOption(cShortcutPrefBrowser, cDefaultShortcutBrowser));
		
		$("#edtFilenameTemplate").val(getOption(cTemplatePref, cDefaultTemplate));
		$("#edtTemplateNumber").val(getOption(cTemplateNumberPref, 1));
		$("#chkTemplateNumberPad").prop('checked', getOption(cTemplateNumberPadCheckPref, true) === "true");
		$("#edtTemplateNumberPad").val(getOption(cTemplateNumberPadValuePref, 3));
		
		var fPng = getOption(cDefaultImageFormatPref, "png") === "png";
		$("#radImagePNG").prop('checked', fPng);
		$("#radImageJPG").prop('checked', !fPng);
		
		$("#edtTemplateFilenameMaxLen").val(getOption(cTemplateFilenameMaxLen, 100));
		
		$("#cmbVisibleHotkeyAction").val(getOption(cShortcutPrefVisibleAction, cDefaultShortcutVisibleAction));
		$("#cmbSelectionHotkeyAction").val(getOption(cShortcutPrefSelectionAction, cDefaultShortcutSelectionAction));
		$("#cmbEntireHotkeyAction").val(getOption(cShortcutPrefEntireAction, cDefaultShortcutEntireAction));
		$("#cmbBrowserHotkeyAction").val(getOption(cShortcutPrefBrowserAction, cDefaultShortcutBrowserAction));
	},

	saveSettings: function()
	{
		localStorage[cShortcutPref] = $("#edtHotkeyLastUsedAction").val();
		localStorage[cShortcutPrefVisible] = $("#edtHotkeyVisible").val();
		localStorage[cShortcutPrefSelection] = $("#edtHotkeySelection").val();
		localStorage[cShortcutPrefEntire] = $("#edtHotkeyEntire").val();
		localStorage[cShortcutPrefBrowser] = $("#edtHotkeyBrowser").val();
		
		localStorage[cShortcutPrefVisibleAction] = $("#cmbVisibleHotkeyAction").val();
		localStorage[cShortcutPrefSelectionAction] = $("#cmbSelectionHotkeyAction").val();
		localStorage[cShortcutPrefEntireAction] = $("#cmbEntireHotkeyAction").val();
		localStorage[cShortcutPrefBrowserAction] = $("#cmbBrowserHotkeyAction").val();
		
		localStorage[cTemplatePref] = $("#edtFilenameTemplate").val();
		localStorage[cTemplateNumberPref] = parseInt($("#edtTemplateNumber").val());
		localStorage[cTemplateNumberPadCheckPref] = $("#chkTemplateNumberPad").prop("checked");
		localStorage[cTemplateNumberPadValuePref] = Math.max(0, parseInt($("#edtTemplateNumberPad").val()));
		localStorage[cDefaultImageFormatPref] = $("#radImagePNG").prop("checked") ? "png" : "jpg";
		localStorage[cTemplateFilenameMaxLen] = Math.max(10, parseInt($("#edtTemplateFilenameMaxLen").val()));
		
		getExtension().updateContextMenu();
	},
	
	processHotkey: function(elem, event)
	{
		event.preventDefault();
		event.stopPropagation();
		
		var v = getShortcut(event);
		
		if (v != "") 
			elem.val(v);
	}
};

document.addEventListener('DOMContentLoaded', function () {
  
	try {
		i18nPrepare();
	} 
	catch (e) {logError(e.message);}
	
	$('#container').show();
  
	$('#btnCapSettings').click(function() {
		getExtension().openCaptureSettings();
	});

	$('#btnGeneralOptions').click(function() {
		getExtension().openSettings();
	});

	$('#btnApply').click(function() {
		CodeNinjasSettings.saveSettings(); 
	});

	$('#btnSave').click(function() {
		CodeNinjasSettings.saveSettings(); 
		window.close();
	});
	
	$('#edtHotkeyLastUsedAction').keydown(function(event) {
		CodeNinjasSettings.processHotkey($(this), event);
	});

	$('#edtHotkeyVisible').keydown(function(event) {
		CodeNinjasSettings.processHotkey($(this), event);
	});
	
	$('#edtHotkeyEntire').keydown(function(event) {
		CodeNinjasSettings.processHotkey($(this), event);
	});
	
	$('#edtHotkeySelection').keydown(function(event) {
		CodeNinjasSettings.processHotkey($(this), event);
	});
	
	$("#btnTemplateSettings").click(function(){
		$(this).toggle();
		$("#divTemplateSettings").toggle();
	});
	
	$("#btnTemplateSettingsHide").click(function(){
		$("#btnTemplateSettings").toggle();
		$("#divTemplateSettings").toggle();
	});
	
	
	
	var fLite = !getExtension().isNativeSupported();
	
	$(".native").toggle(!fLite);
	$(".lite").toggle(fLite);
	
	CodeNinjasSettings.loadSettings();
});


