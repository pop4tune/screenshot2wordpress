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

	var iZoom = 1;
	var context;
	var canvas;
	var imgObj;

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

		$("#zoomIn").click(function() {
				//var div = document.getElementById("divImgResult");
				iZoom = iZoom * 1.25;
				var w = backgroundPage.capResult.width * iZoom;
				var h = backgroundPage.capResult.height * iZoom;
	            canvas.attr({width: w, height: h}).css({'background-size': '' +w + 'px ' +	 h + 'px'});
				//console.log(context,iZoom);
				//context.scale(iZoom, iZoom);
				//context.rotate(45);
				//context.clearRect(0, 0, 100000, 100000);
				//context.drawImage(backgroundPage.capResult, 0,0, backgroundPage.capResult.width * iZoom, backgroundPage.capResult.height * iZoom)
		});
		$("#zoomOut").click(function() {
				//var div = document.getElementById("divImgResult");
				iZoom = iZoom * 0.75;
				var w = backgroundPage.capResult.width * iZoom;
				var h = backgroundPage.capResult.height * iZoom;
	            canvas.attr({width: w, height: h}).css({'background-size': '' +w + 'px ' +	 h + 'px'});

				//div.style.zoom = iZoom;
				//context.scale(iZoom, iZoom);
				//canvas.width = backgroundPage.capResult.width * iZoom;
				//canvas.height = backgroundPage.capResult.height * iZoom;
				//context.clearRect(0, 0, canvas.width, canvas.height );
				//context.drawImage(backgroundPage.capResult, 0,0, backgroundPage.capResult.width * iZoom, backgroundPage.capResult.height * iZoom)
		});

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

						var getMerged = function() {
			                // Create the merged image
			                var mergeCanvas = document.createElement('canvas'),
			                    mergeContext = mergeCanvas.getContext('2d');
			                    
			                    mergeCanvas.width = canvas[0].width;
			                    mergeCanvas.height = canvas[0].height;
			                    
			                    mergeContext.drawImage(imgObj, 0, 0, canvas[0].width, canvas[0].height);
			                    mergeContext.drawImage(canvas[0], 0, 0);
			                return mergeCanvas.toDataURL("image/png");
			            }
                        fd = new FormData();
                        localStorage.login =  'postnikov@gmail.com';
                        localStorage.passwd =  '11111111';
                        fd.append('title', $("#title").val() ? $("#title").val():"New post");
                        fd.append('body', $("#comment").val());//  + "\n\n <img src='" + document.getElementById("imgResult").src + "'>");
                        fd.append('user', localStorage.login );
                        fd.append('userid', localStorage.userid );
                        fd.append('password', localStorage.passwd );
                        fd.append('img', getMerged());//document.getElementById("imgResult").src);
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
                        url: 'http://codingninjas.co/rpc/submit-ticket.php',
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
		
		//document.getElementById("imgResult").src = backgroundPage.capResultDataURL;
        canvas = $('<canvas />').attr('id', 'imgSketch'),
            context = canvas[0].getContext('2d'),
            imgObj = new Image();

		//canvas = $("#imgSketch")[0];

        imgObj.onload = function() {
	        /*canvas.width = imageObj.width;
	        canvas.height = imageObj.height;
	        console.log(imageObj.width, imageObj.height);
	        //context.drawImage(this, 0, 0);
	        $("#imgSketch").css({"background-url": backgroundPage.capResultDataURL});
	        //$('#imgSketch').sketch({defaultColor: "#ff0"});*/
            canvas.attr({width: this.width, height: this.height}).css({backgroundImage: "url(" + backgroundPage.capResultDataURL + ")", backgroundRepeat:'none'});
	        canvas.appendTo(document.getElementById("divImgResult"));
	        canvas.sketch({defaultColor: "#ff0000"});
        };


        imgObj.src = backgroundPage.capResultDataURL;

		document.title = backgroundPage.capResultFileNameLite;//backgroundPage.tabTitle + " (" + backgroundPage.tabURL + ")";
		return;
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