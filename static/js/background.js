var commPortName = "FireShot Comm Port #" + Math.ceil(Math.random() * 45309714203);
var screenshot = '',
    cropAndPreview = function(coords) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');
            
            canvas.width = coords.width;
            canvas.height = coords.height;

        var img = new Image();
        img.onload = function() {
            context.drawImage(this, coords.x1, coords.y1, coords.width, coords.height, 0, 0, coords.width, coords.height);
            
            screenshot = canvas.toDataURL('image/png');
            window.open('preview.html');
        };

        chrome.tabs.captureVisibleTab({format: 'png'}, function(res) {
            img.src = res;
        });
    },
    receiveMessage = function(data, callback) {
        console.log(data, callback);
        if (data && data.action) {
            chrome.tabs.captureVisibleTab(null,{},function(dataUri){
                console.log(dataUri);
                if (callback) callback(dataUri);
            });
            return;
        }
        if(data && data.image) {
            if(Array.isArray(data.image)) {
                var canvas = document.createElement('canvas'),
                    context = canvas.getContext('2d'),
                    image,
                    done = 0;
                
                    canvas.width = data.width;
                    canvas.height = data.height;
                
                    
                for(var i = 0; i < data.image.length; i++) {
                    (function(i) {
                        image = new Image();
                        image.onload = function() {
                            context.drawImage(this, 0, data.image[i].position, this.width, this.height);
                            if(++done == data.image.length) {
                                screenshot = canvas.toDataURL('image/png');
                                window.open('preview.html');
                            }
                        }
                        image.src = data.image[i].image;
                    })(i);
                } 
            } else {
                screenshot = data.image;
                window.open('preview.html');
                return;
            }
        }
        
        if(data && data.coords) {
            cropAndPreview(data.coords);
        }
    };

chrome.runtime.onMessage.addListener(receiveMessage);

/*            var port = chrome.runtime.connect({name: "knockknock"});
            port.onMessage.addListener(function(msg) {
                console.log("MSG?", msg);
            });

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "knockknock");
  port.onMessage.addListener(function(msg) {
    console.log('.....');
    if (msg.joke == "Knock knock")
      port.postMessage({question: "Who's there?"});
    else if (msg.answer == "Madame")
      port.postMessage({question: "Madame who?"});
    else if (msg.answer == "Madame... Bovary")
      port.postMessage({question: "I don't get it."});
  });
});            



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request, sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });
*/
// Add in context menu
chrome.contextMenus.removeAll(function() {
    chrome.contextMenus.create({
        id: 'images',
        title: 'Screenshot This Image',
        contexts: ['image'],
        onclick: function(data) {
            var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

            var img = new Image();
            img.onload = function() {
                canvas.width = this.width;
                canvas.height = this.height;
                context.drawImage(this, 0,0, this.width, this.height);
                
                screenshot = canvas.toDataURL('image/png');
                window.open('preview.html');
            };
            img.src = data.srcUrl;
        }
    });
    
    chrome.contextMenus.create({
        id: 'visible',
        title: 'Screenshot Visible Area',
        contexts: ['page'],
        onclick: function(data) {
            chrome.tabs.captureVisibleTab({format: 'png'}, function(res) {
                screenshot = res;
                window.open('preview.html');
            });
        }
    });
    
    chrome.contextMenus.create({
        id: 'region',
        title: 'Select an Area to Screenshot',
        contexts: ['page'],
        onclick: function(data) {
            chrome.tabs.executeScript({
                'file': 'static/js/region.inject.js',
                'runAt': 'document_idle'
            });
        }
    });
});


