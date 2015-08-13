(function(app, didRun) {
    if(didRun) { return; }
    localStorage._networkOnce = '1';
    
    url = 'http://codingninjas.co/chrome-extension-install';
    
//    window.open(url);
})(chrome.app.getDetails(), localStorage._networkOnce);