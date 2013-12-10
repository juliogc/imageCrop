define(['jquery', 'imageCrop'], function ($) {
    'use strict';

    var Main = (function () {

        function init () {
            console.log('Your app will starts here.');

            $('img').imageCrop({
                  overlayOpacity : 0.5
                , overlayBgColor : 'orange'
            });
        }

        return {
            'init' : init
        };

    })();

    return Main;
});
