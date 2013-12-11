define(['jquery', 'imageCrop'], function ($) {
    'use strict';

    var Main = (function () {

        function init () {
            console.log('Your app will starts here.');

            $('img').imageCrop({
                  overlayOpacity : 0.5
                , overlayBgColor : 'orange'
                , onSelect       : updateForm
            });
        }

        var selectionExists;

        function updateForm(crop) {
            $('input#x').val(crop.x);
            $('input#y').val(crop.y);
            $('input#width').val(crop.width);
            $('input#height').val(crop.height);
            $('input#path').val(crop.path);
            selectionExists = crop.selectionExists;

            console.log(crop);
        };

        return {
              'init'       : init
            , 'updateForm' : updateForm
        };

    })();

    return Main;
});
