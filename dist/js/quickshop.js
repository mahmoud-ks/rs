function setCookie(a, b, c) { var d = new Date; d.setTime(d.getTime() + 24 * c * 60 * 60 * 1e3); var e = "expires=" + d.toUTCString(); document.cookie = a + "=" + b + "; " + e + ";path=/" } function getCookie(a) { for (var b = a + "=", c = document.cookie.split(";"), d = 0; d < c.length; d++) { for (var e = c[d]; " " == e.charAt(0);)e = e.substring(1); if (0 == e.indexOf(b)) return e.substring(b.length, e.length) } return "" }

/* Double tap to go */
; (function ($, window, document, undefined) {
    $.fn.doubleTapToGo = function (action) {

        if (!('ontouchstart' in window) &&
            !navigator.msMaxTouchPoints &&
            !navigator.userAgent.toLowerCase().match(/windows phone os 7/i)) return false;

        if (action === 'unbind') {
            this.each(function () {
                $(this).off();
                $(document).off('click touchstart MSPointerDown', handleTouch);
            });
        } else {

            this.each(function () {
                var curItem = false;

                $(this).on('click', function (e) {
                    var item = $(this);
                    if (item[0] != curItem[0]) {
                        e.preventDefault();
                        curItem = item;
                    }
                });

                //$(document).on('click touchstart MSPointerDown', handleTouch);

                function handleTouch(e) {
                    var resetItem = true,
                        parents = $(e.target).parents();

                    for (var i = 0; i < parents.length; i++)
                        if (parents[i] == curItem[0])
                            resetItem = false;

                    if (resetItem)
                        curItem = false;
                }
            });
        }
        return this;
    };
})(jQuery, window, document);

