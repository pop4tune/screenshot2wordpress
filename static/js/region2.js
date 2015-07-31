(function($) {
	const timeout = 200;
	
	var firstTime = true;
	var rows = 1, cols = 1;
	var mode = 0;
	var horzMoving = true, vertMoving = true;
	var clientWidth = 0, clientHeight = 0;
	var scrollStart = {left : 0, top : 0};
	var scrollEnd 	= {left : 0, top : 0};
	var cropRect = {left: 0, top: 0, right: 0, bottom: 0};
	var cModeEntire = false;
	var cModeVisible = false;
	var cModeBrowser = false;
	var cModeSelected = true;
	
	var divElement, doc, body, savedScrollTop, savedScrollLeft, docWidth, docHeight;
	var isDebug = true;

var commPortName;

!chrome.extension.sendMessage || chrome.extension.sendMessage({message: "getPortName"}, function(response) {
  commPortName = response.portName;
  logToConsole("Obtained port name: " + commPortName);
});

function enableSomeElements(enable)
{
	if (typeof enable === "undefined") 
		enable = true;
	
	var elem;
	if (window.location.href.match(/https?:\/\/mail\.google\.com/i))
	{
		var itr = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT, null, false);

		var currentNode;
		while (currentNode = itr.nextNode())
			if (currentNode.nodeName == "TD" && currentNode.getAttribute("class") && currentNode.getAttribute("class").match(/Bu y3/i))
			{
				//alert(currentNode.nodeName);
				currentNode.style.setProperty("display", enable ? "" : "none", "important");
			}

		if (elem = document.getElementById(':ro'))
			elem.style.setProperty("display", enable ? "" : "none", "important");
		if (elem = document.getElementById(':5'))
			elem.style.setProperty("display", enable ? "" : "none", "important");
	}
	
	else if (window.location.href.match(/https?:\/\/www\.(facebook|fb)\.com/i) 
		&& (elem = document.getElementById("rightCol")))
	{
		elem.style.setProperty("display", enable ? "" : "none", "important");
	}
}

var FireShotSelection = 
{
	holder 		: undefined,
	wrapper		: undefined,
	info		: undefined,
	doc			: undefined,
	body		: undefined,
	onSelected	: undefined,
	cursor  	: undefined,
	borders		: [],
	outer		: [],
	x1			: 0,
	y1			: 0,
	x2			: 0,
	y2			: 0,
	prevx		: 0,
	prevy		: 0,
	
	destroyed	: false,
	
	makeSelection : function(onSelected)
	{
		this.onSelected = onSelected;
		this.destroyed = false;
		
		with (this)
		{
			x1 = x2 = y1 = y2 = 0;
			
			doc	= window.document;
			body = doc.body;

			cursor = document.body.style.cursor;
			document.body.style.cursor = "crosshair";
			
			holder = document.createElement('div');
			holder.style.cssText = "position: absolute; left: 0px; top: 0px; width: 0px; height: 0px; z-index: 2147483640; cursor: crosshair;";
			
			info = document.createElement('div');
			info.style.cssText = "font-family: Tahoma; font-size:14px; color: #fff; left: 5px; top: 5px; width:auto; height:auto; padding: 3px; background: #000; opacity: 0.8; position:absolute; border:#333 solid 1px; cursor: crosshair;";
			
			wrapper = document.createElement('div');
		
			wrapper.style.cssText = "position: absolute; left: 0px; top: 0px; opacity: 0; cursor: crosshair; z-index: 2147483641;";
		
			document.body.appendChild(wrapper);
			
			for (var i = 0; i < 4; i ++)
			{
				borders.push(document.createElement('div'));
				
				var cssText;
				
				switch (i)
				{
					case 0: cssText = "background: url('data:image/gif;base64,R0lGODlhAQAGAKEAAP///wAAADY2Nv///yH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQACgD/ACwAAAAAAQAGAAACAxQuUgAh+QQBCgADACwAAAAAAQAGAAACA5SAUgAh+QQBCgADACwAAAAAAQAGAAACA5SBBQAh+QQBCgADACwAAAAAAQAGAAACA4QOUAAh+QQBCgADACwAAAAAAQAGAAACAwSEUAAh+QQBCgADACwAAAAAAQAGAAACA4SFBQA7') repeat-y left top;"; break;
					case 1: cssText = "background: url('data:image/gif;base64,R0lGODlhBgABAKEAAP///wAAADY2Nv///yH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQACgD/ACwAAAAABgABAAACAxQuUgAh+QQBCgADACwAAAAABgABAAACA5SAUgAh+QQBCgADACwAAAAABgABAAACA5SBBQAh+QQBCgADACwAAAAABgABAAACA4QOUAAh+QQBCgADACwAAAAABgABAAACAwSEUAAh+QQBCgADACwAAAAABgABAAACA4SFBQA7') repeat-x left top;"; break;
					case 2: cssText = "background: url('data:image/gif;base64,R0lGODlhAQAGAKEAAP///wAAADY2Nv///yH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQACgD/ACwAAAAAAQAGAAACAxQuUgAh+QQBCgADACwAAAAAAQAGAAACA5SAUgAh+QQBCgADACwAAAAAAQAGAAACA5SBBQAh+QQBCgADACwAAAAAAQAGAAACA4QOUAAh+QQBCgADACwAAAAAAQAGAAACAwSEUAAh+QQBCgADACwAAAAAAQAGAAACA4SFBQA7') repeat-y right top;"; break;
					case 3: cssText = "background: url('data:image/gif;base64,R0lGODlhBgABAKEAAP///wAAADY2Nv///yH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQACgD/ACwAAAAABgABAAACAxQuUgAh+QQBCgADACwAAAAABgABAAACA5SAUgAh+QQBCgADACwAAAAABgABAAACA5SBBQAh+QQBCgADACwAAAAABgABAAACA4QOUAAh+QQBCgADACwAAAAABgABAAACAwSEUAAh+QQBCgADACwAAAAABgABAAACA4SFBQA7') repeat-x left bottom;"; break;
				}
				
				borders[i].style.cssText = cssText + " opacity: 0.5; position: absolute; cursor: crosshair;";
				holder.appendChild(borders[i]);
				
				outer.push(document.createElement('div'));
				outer[i].style.cssText = "position: absolute; background: #000; opacity: 0.3; z-index: 2147483640; cursor: crosshair;";
				
				document.body.appendChild(outer[i]);
			}
			
			holder.appendChild(info);
			document.body.appendChild(holder);

			update();
			
			wrapper.addEventListener('mousedown', wrapperMouseDown, true);
			document.addEventListener('keydown', onKeyDown, false);
		}
	},
	
	wrapperMouseDown: function(e)
	{
		if (e.button == 0) 
		{
			FireShotSelection.wrapper.removeEventListener('mousedown', FireShotSelection.wrapperMouseDown, true);
			
			function wrapperMouseMove(e) 
			{
				var shift = FireShotSelection.autoScroll(e);

				FireShotSelection.x2 = shift.dx + e.pageX;
				FireShotSelection.y2 = shift.dy + e.pageY;
				FireShotSelection.update();
			}
			
			function wrapperMouseUp(e) {
				
				//FireShotSelection.x2 = e.pageX;
				//FireShotSelection.y2 = e.pageY;

				FireShotSelection.wrapper.removeEventListener('mousemove', wrapperMouseMove, false);
				document.removeEventListener('mouseup', wrapperMouseUp, false);
				FireShotSelection.update();
				FireShotSelection.completed();
			}
			
			FireShotSelection.x1 = e.pageX;
			FireShotSelection.y1 = e.pageY;
			
			FireShotSelection.prevx = e.pageX;
			FireShotSelection.prevy = e.pageY;
			
			FireShotSelection.wrapper.addEventListener('mousemove', wrapperMouseMove, false);
			document.addEventListener('mouseup', wrapperMouseUp, false);
			
		}	
		e.preventDefault();
		return true;		
	},
	
	onKeyDown: function(e) 
	{
		if (e.keyCode == 27) 
		{
			//FireShotSelection.onSelected = 0;
			FireShotSelection.x1 = 0;
			FireShotSelection.y1 = 0;
			FireShotSelection.x2 = 0;
			FireShotSelection.y2 = 0;
			
			FireShotSelection.completed();
		}
	},

	update: function()
	{
		with (this)
		{
			if (destroyed) return;
			
			var docWidth = doc.compatMode == "CSS1Compat" ? doc.documentElement.scrollWidth : body.scrollWidth;
			var docHeight = doc.compatMode == "CSS1Compat" ? doc.documentElement.scrollHeight : body.scrollHeight;
			
			var left = Math.min(x1, x2), top = Math.min(y1, y2), width = Math.abs(x2 - x1), height = Math.abs(y2 - y1);
			
			holder.style.left = left + "px";
			holder.style.top = top + "px";
			holder.style.width = width + "px";
			holder.style.height = height + "px";
			
			wrapper.style.width = docWidth + "px";
			wrapper.style.height = docHeight + "px";
			
			
			outer[0].style.left = 0 + "px" ;
			outer[0].style.top = 0 + "px";
			outer[0].style.width = docWidth + "px";
			outer[0].style.height = holder.style.top;

			outer[1].style.left = 0 + "px";
			outer[1].style.top = top + height + "px";
			outer[1].style.width = docWidth + "px";
			outer[1].style.height = docHeight - (top + height) + "px";
			
			outer[2].style.left = 0 + "px";
			outer[2].style.top = top + "px";
			outer[2].style.width = left + "px";
			outer[2].style.height = height + "px";
		
			outer[3].style.left = left + width + "px";
			outer[3].style.top = top + "px";
			outer[3].style.width = docWidth - (left + width) + "px";
			outer[3].style.height = height + "px";
			
			for (var i = 0; i < 4; i ++)
			{
				borders[i].style.left = 0 + "px";
				borders[i].style.top = 0 + "px";
				borders[i].style.right = 0 + "px";
				borders[i].style.bottom = 0 + "px";
			}
			
			info.innerHTML = width + " x " + height;
			info.style.visibility = info.scrollWidth + 11 < width && info.scrollHeight + 11 < height ? "visible" : "hidden";
		}
	},
	
	autoScroll: function(e) 
	{
		with (this)
		{
			var shift = {dx:body.scrollLeft, dy:body.scrollTop},
				speed = 2;
			
			
			if (e.clientX < 100 && prevx > e.clientX) body.scrollLeft -= (100 - e.clientX) / speed;
			if (e.clientY < 100 && prevy > e.clientY) body.scrollTop -=  (100 - e.clientY) / speed;

			var dX = window.innerWidth - e.clientX;
			if (dX < 100 && prevx < e.clientX) body.scrollLeft += (100 - dX) / speed; 

			var dY = window.innerHeight - e.clientY;
			if (dY < 100 && prevy < e.clientY) body.scrollTop += (100 - dY) / speed; 
			
			prevx = e.clientX;
			prevy = e.clientY;
			
			shift.dx = body.scrollLeft - shift.dx;
			shift.dy = body.scrollTop - shift.dy;
			
			return shift;
		}
	},
	
	completed: function()
	{
		with (this)
		{
			if (destroyed) return;
			
			destroyed = true;
			wrapper.removeEventListener('mousedown', wrapperMouseDown, true);
			document.removeEventListener('keydown', onKeyDown, false);
			
			document.body.style.cursor = cursor;
			document.body.removeChild(holder);
			document.body.removeChild(wrapper);
			
			for (var i = 0; i < 4; i ++)
				document.body.removeChild(outer[i]);
				
			if (onSelected)
				onSelected({left: Math.min(x1, x2), top: Math.min(y1, y2), right: Math.max(x1, x2), bottom: Math.max(y1, y2)});
		}
	}
}

function hideStubbornElements()
{
	function elementExists(elem) 
	{
		for (var i = 0; i < stubbornNodes.length; ++i)
			if (stubbornNodes[i].elem === elem) return true;
			
		return false;
	}
	
	var itr = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT, null, false), current;
	while (current = itr.nextNode()) 
	{
		var style = document.defaultView.getComputedStyle(current, "");
		if (style && style.getPropertyValue("position") == "fixed" && !elementExists(current) && style.getPropertyValue("display") != "none")
		{
			logToConsole("Found stubborn element " + current.id);
			stubbornNodes.push({elem: current, opacity: style.getPropertyValue("opacity")});
		}
	}
	
	for (var i = 0; i < stubbornNodes.length; ++i)
		//stubbornNodes[i].elem.style.setProperty("display", "none");
		stubbornNodes[i].elem.style.setProperty("opacity", "0");
}

