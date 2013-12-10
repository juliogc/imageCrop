require(['main', 'jquery'], function (Main, $) {
    'use strict';

    Main.init();

    console.log('Running jQuery %s', $().jquery);
});