/* polyfill function object.keys */
if (!Object.keys) {
    Object.keys = (function () {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}

function deparam(query) {
    var pairs, i, keyValuePair, key, value, map = {};
    // remove leading question mark if its there
    if (query.slice(0, 1) === '?') {
        query = query.slice(1);
    }
    if (query !== '') {
        pairs = query.split('&');
        for (i = 0; i < pairs.length; i += 1) {
            keyValuePair = pairs[i].split('=');
            key = decodeURIComponent(keyValuePair[0]);
            value = (keyValuePair.length > 1) ? decodeURIComponent(keyValuePair[1]) : undefined;
            map[key] = value;
        }
    }
    return map;
}

function checkProductsOnStock(available, stocktrack, qty, stocklevel, allowoutofstocksale, onstock) {
    if (String(allowoutofstocksale) == "true") {
        return true;
    }

    // Is stocktracking enabled?
    if (String(stocktrack) == "true") {
        if (String(available) == "true" && String(onstock) == "false") {
            //Backorder, so allow
            return true;
        }

        if (parseInt(qty) > parseInt(stocklevel)) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        //Not enabled, so always allow
        return true;
    }
}

//=============================================
// Get ready for the launch
//=============================================
$(document).ready(function () {

    //=============================================
    // Quick view and quickcart
    //=============================================
    function cleanQuickModals() {
        $('.quickview-modal .title').html('');
        $('.quickview-modal .viewbutton').attr('href', '#');
        //$('.quickview-modal .mainimage').attr('src', '');
        $('.quickview-modal .description').html('');
        $('.quickview-modal .errors').html('');
        $('.quickview-modal .errors').slideUp();
        $('.quickview-modal .stockalert').remove();
        //$('.quickview-modal .mainimage').attr('src', '');

        $('.quickview-modal .product-image-holder').html('<div class="product-image owl-carousel owl-theme"></div>');
        $('.quickview-modal .product-thumbnail-holder').html('<div class="product-thumbnails owl-carousel owl-theme"></div>');
        $('.quickview-modal #formfields').html('');

        $('.quickview-modal .qty .quantity').val(1);
        $('.quickview-modal .variant-price .price').html('');

        $('.quickcart-modal .title').html('');
        $('.quickcart-modal .mainimage').html('');
        $('.quickcart-modal .description span').html('');
        $('.quickcart-modal .description.outofstock').hide();
        $('.quickcart-modal .description.instock').hide();
        $('.quickcart-modal .content-holder .stockalert span').html('');
        $('.quickcart-modal .content-holder .stockalert.notenough').hide();
        $('.quickcart-modal .content-holder .stockalert.minimumqty').hide();
        //$('.quickcart-modal .mainimage').attr('src', ''); // cleanup for next quickview
    }

    function drawQuickView(data, customoptions, errors) {
        console.log('data: ')
        console.log(data)
        //return;
        if (typeof errors == 'undefined') {
            var errors = false;
        }

        cleanQuickModals();

        $('.quickview-modal .title').html(data.fulltitle);
        $('.quickview-modal .viewbutton').attr('href', data.url);

        /*$('.quickview-modal .mainimage').attr('src', data.image.replace('50x50x2', '250x250x1'));*/
        console.log('data2: ')
        console.log('data')

        // Does the product even have an image?
        // Else we can't loop through images
        if (data.image_id > 0) {
            for (var i = 0; i < data.images.length; i++) {
                var imgurl = data.images[i].replace('50x50x2', '257x296x2');
                var imgurlZoom = data.images[i].replace('50x50x2', '650x750x2');
                var imgurlThumb = data.images[i].replace('50x50x2', '57x64x2');
                //var imgurlThumb = data.images[i].replace('50x50x2', '40x45x2');

                $('.product-image').append('<div class="item zoom" data-src="' + imgurlZoom + '">\
                  <img data-src="'+ imgurl + '" data-src-zoom="' + imgurlZoom + '" class="owl-lazy img-responsive" alt="">\
                </div>');

                $('.product-thumbnails').append('<div class="item">\
                <img data-src="'+ imgurlThumb + '" class="owl-lazy">\
              </div>');
            }

            /* Start product images */
            var carousel1 = $('.product-image');
            var carousel2 = $('.product-thumbnails');

            carousel1.on('initialized.owl.carousel', function (event) {
                /*$('.image-preloader').fadeOut();
                //$('#holder').removeAttr('height');
                $('#holder').css('height', 'auto');*/
                $('.product-thumbnails .item:first').addClass('synced');
            })

            var owlCarousel1 = carousel1.owlCarousel
                ({
                    items: 1,
                    nav: false,
                    dots: false,
                    mouseDrag: false,
                    touchDrag: false,
                    lazyLoad: true,
                    callbacks: true,
                });

            var owlCarousel2 = carousel2.owlCarousel
                ({
                    items: 3,
                    margin: 10,
                    nav: true,
                    navText: ['<div style="display: table;height: 100%;overflow: hidden;width: 100%;"><div style="display: table-cell;vertical-align: middle;"><div><i class="fa fa-angle-left"></i></div></div></div>', '<div style="display: table;height: 100%;overflow: hidden;width: 100%;"><div style="display: table-cell;vertical-align: middle;"><div><i class="fa fa-angle-right"></i></div></div></div>'],
                    loop: false,
                    dots: false,
                    touchDrag: false,
                    mouseDrag: false,
                    lazyLoad: true,
                });

            owlCarousel2.find('.item').click(function () {
                var itemIndex = $(this).parent().index();
                owlCarousel1.trigger('to.owl.carousel', itemIndex);

                $('.item.synced').removeClass('synced');
                $(this).addClass('synced');
            });

            //$('.product-thumbnails .owl-nav').removeClass('disabled');

            $('.zoom').zoom({ touch: false });
            /* end product images */
        }
        else {
            //alert('no img');
        }

        if (data.description != '') {
            $('.quickview-modal .description').html(data.description);
        }
        else if (typeof data.content != 'undefined' && data.content != '') {
            $('.quickview-modal .description').html(data.content.substr(0, 250) + '..');
        }
        else {
            $('.quickview-modal .description').html('<p class="message-blue">' + tNoInformationFound + '</p>');
        }

        console.log('VARIANTS: ');
        console.log(data.variants);

        if (Object.keys(data.variants).length > 0) {
            $('#formfields').append('<div class="variants"><select class="quickview-variants" name="variant" id="product_configure_variants"></select></div>');

            $.each(data.variants, function (index, variant) {
                console.log(variant);
                var setSelected = '';
                if (variant.default == true) {
                    setSelected = ' selected'
                }

                $('.quickview-variants').append('<option value="' + variant.id + '" data-stocklevel="' + variant.stock.level + '" data-stocktrack="' + variant.stock.track + '" data-available="' + variant.stock.available + '" data-allowoutofstocksale="' + data.stock.allow_outofstock_sale + '" data-onstock="' + variant.stock.on_stock + '" data-minimumqty="' + variant.stock.minimum + '" data-price="' + variant.price.price_incl_money + '"' + setSelected + '>' + variant.title + ' - ' + '</option>');
            });
        }

        //---------------------------------------------------
        // Show if default variant is available
        //---------------------------------------------------
        $('#formfields').append('<div class="variant-available"></div>');

        if (data.stock.available == true) {
            if (data.stock.on_stock == false) {
                $('.variant-available').html('<span class="in-stock"><i class="fa fa-truck"></i> ' + tBackorder + '</span>');
            }
            else {
                $('.variant-available').html('<span class="in-stock"><i class="fa fa-check"></i> ' + tInStock + '</span>');
            }
        }
        else {
            $('.variant-available').html('<span class="out-of-stock"><i class="fa fa-times"></i> ' + tOutOfStock + '</span>');
        }

        //---------------------------------------------------
        // Set the default variant price
        //---------------------------------------------------
        $('.quickview-modal .variant-price .price').html(data.price.price_money);

        //---------------------------------------------------
        // Are there custom options? Place the full html
        //---------------------------------------------------
        if (customoptions != false) {
            $('#formfields').append('<div class="custom-options-holder"></div>');
            $('#formfields .custom-options-holder').append(customoptions)
        }

        //---------------------------------------------------
        // Check if errors were present (eg duringn add2cart)
        //---------------------------------------------------
        if (errors !== false) {
            $('.quickview-modal .errors').html(errors);
            $('.quickview-modal .errors').slideDown();
        }

        $('.quickview-modal').fadeIn(300);

        //---------------------------------------------------
        // Make some changes when the quick view variant has changed
        //---------------------------------------------------
        $('.quickview-variants').off().on('change', function () {
            //$('.quickview-variants option:selected').val();
            $('.quickview-modal .variant-price .price').html($('.quickview-variants option:selected').attr('data-price'));

            //---------------------------------------------------
            // Check availability
            //---------------------------------------------------
            console.log($('.quickview-variants option:selected').attr('data-available'))
            if ($('.quickview-variants option:selected').attr('data-available') == 'true') {
                if ($('.quickview-variants option:selected').attr('data-onstock') == 'false') {
                    $('.variant-available').html('<span class="in-stock"><i class="fa fa-truck"></i> ' + tBackorder + '</span>');
                }
                else {
                    $('.variant-available').html('<span class="in-stock"><i class="fa fa-check"></i> ' + tInStock + '</span>');
                }
            }
            else {
                $('.variant-available').html('<span class="out-of-stock"><i class="fa fa-times"></i> ' + tOutOfStock + '</span>');
            }
        })

        //--------------------------------
        // Action when the user presses the
        // add2cart button in quickveiw
        //--------------------------------
        $('.quickview-addtocart').off().on('click', function (e) {
            e.preventDefault();

            var variantQty = $('.quickview-modal .quantity').val();

            //---------------------------------------------------
            // Get vars from dropdown variants if we have multiple
            //---------------------------------------------------
            if ($('.quickview-modal #product_configure_variants').length > 0) {
                var variantAvailable = $('.quickview-variants option:selected').attr('data-available');
                var variantStocktrack = $('.quickview-variants option:selected').attr('data-stocktrack');
                var variantStocklevel = $('.quickview-variants option:selected').attr('data-stocklevel');
                var variantAllowOutofstockSale = $('.quickview-variants option:selected').attr('data-allowoutofstocksale');
                var variantMinimumQty = $('.quickview-variants option:selected').attr('data-minimumqty');
                var variantOnStock = $('.quickview-variants option:selected').attr('data-onstock');
            }
            else {
                var variantAvailable = data.stock.available;
                var variantStocktrack = data.stock.track;
                var variantStocklevel = data.stock.level;
                var variantAllowOutofstockSale = data.stock.allow_outofstock_sale;
                var variantMinimumQty = data.stock.minimum;
                var variantOnStock = data.stock.on_stock;
            }

            if (checkProductsOnStock(variantAvailable, variantStocktrack, variantQty, variantStocklevel, variantAllowOutofstockSale, variantOnStock) == false) {
                //$('.quickview-modal .errors').html('<ul><li>'+tRequestedAmountNotAvailable+'</li></ul>');
                //$('.quickview-modal .errors').slideDown();
                if ($('.quickview-modal .stockalert').length < 1) {
                    $('.quickview-modal .info-holder').prepend('<div class="stockalert"></div>');
                    $('.quickview-modal .info-holder .stockalert').append('<div class="alert-title">' + tRequestedAmountNotAvailable.replace('XXX', data.fulltitle) + '</div>');
                    $('.quickview-modal .info-holder .stockalert').append('<div class="alert-stock">' + tInStock + ': ' + variantStocklevel + '</div>');
                }
                else {
                    $('.stockalert').html('');
                    $('.stockalert').append('<div class="alert-title">' + tRequestedAmountNotAvailable.replace('XXX', data.fulltitle) + '</div>');
                    $('.stockalert').append('<div class="alert-stock">' + tInStock + ': ' + variantStocklevel + '</div>');
                }
            }
            else if (parseInt(variantMinimumQty) > parseInt(variantQty)) {
                if ($('.quickview-modal .stockalert').length < 1) {
                    $('.quickview-modal .info-holder').prepend('<div class="stockalert"></div>');
                }
                else {
                    $('.stockalert').html('');
                }

                $('.quickview-modal .info-holder .stockalert').append('<div class="alert-stock">' + tMinimumQty.replace('XXX', data.fulltitle).replace('YYY', variantMinimumQty) + '</div>');
            }
            else {
                $('.loading').fadeOut(200);
                $('.quickview-modal').fadeOut(200);

                var fields = '';

                if ($('#product_quick_configure_form').length > 0) {
                    fields = $('#product_quick_configure_form').serialize();
                }

                if ($('.quickview-modal #product_configure_variants').length > 0) {
                    //var vid = $('.quickview-modal #product_configure_variants option:selected').val();
                    var vid = $('.quickview-variants option:selected').val();
                }
                else {
                    var vid = data.vid;
                }

                quickInCart(vid, data.fulltitle, data.image, data.url, fields);
            }
        })

        /* Todo make single instead of duplicate*/
        $('.quickview-modal .close').on('click', function () {
            $('.loading').fadeOut(200);
            $('.quickview-modal').fadeOut(200);

            //cleanQuickModals();
        });
    }

    function quickView(url, errors) {
        if (typeof errors == 'undefined') {
            var errors = false;
        }

        $('.loading').fadeIn(100);

        //stupid ls ecom, images are in .ajax, custom options in ?format=json
        //So lets just get the html from the productpage and insert
        $.when($.getJSON(url.replace('html', 'ajax')), $.get(url)).then(function (data, data2) {
            console.log(data);
            console.log(data2);

            var $custom = $(data2[0]).find('.product-configure-custom');

            if ($custom.length) {
                var custom = $custom.html();
            }
            else {
                var custom = false;
            }

            console.log(custom)

            drawQuickView(data[0], custom, errors)
        })
    }

    $('.quickviewadd').on('click', function () {
        // Only on larger screens
        if ($(window).width() < 991) {
            document.location = mainUrl + $(this).attr('data-url');
            return;
        }
        quickView(mainUrl + $(this).attr('data-url'));
    });


    function drawQuickCart(vid, title, image, stock, checkStockLevel, minimumQtyAlert) {
        cleanQuickModals();


        if (minimumQtyAlert !== false && minimumQtyAlert > 0) {
            $('.quickcart-modal .description').hide();

            $('.quickcart-modal .content-holder .stockalert.minimumqty span.title').html(title);
            $('.quickcart-modal .content-holder .stockalert.minimumqty span.qty').html(minimumQtyAlert);
            $('.quickcart-modal .content-holder .stockalert.minimumqty').show();
        }
        else if (stock == false) {
            $('.quickcart-modal .description.outofstock').show();
        }
        else {
            $('.quickcart-modal .description.instock').show();
        }

        if (checkStockLevel == false) {
            $('.quickcart-modal .content-holder .stockalert.notenough span').html(title);
            $('.quickcart-modal .content-holder .stockalert.notenough').show();
        }

        $('.quickcart-modal .title').html(title);
        $('.quickcart-modal .description span').html(title);

        //$('.quickcart-modal .mainimage').attr('src', image.replace('50x50x2', '200x200x1'));
        $('.quickcart-modal .mainimage').html('<img src="' + image.replace('50x50x2', '175x190x2').replace('200x200x1', '175x190x2') + '" width="175" height="190">');

        $('.quickcart-modal').fadeIn(300);

        /* Todo make single instead of duplicate*/
        $('.quickcart-modal .close, .quickcart-modal .continue').on('click', function (e) {
            e.preventDefault();
            $('.loading').fadeOut(200);
            $('.quickcart-modal').fadeOut(200);

            //cleanQuickModals();
        });
    }

    /* Ajax product in cart */
    function quickInCart(vid, title, img, producturl, fields) {
        //Show loading splash
        $('.loading').fadeIn(100);

        //Got to deparam the fields for QTY added and check if variant posted
        var fieldsObject = deparam(fields)

        $.getJSON(producturl.replace('html', 'ajax'), function (data) {

        }).done(function (data) {


            if (Object.keys(data.variants).length > 1 && typeof fieldsObject.variant == 'undefined' && typeof fieldsObject.bundle_id == 'undefined') {
                $('.quickcart-modal').fadeOut(200);

                quickView(producturl);
            }
            else {
                var productAvailable = true;
                var stockAlert = false;
                var variantStockLevel = 0;
                var minimumQty = 0;

                //Check if there is a variants object, else check the data.stock
                if (Object.keys(data.variants).length > 1) {
                    if (data.variants[vid].stock.available == false) {
                        productAvailable = false;
                    }

                    // Check if stock is too low
                    // Only for gridstyle=always with a qty field
                    // Update: variants[vid].stock changed to data.stock, this var is not available in vid
                    stockAlert = checkProductsOnStock(data.variants[vid].stock.available, data.variants[vid].stock.track, fieldsObject.quantity, data.variants[vid].stock.level, data.stock.allow_outofstock_sale, data.variants[vid].stock.on_stock);

                    variantStockLevel = data.variants[vid].stock.level;
                    minimumQty = data.variants[vid].stock.minimum;
                }
                else {
                    if (data.stock.available == false) {
                        productAvailable = false;
                    }

                    // Check if stock is too low
                    // Only for gridstyle=always with a qty field
                    stockAlert = checkProductsOnStock(data.stock.available, data.stock.track, fieldsObject.quantity, data.stock.level, data.stock.allow_outofstock_sale, data.stock.on_stock);

                    variantStockLevel = data.stock.level;
                    minimumQty = data.stock.minimum
                }

                if (productAvailable == false) {
                    drawQuickCart(vid, title, img, productAvailable, stockAlert, false);
                }
                else if (parseInt(minimumQty) > parseInt(fieldsObject.quantity)) {
                    //drawQuickCart(vid, title, img, productAvailable, stockAlert, minimumQty);

                    // Fix for productpage, not show dialog but goto cart
                    // Cart should redirect back
                    document.location = mainUrl + 'cart/add/' + vid;
                }
                else {

                    $.post(mainUrl + 'cart/add/' + vid + '/', fields, function (result) {

                    }).done(function (result) {

                        //check if error div is present in result, if so then redirect to /add/cart/vid which redirects it to product and show error again
                        //else just proceed with other handler stuff
                        var $data = $(result)

                        var cartContentData = $data.find('.cart-content-holder').html();


                        if ($data.find('ul.error').length) {
                            //Show modal or something with error
                            //alert('error');
                            //document.location = url + 'cart/add/'+vid;
                            if ($('.container.productpage').length > 0) {
                                // Fix for productpage, not show dialog but goto cart
                                // Cart should redirect back
                                document.location = mainUrl + 'cart/add/' + vid;
                            }
                            else {
                                $('.quickcart-modal').fadeOut(200);

                                quickView(producturl, $data.find('ul.error').parent().html());
                            }
                        }
                        else {

                            var qty = parseInt(fieldsObject.quantity);

                            // Qty is messed up, so set the stock level
                            if (stockAlert == false) {
                                qty = variantStockLevel;
                            }


                            $('.cart-content-holder').html(cartContentData);


                            $('.cart-total-qty').html(parseInt($('.cart-total-qty').html()) + qty)

                            var totalProductSum = (qty * data.price.price) + cartTotal;

                            cartTotal = totalProductSum;

                            //$('.cart-content .total').html(currencySymbol+(Math.round(totalProductSum * 100) / 100));
                            //$('#cart-total').html(currencySymbol+(Math.round(totalProductSum * 100) / 100).toFixed(2));
                            $('#cart-total').html($data.find('#cart-total').html());


                            drawQuickCart(vid, title, img, productAvailable, stockAlert, false)
                        }
                    });
                }
            }
        });
    }


    /* Product page place in cart */
    $('.place-in-cart').on('click', function (e) {

        // Only on larger screens
        if ($(window).width() < 950) {
            $('#product_configure_form').submit();
            return;
        }

        e.preventDefault();

        var fields = $('#product_configure_form').serialize();

        var fieldsObject = deparam(fields);


        if (checkProductsOnStock($(this).attr('data-available'), $(this).attr('data-stocktrack'), fieldsObject.quantity, $(this).attr('data-stocklevel'), $(this).attr('data-allowoutofstocksale'), $(this).attr('data-onstock')) == false) {
            if ($('.productpage-right .stockalert').length < 1) {
                $('<div class="row rowmargin"><div class="col-md-12"><div class="stockalert"></div></div></div>').insertAfter('.addtocart-row');
                $('.stockalert').append('<div class="alert-title">' + tRequestedAmountNotAvailable.replace('XXX', $(this).attr('data-title')) + '</div>');
                $('.stockalert').append('<div class="alert-stock">' + tInStock + ': ' + $(this).attr('data-stocklevel') + '</div>');

                $('.addtocart-row').scrollView(100);
            }
            else {
                $('.stockalert').html('');

                $('.stockalert').append('<div class="alert-title">' + tRequestedAmountNotAvailable.replace('XXX', $(this).attr('data-title')) + '</div>');
                $('.stockalert').append('<div class="alert-stock">' + tInStock + ': ' + $(this).attr('data-stocklevel') + '</div>');

                $('.addtocart-row').scrollView(100);
            }
        }
        else if (parseInt($(this).attr('data-minimumqty')) > parseInt(fieldsObject.quantity)) {
            if ($('.productpage-right .stockalert').length < 1) {
                $('<div class="row rowmargin"><div class="col-md-12"><div class="stockalert"></div></div></div>').insertAfter('.addtocart-row');
            }
            else {
                $('.stockalert').html('');
            }

            $('.stockalert').append('<div class="alert-stock">' + tMinimumQty.replace('XXX', $(this).attr('data-title')).replace('YYY', $(this).attr('data-minimumqty')) + '</div>');

            $('.addtocart-row').scrollView(100);
        }
        else {
            quickInCart($(this).attr('data-vid'), $(this).attr('data-title'), $(this).attr('data-img'), $(this).attr('data-url'), fields);
        }
    });

    /* Collection place in cart */
    $('.quickcart').on('click', function () {

        // Only on larger screens
        if ($(window).width() < 991) {
            document.location = mainUrl + 'cart/add/' + $(this).attr('data-vid');
            return;
        }

        //var formData = {quantity:1};

        //We have to encode/serialize this, because quickInCart deparams it for qty count
        //for live cart update
        var qty = 1;
        if ($(this).parent().find('.quantity').length) {
            qty = $(this).parent().find('.quantity').val()
        }

        var fields = $.param({ quantity: qty });

        //if( checkProductsOnStock($(this).attr('data-available'), $(this).attr('data-stocktrack'), qty, $(this).attr('data-stocklevel'), $(this).attr('data-allowoutofstocksale')) == false )
        if (false) {

            alert(tRequestedAmountNotAvailable.replace('XXX', $(this).attr('data-title')) + "\n" + tInStock + ': ' + $(this).attr('data-stocklevel'))
        }
        else {
            quickInCart($(this).attr('data-vid'), $(this).attr('data-title'), $(this).attr('data-img'), $(this).attr('data-url'), fields);
        }
    });

    $('.loading').on('click', function (e) {
        $('.loading').fadeOut(200);
        $('.quickcart-modal').fadeOut(200);
        $('.quickview-modal').fadeOut(200);

        $('.sizechart-holder').fadeOut(200);
    });
});