function showStubbornElements()
{
	for (var i = 0; i < stubbornNodes.length; ++i)
		stubbornNodes[i].elem.style.setProperty("opacity", stubbornNodes[i].opacity);
		
	stubbornNodes = [];
}

function logToConsole(data)
{
	if (isDebug)
		console.log(data);
}
				


/*FireShotSelection.makeSelection(function (data) 
{
	if (data.left == data.right || data.top == data.bottom)
		cancelSelection()
	else
	{
		body.scrollLeft = data.left;
		body.scrollTop 	= data.top;
		
		scrollStart.left = body.scrollLeft;
		scrollStart.top  = body.scrollTop;
		
		cropRect.left 	= data.left;
		cropRect.top	= data.top;
		cropRect.right	= data.right;
		cropRect.bottom	= data.bottom;
		
		port.postMessage({topic: "areaSelected"}); 
	}
	
	
});
*/

var initRegion = function (msg) {

	/*if (chrome.extension.sendMessage && port.name != commPortName) {
		logToConsole("Comm port name is wrong: " + port.name + " <> " + commPortName);
		return;
	}*/
	
	
		switch (msg.topic)
		{
			case "init": 
				stubbornNodes = [];
				mode = msg.mode;				
				doc = window.document;
				divElement = undefined;
				
				if (mode == cModeEntire)
				{
					divElement = findScrolledElement(doc.body.scrollWidth, doc.body.scrollHeight);
					
					if (divElement) 
					{
						divElement.scrollIntoView();
						disableFloatingInView(divElement);
					}
				}
				
				body = divElement || doc.body;
				savedScrollTop = body.scrollTop;
				savedScrollLeft = body.scrollLeft;
				docWidth = body.scrollWidth;
				docHeight = body.scrollHeight;

				if (!divElement)
				{
					docWidth = Math.max(doc.documentElement.scrollWidth, body.scrollWidth);
					docHeight = Math.max(doc.documentElement.scrollHeight, body.scrollHeight);

					if (docWidth <= 0 || docHeight <= 0) 
					{
						var e = getAltExtents();
						docWidth = e.Width;
						docHeight = e.Height;
					}
					
					if (docWidth <= 0) docWidth = 1024;
					if (docHeight <= 0) docHeight = 768;
				}
				
				if (mode == cModeEntire)
				{
					body.scrollTop = 0;
					body.scrollLeft = 0;
				}
				
				if (mode != cModeVisible && mode != cModeBrowser)
					enableSomeElements(false);
				//	disableFixedPositions();
					
				if (divElement)
				{
					clientWidth = divElement.clientWidth;
					clientHeight = divElement.clientHeight;
				}
				else
				{
					clientWidth = doc.compatMode == "CSS1Compat" ? doc.documentElement.clientWidth : body.clientWidth;
					clientHeight = doc.compatMode == "CSS1Compat" ? doc.documentElement.clientHeight : body.clientHeight;
				}
				
				if (window.innerHeight <= clientHeight) 
					docWidth = clientWidth;
					
				var fPreload = window.location.href.match(/https?:\/\/www\.(facebook|fb)\.com/i);
				
				if (fPreload)
				{
					setTimeout(function(){
						body.scrollTop = 100000;
						setTimeout(function(){
							body.scrollTop = 0;
							setTimeout(function(){
								initRegion({topic:'selectArea'});
								//port.postMessage({topic: "initDone", url: document.location.toString(), title: document.title});
							}, timeout);
						}, timeout);
					}, timeout);
				}
				else
				{
					setTimeout(function(){
						initRegion({topic:'selectArea'});
						//port.postMessage({topic: "initDone", url: document.location.toString(), title: document.title});
					}, timeout);
				}
			break;
			
			case "selectArea":
				
				hideStubbornElements();
				
				FireShotSelection.makeSelection(function (data) 
				{
					if (data.left == data.right || data.top == data.bottom) {

					}
						//port.postMessage({topic: "areaSelectionCanceled"});
					else
					{
						body.scrollLeft = data.left;
						body.scrollTop 	= data.top;
						
						scrollStart.left = body.scrollLeft;
						scrollStart.top  = body.scrollTop;
						
						cropRect.left 	= data.left;
						cropRect.top	= data.top;
						cropRect.right	= data.right;
						cropRect.bottom	= data.bottom;
						initRegion({topic: 'scrollNext'});
						//port.postMessage({topic: "areaSelected"}); 
					}
					
					
				});
			break;
			
			case "scrollNext": 
				if (firstTime)
				{
					firstTime = false;
					setTimeout(function(){
						initRegion({topic: "scrollDone", x: body.scrollLeft, y: body.scrollTop}); 
					}, timeout);
					
					return;
				}
				//else
					
				
				if (horzMoving && mode != cModeVisible && mode != cModeBrowser)
				{
					var 
						savedPos = body.scrollLeft,
						maxWidth = mode == cModeSelected ? cropRect.right : docWidth;
					
					body.scrollLeft += Math.max(0, Math.min(clientWidth - 1, maxWidth - (body.scrollLeft + clientWidth) + 20));
					horzMoving = body.scrollLeft != savedPos && body.scrollLeft < docWidth;
					
					if (horzMoving)
					{
						if (rows == 1) cols ++;
						logToConsole("scrollLeft:" + body.scrollLeft);
						setTimeout(function(){
							hideStubbornElements();
							setTimeout(function(){
								initRegion({topic: "scrollDone", x: body.scrollLeft, y: body.scrollTop});
							}, timeout);
						}, 0);
						
						return;
					}
					
					else if (mode == cModeSelected) 
						scrollEnd.left = body.scrollLeft;
				}
				
				if (vertMoving && mode != cModeVisible && mode != cModeBrowser)
				{
					var savedPos = body.scrollTop;
					body.scrollTop += Math.max(0, clientHeight - 1);
					vertMoving = savedPos != body.scrollTop && body.scrollTop < docHeight;
					
					if (mode == cModeSelected) 
					{
						vertMoving &= body.scrollTop < cropRect.bottom;
						if (!vertMoving)
							scrollEnd.top = savedPos;
					}
					
					if (vertMoving)
					{
						rows ++;
						body.scrollLeft = (mode == cModeEntire ? 0 : scrollStart.left);

						logToConsole("scrollTop:" + body.scrollTop);
						horzMoving = true;
						
						setTimeout(function(){
							hideStubbornElements();
							setTimeout(function(){
								initRegion({topic: "scrollDone", x: body.scrollLeft, y: body.scrollTop});
							}, timeout);
						}, timeout);
						
						return;
					}
				}
						
				var zoom = (window.outerWidth) / (window.innerWidth);
				
				var zoomFactors = [0.01, 0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5];
				
				for (var i = zoomFactors.length - 1; i >= 0; i--)
					if (zoom + 0.02 >= zoomFactors[i]) {
						zoom = zoomFactors[i];
						break;
					}
					
				
				msg = {
					topic: "scrollFinished", 
					div  : 0,
					left : 0,
					top : 0,
					width: (mode == cModeEntire ? docWidth : clientWidth), 
					height: (mode == cModeEntire ? docHeight : clientHeight),
					zoom : window.devicePixelRatio * 100,
					rows: rows, cols: cols, 
					cw: clientWidth, ch: clientHeight,
					hScrollbar: window.innerHeight > clientHeight, 
					vScrollBar: window.innerWidth > clientWidth
				};
				
				if (divElement) {
					var rects = divElement.getClientRects();
					msg.div = 1;
					if (rects.length > 0)
					{
						msg.left = divElement.clientLeft + rects[0].left;
						msg.top = divElement.clientTop + rects[0].top;
					}
					
					enableFloatingInView();
				}
					
				if (mode == cModeSelected) {
					msg.width 	= scrollEnd.left - scrollStart.left + clientWidth;
					msg.height 	= scrollEnd.top - scrollStart.top + clientHeight;
					
					msg.crop 		= true;
					msg.cropLeft 	= cropRect.left - scrollStart.left;
					msg.cropTop 	= cropRect.top - scrollStart.top;
					msg.cropRight	= msg.cropLeft + (cropRect.right - cropRect.left);
					msg.cropBottom	= msg.cropTop + (cropRect.bottom - cropRect.top);
				}
				
				logToConsole(JSON.stringify(msg));
				
				body.scrollLeft = savedScrollLeft;					
				body.scrollTop = savedScrollTop;

				if (mode != cModeVisible && mode != cModeBrowser)
					enableSomeElements(true);
					//	enableFixedPositions();
					
				showStubbornElements();
				
				setTimeout(function(){
					initRegion(msg); 
				}, timeout);
				
			break;
			case 'scrollDone':
				console.log('done');
				parent.postMessage('removeRegion', '*');
				//var port = chrome.runtime.connect({name: "knockknock"});
				//port.postMessage({joke: "Knock knock"});
	            chrome.runtime.sendMessage({action:111}, function(response) {
	            	console.log("FFF");
	            });

				/*chrome.tabs.captureVisibleTab(null, {format : "png"},
					function(data)
					{
						//pluginCommand("captureTabPNG", {dataurl: data, datasize: data.length, x: msg.x, y: msg.y});
						//port.postMessage({topic: "scrollNext"}); 
						logToConsole(data);
						initRegion('scrollNext');
					});*/
			break;

			case "scrollFinished": 
				logToConsole("FINISHED (" + msg.rows + " x " + msg.cols + ")");
				
				/*msg.url = tabURL;
				msg.title = tabTitle;
				
				msg.key = "-";
				msg.action = Action;
				msg.browserVersion = parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);
				*/
				//lockItems();
				//pluginCommand("captureDone", msg);
				//enableHotkey(true);
				//unlockItems();
				
				//port.onMessage.removeListener(arguments.callee);
			break;
			
		}
}      

initRegion({topic:'init'});
})();
