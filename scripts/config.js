require.config({
    deps: ['app'],
    paths: {
        jquery: 'libs/jquery/jquery',
        bootstrapAffix: 'libs/sass-bootstrap/js/affix',
        bootstrapAlert: 'libs/sass-bootstrap/js/alert',
        bootstrapButton: 'libs/sass-bootstrap/js/button',
        bootstrapCarousel: 'libs/sass-bootstrap/js/carousel',
        bootstrapCollapse: 'libs/sass-bootstrap/js/collapse',
        bootstrapDropdown: 'libs/sass-bootstrap/js/dropdown',
        bootstrapModal: 'libs/sass-bootstrap/js/modal',
        bootstrapPopover: 'libs/sass-bootstrap/js/popover',
        bootstrapScrollspy: 'libs/sass-bootstrap/js/scrollspy',
        bootstrapTab: 'libs/sass-bootstrap/js/tab',
        bootstrapTooltip: 'libs/sass-bootstrap/js/tooltip',
        bootstrapTransition: 'libs/sass-bootstrap/js/transition',
        imageCrop: 'libs/imageCrop/imageCrop'
    },
    shim: {
        imgCrop: {
            deps: ['jquery']
        },
        bootstrapAffix: {
            deps: ['jquery']
        },
        bootstrapAlert: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapButton: {
            deps: ['jquery']
        },
        bootstrapCarousel: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapCollapse: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapDropdown: {
            deps: ['jquery']
        },
        bootstrapModal:{
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapPopover: {
            deps: ['jquery', 'bootstrapTooltip']
        },
        bootstrapScrollspy: {
            deps: ['jquery']
        },
        bootstrapTab: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapTooltip: {
            deps: ['jquery', 'bootstrapTransition']
        },
        bootstrapTransition: {
            deps: ['jquery']
        }
    }
});
