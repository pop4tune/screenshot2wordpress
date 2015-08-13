window.addEventListener('load', function () {
	
	var backgroundPage = null;
	const cShowAlert1OptionName = "showAlert1";
	var iZoom = 1;
	var context;
	var canvas;
	var imgObj;


	function initHandlers()
	{

		$("#zoomIn").click(function() {
				//var div = document.getElementById("divImgResult");
				iZoom = iZoom * 1.2;
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
				iZoom = iZoom * 0.8;
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

		/*$("#btnPrint").click(function() {
			var iframe = document.createElement("IFRAME");
			
			$(iframe).attr({
				style: "width:0px;height:0px;",
				id: "fsTempElement"
			});
			
			document.body.appendChild(iframe);
			iframe.contentWindow.document.write("<div style='margin:0 auto;text-align:center'><img style='width:100%' src='" + document.getElementById("imgResult").src + "'></div>");
		
			iframe.contentWindow.print(); 
			$("#fsTempElement").remove();
		});*/


		
		/*$("#lnkOptions").click(function() {
			backgroundPage.openExtensionPreferences();
		});*/
				
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
                        //localStorage.login =  'postnikov@gmail.com';
                        //localStorage.passwd =  '11111111';
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

    		var img = backgroundPage.capResult;
			var div = document.getElementById("divImgResult");

			// pre-calculate zoom
			if (img.width > $("#divImgResult").width()) {
				iZoom = 0.999999 * $("#divImgResult").width() / img.width;
			}
			if (img.height > $("#divImgResult").height()) {
				var zoom2 = 0.999999 *  $("#divImgResult").height() / img.height;
				if (iZoom > zoom2) iZoom = zoom2;
			}
			//console.log(iZoom);



		//canvas = $("#imgSketch")[0];

        imgObj.onload = function() {
	        /*canvas.width = imageObj.width;
	        canvas.height = imageObj.height;
	        console.log(imageObj.width, imageObj.height);
	        //context.drawImage(this, 0, 0);
	        $("#imgSketch").css({"background-url": backgroundPage.capResultDataURL});
	        //$('#imgSketch').sketch({defaultColor: "#ff0"});*/
			var w = backgroundPage.capResult.width * iZoom;
			var h = backgroundPage.capResult.height * iZoom;
            canvas.css({backgroundImage: "url(" + backgroundPage.capResultDataURL + ")", backgroundRepeat:'none'});
            canvas.attr({width: w, height: h}).css({'background-size': '' +w + 'px ' +	 h + 'px'});

	        canvas.appendTo(document.getElementById("divImgResult"));
	        canvas.sketch({defaultColor: "#ff0000"});
        };


        imgObj.src = backgroundPage.capResultDataURL;

		document.title = backgroundPage.capResultFileNameLite;//backgroundPage.tabTitle + " (" + backgroundPage.tabURL + ")";
		return;
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
			
		chrome.runtime.getBackgroundPage(function (bp) {
			if (!bp) return;
			
			backgroundPage = bp;
			
			//addSaveButton();
			//addSavePDFButton();
			//setupAccessibility();
			initHandlers();
			
			showPage();
			showWarnings();
		});
	}
	
	init();
});