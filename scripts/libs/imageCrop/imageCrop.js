;(function($) {
    $.imageCrop = function (object, customOptions) {
        var defaultOptions = {
              allowMove          : true
            , allowResize        : true
            , allowSelect        : true
            , aspectRatio        : 0
            , handlerSize        : 10
            , minSelect          : [0, 0]
            , minSize            : [0, 0]
            , maxSize            : [0, 0]
            , outlineOpacity     : 0.5
            , overlayOpacity     : 0.5
            , overlayBgColor     : '#fff'
            , selectionPosition  : [0, 0]
            , selectionWidth     : 0
            , selectionHeight    : 0
            , trueImageSize      : [0, 0]

            , onChange : function () {}
            , onSelect : function () {}
        };

        var options = defaultOptions;

        setOptions(customOptions);

        var $image = $(object);

        var $holder = $('<div></div>')
                .css({
                      overflow : 'hidden'
                    , position : 'relative'
                })
                .width($image.width())
                .height($image.height());

        $image.wrap($holder)
            .css({
                position : 'absolute'
            });

        var $overlay = $('<div id="image-crop-overlay"></div>')
                .css({
                      backgroundColor : options.overlayBgColor
                    , opacity         : options.overlayOpacity
                    , overflow        : 'hidden'
                    , position        : 'absolute'
                })
                .width($image.width())
                .height($image.height())
                .insertAfter($image);

        var $trigger = $('<div id="image-crop-trigger"></div>')
                .css({
                      backgroundColor : '#000000'
                    , opacity         : 0
                    , position        : 'absolute'
                })
                .width($image.width())
                .height($image.height())
                .insertAfter($overlay);

        var $outline = $('<div id="image-crop-outline"></div>')
                .css({
                      background : '#ffffff url(\''+ options.imagePath +'\')'
                    , opacity    : options.outlineOpacity
                    , overflow   : 'hidden'
                    , position   : 'absolute'
                })
                .insertAfter($trigger);

        var $selection = $('<div id="image-crop-selection"></div>')
                .css({
                      background     : 'url('+ $image.attr('src') +') no-repeat'
                    , backgroundSize : $image.width() + 'px ' + $image.height() + 'px'
                    , position       : 'absolute'
                    // , '-ms-behavior' : 'url('+options.msPolyfill+')'
                })
                .insertAfter($outline);

        var $nwResizeHandler = $('<div class="image-crop-resize-handler" id="image-crop-nw-resize-handler"></div>')
                .css({
                      backgroundColor  : '#000000'
                    , border           : '1px #ffffff solid'
                    , height           : options.handlerSize
                    , opacity          : 0.5
                    , overflow         : 'hidden'
                    , position         : 'absolute'
                    , width            : options.handlerSize
                })
                .insertAfter($selection);

        var $nResizeHandler = $('<div class="image-crop-resize-handler" id="image-crop-n-resize-handler"></div>')
                .css({
                      backgroundColor  : '#000000'
                    , border           : '1px #ffffff solid'
                    , height           : options.handlerSize
                    , opacity          : 0.5
                    , overflow         : 'hidden'
                    , position         : 'absolute'
                    , width            : options.handlerSize
                })
                .insertAfter($selection);

        var $neResizeHandler = $('<div class="image-crop-resize-handler" id="image-crop-ne-resize-handler"></div>')
                .css({
                      backgroundColor  : '#000000'
                    , border           : '1px #ffffff solid'
                    , height           : options.handlerSize
                    , opacity          : 0.5
                    , overflow         : 'hidden'
                    , position         : 'absolute'
                    , width            : options.handlerSize
                })
                .insertAfter($selection);

        var $wResizeHandler = $('<div class="image-crop-resize-handler" id="image-crop-w-resize-handler"></div>')
                .css({
                      backgroundColor  : '#000000'
                    , border           : '1px #ffffff solid'
                    , height           : options.handlerSize
                    , opacity :         0.5
                    , overflow         : 'hidden'
                    , position         : 'absolute'
                    , width            : options.handlerSize
                })
                .insertAfter($selection);

        var $eResizeHandler = $('<div class="image-crop-resize-handler" id="image-crop-e-resize-handler"></div>')
                .css({
                      backgroundColor  : '#000000'
                    , border           : '1px #ffffff solid'
                    , height           : options.handlerSize
                    , opacity          : 0.5
                    , overflow         : 'hidden'
                    , position         : 'absolute'
                    , width            : options.handlerSize
                })
                .insertAfter($selection);

        var $swResizeHandler = $('<div class="image-crop-resize-handler" id="image-crop-sw-resize-handler"></div>')
                .css({
                      backgroundColor  : '#000000'
                    , border           : '1px #ffffff solid'
                    , height           : options.handlerSize
                    , opacity          : 0.5
                    , overflow         : 'hidden'
                    , position         : 'absolute'
                    , width            : options.handlerSize
                })
                .insertAfter($selection);

        var $sResizeHandler = $('<div class="image-crop-resize-handler" id="image-crop-s-resize-handler"></div>')
                .css({
                      backgroundColor  : '#000000'
                    , border           : '1px #ffffff solid'
                    , height           : options.handlerSize
                    , opacity          : 0.5
                    , overflow         : 'hidden'
                    , position         : 'absolute'
                    , width            : options.handlerSize
                })
                .insertAfter($selection);

        var $seResizeHandler = $('<div class="image-crop-resize-handler" id="image-crop-se-resize-handler"></div>')
                .css({
                      backgroundColor  : '#000000'
                    , border           : '1px #ffffff solid'
                    , height           : options.handlerSize
                    , opacity          : 0.5
                    , overflow         : 'hidden'
                    , position         : 'absolute'
                    , width            : options.handlerSize
                })
                .insertAfter($selection);

        var resizeHorizontally = true,
            resizeVertically = true,
            selectionExists,
            selectionOffset = [0, 0],
            selectionOrigin = [0, 0];

        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };

        if (options.selectionWidth > options.minSelect[0] && options.selectionHeight > options.minSelect[1]) {
            selectionExists = true;
        } else {
            selectionExists = false;
        }

        updateInterface();

        if (options.allowSelect) {
            if (isMobile.any()) {
                $trigger.on('touchstart', setSelection);
            } else {
                $trigger.mousedown(setSelection);
            };
        }

        if (options.allowMove) {
            if (isMobile.any()) {
                $selection.on('touchstart', pickSelection);
            } else{
                $selection.mousedown(pickSelection);
            };
        }

        if (options.allowResize) {
            if (isMobile.any()) {
                $('div.image-crop-resize-handler').on('touchstart', pickResizeHandler);
            } else{
                $('div.image-crop-resize-handler').mousedown(pickResizeHandler);
            };
        }

        function setOptions (customOptions) {
            options = $.extend(options, customOptions);
        };

        function getElementOffset (object) {
            var offset = $(object).offset();

            return [offset.left, offset.top];
        };

        function getMousePosition (event) {
            var imageOffset = getElementOffset($image);

            var x = event.pageX - imageOffset[0],
                y = event.pageY - imageOffset[1];

            x = (x < 0) ? 0 : (x > $image.width()) ? $image.width() : x;
            y = (y < 0) ? 0 : (y > $image.height()) ? $image.height() : y;

            return [x, y];
        };

        function getTouchPosition (event) {
            var imageOffset = getElementOffset($image);

            var x, y;

            if (event.originalEvent) {
                x = event.originalEvent.targetTouches[0].pageX - imageOffset[0],
                y = event.originalEvent.targetTouches[0].pageY - imageOffset[1];
            } else if (event.targetTouches) {
                x = event.targetTouches[0].pageX - imageOffset[0],
                y = event.targetTouches[0].pageY - imageOffset[1];
            }

            x = (x < 0) ? 0 : (x > $image.width()) ? $image.width() : x;
            y = (y < 0) ? 0 : (y > $image.height()) ? $image.height() : y;

            return [x, y]
        };

        function getImageTrueSize () {
            var $src = $image.attr('src');

            var $trueSizeImg = $('<img class="true-size-image" />')
                .attr('src', $src).insertAfter($image);

            $trueSizeImg.load(function () {
                var trueWidth = $trueSizeImg.width(),
                    trueHeight = $trueSizeImg.height();

                options.trueImageSize[0] = trueWidth;
                options.trueImageSize[1] = trueHeight;

                setTimeout(function() {
                    $trueSizeImg.remove();
                }, 100);
            });
        }

        function getCropData () {
            return {
                  x      : options.selectionPosition[0] * options.trueImageSize[0] / $image.width()
                , y      : options.selectionPosition[1] * options.trueImageSize[1] / $image.height()
                , width  : options.selectionWidth * options.trueImageSize[0] / $image.width()
                , height : options.selectionHeight * options.trueImageSize[1] / $image.height()
                , path       : $image.attr('src')
                , selectionExists : function() {
                    return selectionExists;
                }
            };
        };

        function updateOverlayLayer () {
            $overlay.css({
                    display : selectionExists ? 'block' : 'none'
                });
        };

        function updateTriggerLayer () {
            $trigger.css({
                    cursor : options.allowSelect ? 'crosshair' : 'default'
                });
        };

        function updateSelection () {
            $outline.css({
                      cursor : 'default'
                    , display : selectionExists ? 'block' : 'none'
                    , left : options.selectionPosition[0]
                    , top : options.selectionPosition[1]
                })
                .width(options.selectionWidth)
                .height(options.selectionHeight);

            $selection.css({
                      backgroundPosition : ( - options.selectionPosition[0] - 1) + 'px ' + ( - options.selectionPosition[1] - 1) + 'px'
                    , cursor : options.allowMove ? 'move' : 'default'
                    , display : selectionExists ? 'block' : 'none'
                    , left : options.selectionPosition[0] + 1
                    , top : options.selectionPosition[1] + 1
                })
                .width((options.selectionWidth - 2 > 0) ? (options.selectionWidth - 2) : 0)
                .height((options.selectionHeight - 2 > 0) ? (options.selectionHeight - 2) : 0);
        };

        function updateResizeHandlers (action) {
            switch (action) {
                case 'hide-all' :
                    $('.image-crop-resize-handler').each(function() {
                        $(this).css({
                                display : 'none'
                            });
                    });
                    break;
                default :
                    var display = (selectionExists && options.allowResize) ? 'block' : 'none';

                    $nwResizeHandler.css({
                              cursor  : 'nw-resize'
                            , display : display
                            , left    : options.selectionPosition[0] - Math.round($nwResizeHandler.width() / 2)
                            , top     : options.selectionPosition[1] - Math.round($nwResizeHandler.height() / 2)
                        });

                    $nResizeHandler.css({
                              cursor  : 'n-resize'
                            , display : display
                            , left    : options.selectionPosition[0] + Math.round(options.selectionWidth / 2 - $neResizeHandler.width() / 2) - 1
                            , top     : options.selectionPosition[1] - Math.round($neResizeHandler.height() / 2)
                        });

                    $neResizeHandler.css({
                              cursor  : 'ne-resize'
                            , display : display
                            , left    : options.selectionPosition[0] + options.selectionWidth - Math.round($neResizeHandler.width() / 2) - 1
                            , top     : options.selectionPosition[1] - Math.round($neResizeHandler.height() / 2)
                        });

                    $wResizeHandler.css({
                              cursor  : 'w-resize'
                            , display : display
                            , left    : options.selectionPosition[0] - Math.round($neResizeHandler.width() / 2)
                            , top     : options.selectionPosition[1] + Math.round(options.selectionHeight / 2 - $neResizeHandler.height() / 2) - 1
                        });

                    $eResizeHandler.css({
                              cursor  : 'e-resize'
                            , display : display
                            , left    : options.selectionPosition[0] + options.selectionWidth - Math.round($neResizeHandler.width() / 2) - 1
                            , top     : options.selectionPosition[1] + Math.round(options.selectionHeight / 2 - $neResizeHandler.height() / 2) - 1
                        });

                    $swResizeHandler.css({
                              cursor  : 'sw-resize'
                            , display : display
                            , left    : options.selectionPosition[0] - Math.round($swResizeHandler.width() / 2)
                            , top     : options.selectionPosition[1] + options.selectionHeight - Math.round($swResizeHandler.height() / 2) - 1
                        });

                    $sResizeHandler.css({
                              cursor  : 's-resize'
                            , display : display
                            , left    : options.selectionPosition[0] + Math.round(options.selectionWidth / 2 - $seResizeHandler.width() / 2) - 1
                            , top     : options.selectionPosition[1] + options.selectionHeight - Math.round($seResizeHandler.height() / 2) - 1
                        });

                    $seResizeHandler.css({
                              cursor  : 'se-resize'
                            , display : display
                            , left    : options.selectionPosition[0] + options.selectionWidth - Math.round($seResizeHandler.width() / 2) - 1
                            , top     : options.selectionPosition[1] + options.selectionHeight - Math.round($seResizeHandler.height() / 2) - 1
                        });
            }
        };

        function updateCursor (cursorType) {
            $trigger.css({
                    cursor : cursorType
                });

            $outline.css({
                    cursor : cursorType
                });

            $selection.css({
                    cursor : cursorType
                });
        };

        function updateInterface (sender) {
            switch (sender) {
                case 'setSelection' :
                    updateOverlayLayer();
                    updateSelection();
                    updateResizeHandlers('hide-all');

                    break;
                case 'pickSelection' :
                    updateResizeHandlers('hide-all');

                    break;
                case 'pickResizeHandler' :
                    updateResizeHandlers('hide-all');

                    break;
                case 'resizeSelection' :
                    updateSelection();
                    updateResizeHandlers('hide-all');
                    updateCursor('crosshair');

                    break;
                case 'moveSelection' :
                    updateSelection();
                    updateResizeHandlers('hide-all');
                    updateCursor('move');

                    break;
                case 'releaseSelection' :
                    updateTriggerLayer();
                    updateOverlayLayer();
                    updateSelection();
                    updateResizeHandlers();

                    break;
                default :
                    updateTriggerLayer();
                    updateOverlayLayer();
                    updateSelection();
                    updateResizeHandlers();
            }
        };

        function setSelection (event) {
            event.preventDefault();
            event.stopPropagation();

            if (isMobile.any()) {
                $(document).on('touchmove' ,resizeSelection);
                $(document).on('touchend' ,releaseSelection);
            } else{
                $(document).mousemove(resizeSelection);
                $(document).mouseup(releaseSelection);
            };

            selectionExists = true;

            options.selectionWidth = 0;
            options.selectionHeight = 0;

            if (isMobile.any()) {
                selectionOrigin = getTouchPosition(event);
            } else{
                selectionOrigin = getMousePosition(event);
            };

            options.selectionPosition[0] = selectionOrigin[0];
            options.selectionPosition[1] = selectionOrigin[1];

            updateInterface('setSelection');
        };

        function pickSelection (event) {
            event.preventDefault();
            event.stopPropagation();

            if (isMobile.any()) {
                $(document).on('touchmove', moveSelection);
                $(document).on('touchend', releaseSelection);
            } else{
                $(document).mousemove(moveSelection);
                $(document).mouseup(releaseSelection);
            };

            var mousePosition
            if (isMobile.any()) {
                mousePosition = getTouchPosition(event);
            } else{
                mousePosition = getMousePosition(event);
            };

            selectionOffset[0] = mousePosition[0] - options.selectionPosition[0];
            selectionOffset[1] = mousePosition[1] - options.selectionPosition[1];

            updateInterface('pickSelection');
        };

        function pickResizeHandler (event) {
            event.preventDefault();
            event.stopPropagation();

            switch (event.target.id) {
                case 'image-crop-nw-resize-handler' :
                    selectionOrigin[0] += options.selectionWidth;
                    selectionOrigin[1] += options.selectionHeight;
                    options.selectionPosition[0] = selectionOrigin[0] - options.selectionWidth;
                    options.selectionPosition[1] = selectionOrigin[1] - options.selectionHeight;
                    break;
                case 'image-crop-n-resize-handler' :
                    selectionOrigin[1] += options.selectionHeight;
                    options.selectionPosition[1] = selectionOrigin[1] - options.selectionHeight;

                    resizeHorizontally = false;
                    break;
                case 'image-crop-ne-resize-handler' :
                    selectionOrigin[1] += options.selectionHeight;
                    options.selectionPosition[1] = selectionOrigin[1] - options.selectionHeight;
                    break;
                case 'image-crop-w-resize-handler' :
                    selectionOrigin[0] += options.selectionWidth;
                    options.selectionPosition[0] = selectionOrigin[0] - options.selectionWidth;

                    resizeVertically = false;
                    break;
                case 'image-crop-e-resize-handler' :
                    resizeVertically = false;
                    break;
                case 'image-crop-sw-resize-handler' :
                    selectionOrigin[0] += options.selectionWidth;
                    options.selectionPosition[0] = selectionOrigin[0] - options.selectionWidth;
                    break;
                case 'image-crop-s-resize-handler' :
                    resizeHorizontally = false;
                    break;
            }

            if (isMobile.any()) {
                $(document).on('touchmove', resizeSelection);
                $(document).on('touchend', releaseSelection);
            } else{
                $(document).mousemove(resizeSelection);
                $(document).mouseup(releaseSelection);
            };

            updateInterface('pickResizeHandler');
        };

        function resizeSelection (event) {
            event.preventDefault();
            event.stopPropagation();

            var mousePosition;

            if (isMobile.any()) {
                mousePosition = getTouchPosition(event);
            } else {
                mousePosition = getMousePosition(event);
            };

            var height = mousePosition[1] - selectionOrigin[1],
                width = mousePosition[0] - selectionOrigin[0];

            if (Math.abs(width) < options.minSize[0])
                width = (width >= 0) ? options.minSize[0] : - options.minSize[0];

            if (Math.abs(height) < options.minSize[1])
                height = (height >= 0) ? options.minSize[1] : - options.minSize[1];

            if (selectionOrigin[0] + width < 0 || selectionOrigin[0] + width > $image.width())
                width = - width;

            if (selectionOrigin[1] + height < 0 || selectionOrigin[1] + height > $image.height())
                height = - height;

            if (options.maxSize[0] > options.minSize[0] &&
                options.maxSize[1] > options.minSize[1]) {

                if (Math.abs(width) > options.maxSize[0])
                    width = (width >= 0) ? options.maxSize[0] : - options.maxSize[0];

                if (Math.abs(height) > options.maxSize[1])
                    height = (height >= 0) ? options.maxSize[1] : - options.maxSize[1];
            }

            if (resizeHorizontally)
                options.selectionWidth = width;

            if (resizeVertically)
                options.selectionHeight = height;

            if (options.aspectRatio) {
                if ((width > 0 && height > 0) || (width < 0 && height < 0))
                    if (resizeHorizontally)
                        height = Math.round(width / options.aspectRatio);
                    else
                        width = Math.round(height * options.aspectRatio);
                else
                    if (resizeHorizontally)
                        height = - Math.round(width / options.aspectRatio);
                    else
                        width = - Math.round(height * options.aspectRatio);

                if (selectionOrigin[0] + width > $image.width()) {
                    width = $image.width() - selectionOrigin[0];
                    height = (height > 0) ? Math.round(width / options.aspectRatio) : - Math.round(width / options.aspectRatio);
                }

                if (selectionOrigin[1] + height < 0) {
                    height = - selectionOrigin[1];
                    width = (width > 0) ? - Math.round(height * options.aspectRatio) : Math.round(height * options.aspectRatio);
                }

                if (selectionOrigin[1] + height > $image.height()) {
                    height = $image.height() - selectionOrigin[1];
                    width = (width > 0) ? Math.round(height * options.aspectRatio) : - Math.round(height * options.aspectRatio);
                }

                options.selectionWidth = width;
                options.selectionHeight = height;
            }

            if (options.selectionWidth < 0) {
                options.selectionWidth = Math.abs(options.selectionWidth);
                options.selectionPosition[0] = selectionOrigin[0] - options.selectionWidth;
            } else
                options.selectionPosition[0] = selectionOrigin[0];

            if (options.selectionHeight < 0) {
                options.selectionHeight = Math.abs(options.selectionHeight);
                options.selectionPosition[1] = selectionOrigin[1] - options.selectionHeight;
            } else
                options.selectionPosition[1] = selectionOrigin[1];

            options.onChange(getCropData());

            updateInterface('resizeSelection');
        };

        function moveSelection (event) {
            event.preventDefault();
            event.stopPropagation();

            var position;
            if (isMobile.any()) {
                position = getTouchPosition(event);
            } else {
                position = getMousePosition(event);
            };

            if (position[0] - selectionOffset[0] > 0)
                if (position[0] - selectionOffset[0] + options.selectionWidth < $image.width())
                    options.selectionPosition[0] = position[0] - selectionOffset[0];
                else
                    options.selectionPosition[0] = $image.width() - options.selectionWidth;
            else
                options.selectionPosition[0] = 0;

            if (position[1] - selectionOffset[1] > 0)
                if (position[1] - selectionOffset[1] + options.selectionHeight < $image.height())
                    options.selectionPosition[1] = position[1] - selectionOffset[1];
                else
                    options.selectionPosition[1] = $image.height() - options.selectionHeight;
            else
                options.selectionPosition[1] = 0;

            options.onChange(getCropData());

            updateInterface('moveSelection');
        };

        function releaseSelection (event) {
            event.preventDefault();
            event.stopPropagation();

            if (isMobile.any()) {
                $(document).off('touchmove');
                $(document).off('touchend');
            } else {
                $(document).off('mousemove');
                $(document).off('mouseup');
            };

            selectionOrigin[0] = options.selectionPosition[0];
            selectionOrigin[1] = options.selectionPosition[1];

            resizeHorizontally = true;
            resizeVertically = true;

            if (options.selectionWidth > options.minSelect[0] &&
                options.selectionHeight > options.minSelect[1])
                selectionExists = true;
            else
                selectionExists = false;

            options.onSelect(getCropData());

            updateInterface('releaseSelection');
        };

        getImageTrueSize();
    };

    $.fn.imageCrop = function (customOptions) {
        this.each(function() {
            var currentObject = this,
                image = new Image();

            image.onload = function() {
                $.imageCrop(currentObject, customOptions);
            };

            image.src = currentObject.src;
        });

        return this;
    };
}) (jQuery);
