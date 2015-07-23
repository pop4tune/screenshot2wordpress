(function() {
    $('#login').val(localStorage['login']);

    $('#tooltip').on('click', function(e) {
        localStorage['login'] = $('#login').val();
        localStorage['passwd'] = $('#passwd').val();
        $('body').empty();
        setTimeout(function() {
            parent.postMessage('removeRegion', '*');
        }, 50);
    });
    
    $('#cancel').on('click', function() {
        parent.postMessage('removeRegion', '*');
    });
})();