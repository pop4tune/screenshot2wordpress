(function($) {
    var loaded = function() {
        $('#settings').on('click', function() {
                var div = document.createElement('div'),
                src = chrome.extension.getURL('settings.html'),
                clear = function() {
                    var els = document.getElementsByClassName("SettingsFrameOverlay");
                    for(var i = 0; i<els.length; i++) {
                        document.body.removeChild(els[i]);
                    }
                }
                
                clear();
                
                div.innerHTML = '<iframe class="SettingsFrameOverlay" src="' + src + '"position: absolute;top: 50%;left: 50%;margin-top: -100px;margin-left: -100px;width: 200px;height: 200px;background-color: white; z-index: 2147483647; border: 0;" />';
            
                var iframe = div.childNodes[0];
                
                document.body.appendChild(iframe);
                
                var receiveMessage = function(message) {
                    if(message && message.data == 'removeRegion') {
                        clear();
                    }
                };

                window.addEventListener("message", receiveMessage, false);
        });

        $('#entire').on('click', function() {
            var images = [],
                height,
                width,
                windowHeight,
                capture = function(scrollPosition, callback) {
                    chrome.tabs.executeScript({
                        code: 'window.scrollTo(0,' + scrollPosition + '); window.scrollY;'
                    }, function(scroll) {
                        setTimeout(function () {
                            chrome.tabs.captureVisibleTab({format: 'png'}, function(res) {
                                callback(res, scroll[0]);
                            });
                        }, 100);
                    });
                },
                position = 0;
                
            // First get the height
            chrome.tabs.executeScript({
                code: "document.body.style.webkitTransform = 'translateZ(0)'; document.body.style.overflow = 'hidden'; ([document.body.scrollHeight, window.innerHeight, document.body.scrollWidth]);"
            }, function(res) {
                height = res[0][0];
                width = res[0][2];
                windowHeight = res[0][1];
                callback = function(res, scroll) {
                    images.push({image: res, position: scroll});

                    if(position <= (height - windowHeight)) {
                        position += windowHeight;
                        capture(position, callback);
                    } else {
                        chrome.tabs.executeScript({
                            code: "document.body.style.overflow = 'visible';"
                        });
                        chrome.runtime.sendMessage({image: images, height: height, width: width}, function() {});
                    }
                };
                
                capture(position, callback);
            });
        });
        
        $('#visible').on('click', function() {
            chrome.tabs.captureVisibleTab({format: 'png'}, function(res) {
                chrome.runtime.sendMessage({image: res}, function() {});
            });
        });
        
        $('#region').on('click', function() {
            chrome.tabs.executeScript({
                'file': 'static/js/region.inject.js',
                'runAt': 'document_idle'
            });
            window.close();
        });
        
        
        // Display the latest few shares
        chrome.storage.sync.get('shares', function(res) {
            if(Array.isArray(res.shares)) {
                var ul = $('<ul />').addClass('recent');
                ul.append('<li class="title">Recently Shared</li>');
                $.each(res.shares, function() {
                    $('<li />').html('<a target="_blank" href="http://screenshot.co/#!/' + this.id + '">' + moment(this.time).fromNow() + '</a>').appendTo(ul);
                });
                ul.appendTo(document.body);
            }
        });
    };
    
    $(loaded);
})(jQuery);