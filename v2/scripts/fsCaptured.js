window.addEventListener('load', function () {
	
	var backgroundPage = null;
	const cShowAlert1OptionName = "showAlert1";
	
	function setupAccessibility()
	{
		if (isWindows())
			$("#divPromo,#upgradeLink").removeClass("hiddenInitially");
			
		if (navigator.mimeTypes ["application/x-shockwave-flash"] === undefined) {
			$("#divFlashSave").hide();
			$("#divFlashSavePDF").hide();	
		}
	}
	
	/***************************************************************************************/
	
	function addSaveButton()
	{
		var flashVars = {
				data: backgroundPage.capResultDataURL.replace(/^data:image\/(png|jpeg);base64,/, "").replace(/\+/g, "%2b"),
				dataType: "base64",
				filename: backgroundPage.capResultFileNameLite + "." + getOption(cDefaultImageFormatPref, "png")
			}, 
			params = {
				allowScriptAccess: "always",
				wmode: "transparent"
			};
			
		swfobject.embedSWF("media/save.swf", "spnFlashSaveContainer", "120", "30", "10", null, flashVars, params);	
	}
	
	/***************************************************************************************/
	
	function addSavePDFButton()
	{
		var img = backgroundPage.capResult;
		var doc = new jsPDF(img.width > img.height ? "l" : "p", "in", [img.height / 96, img.width / 96]);
		doc.addImage(backgroundPage.capResult.toDataURL("image/jpeg"), 'JPEG', 0, 0, img.width / 96, img.height / 96);
		
		var flashVars = {
				data: doc.output('datauristring').replace(/^data:image\/(png|jpeg);base64,/, "").replace(/\+/g, "%2b"),
				dataType: "base64",
				filename: backgroundPage.capResultFileNameLite + ".pdf"
			}, 
			params = {
				allowScriptAccess: "always",
				wmode: "transparent"
			};
		
		swfobject.embedSWF("media/save.swf", "spnFlashSavePDFContainer", "120", "30", "10", null, flashVars, params);
	}
	
	/***************************************************************************************/
	
	function initHandlers()
	{
		$("#btnPrint").click(function() {
			var iframe = document.createElement("IFRAME");
			
			$(iframe).attr({
				style: "width:0px;height:0px;",
				id: "fsTempElement"
			});
			
			document.body.appendChild(iframe);
			iframe.contentWindow.document.write("<div style='margin:0 auto;text-align:center'><img style='width:100%' src='" + document.getElementById("imgResult").src + "'></div>");
		
			iframe.contentWindow.print(); 
			$("#fsTempElement").remove();
		});
		
		$("#lnkOptions").click(function() {
			backgroundPage.openExtensionPreferences();
		});
		
		$("#lnkRecommend").click(function() {
			backgroundPage.openURL("http://getCodeNinjas.com/like.php?browser=" + (isOpera() ? "op" : "ch") + "&ver=" + backgroundPage.extVersion);
		});
		
		$("#btnCloseAlert1").click(function() {
			localStorage[cShowAlert1OptionName] = 0;
		});	

		var options = localStorage.settings.split(":::")[1].split("||"); 
		for (var i=0;i<options.length;i++) {
			$('#website').append('<option value="' + options[i] + '">' + options[i] + '</option>');
		}
		
		
		//$("#website").

		$("#sendBtn").click(function() {

                        fd = new FormData();
                        localStorage.login =  'postnikov@gmail.com';
                        localStorage.passwd =  '11111111';
                        fd.append('title', $("#title").val() ? $("#title").val():"New post");
                        fd.append('body', $("#comment").val());//  + "\n\n <img src='" + document.getElementById("imgResult").src + "'>");
                        fd.append('user', localStorage.login );
                        fd.append('password', localStorage.passwd );
                        fd.append('img', document.getElementById("imgResult").src);
                        fd.append('website', $("#website").val());
                        //fd.append('acl', "public-read");
                        //fd.append('content-type', "image/png");
                        //fd.append('AWSAccessKeyId', res.key);
                        //fd.append('policy', res.policy);
                        //fd.append('signature', res.signature);
                        //fd.append('file', dataToBlob(getMerged()));
                        $('body').addClass('upload');
                        $('#loading').show();


                    
                    
                    var showProgress = function(e) {
                        $('#progress_bar').css('width', Math.round(100 * (e.loaded / e.total)) + '%');
                    }
                    
                    $.ajax({
                        type: 'POST',
                        url: 'http://codingninjas.co/rpc/post2.php',
                        data: fd,
                        processData: false,
                        contentType: false,
                        xhr: function() {
                            var myXhr = $.ajaxSettings.xhr();
                            if(myXhr.upload){
                                myXhr.upload.addEventListener('progress',showProgress, false);
                            }
                            
                            return myXhr;
                        }
                    }).done(function(data) {
                        $('body').removeClass('upload');
                        
                        // On purpose lag to not flash the status bar
                        setTimeout(function() {
                            //$('#loading').hide();
                            $('#progress_bar').css('width', '0%');
                            $('#progress').hide();
                            $('#progress_result').show(500);
                            
                            //window.open('http://screenshot.co/' + id);
                            
                        }, 300);
                    	//window.close();
                        
                    });
			
		});
	}

	/***************************************************************************************/
	
	function showWarnings()
	{
		if (isWindows() && localStorage[cPluginProModePref] && localStorage[cShowAlert1OptionName] === undefined)
			setTimeout(function() {$("#divAlert1").fadeIn(700)}, 1000);
	}
	
	/***************************************************************************************/
	
	function showPage()
	{
		$(".container").show();
		
		document.getElementById("imgResult").src = backgroundPage.capResultDataURL;
		document.title = backgroundPage.capResultFileNameLite;//backgroundPage.tabTitle + " (" + backgroundPage.tabURL + ")";
		
		var img = backgroundPage.capResult;
		var div = document.getElementById("divImgResult");
		if (img.width < $("#divImgResult").width())
		{
			$("#imgResult").css("width", "auto");
			$("#divImgResult").css("overflow-y", "hidden");
			div.style.zoom = 1.0000001;
			setTimeout(function(){div.style.zoom = 1;},50);
		}
		
		else if (div.clientHeight >= div.scrollHeight)
		{
			$("#divImgResult").css("overflow-y", "hidden");
			div.style.zoom = 1.0000001;
			setTimeout(function(){div.style.zoom = 1;},50);
		}
	}
	
	/***************************************************************************************/
	
	function setupStyle()
	{
		/*var cssLoaded = function ()
		{
			console.log("sadf");
		}
		
		
		var sheet = document.getElementById("pagestyle");
		if (sheet) sheet.parentNode.removeChild(sheet);
		
		$('head').append('<link onload="cssLoaded" id="pagestyle" href="css/bootstrap.original.min.css" rel="stylesheet">');*/
	}
	
	/***************************************************************************************/
	
	function init()
	{
	
		try {
			i18nPrepare();
		} 
		catch (e) {logError(e.message);}
		
		chrome.runtime.getBackgroundPage(function (bp) {
			if (!bp) return;
			
			backgroundPage = bp;
			
			addSaveButton();
			addSavePDFButton();
			setupAccessibility();
			initHandlers();
			
			showPage();
			showWarnings();
		});
	}
	
	init();
});