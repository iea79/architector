/*!
 *
 * Evgeniy Ivanov - 2018
 * busforward@gmail.com
 * Skype: ivanov_ea
 *
 */

var TempApp = {
    lgWidth: 1200,
    mdWidth: 992,
    smWidth: 768,
    resized: false,
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    touchDevice: function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); }
};

function isLgWidth() { return $(window).width() >= TempApp.lgWidth; } // >= 1200
function isMdWidth() { return $(window).width() >= TempApp.mdWidth && $(window).width() < TempApp.lgWidth; } //  >= 992 && < 1200
function isSmWidth() { return $(window).width() >= TempApp.smWidth && $(window).width() < TempApp.mdWidth; } // >= 768 && < 992
function isXsWidth() { return $(window).width() < TempApp.smWidth; } // < 768
function isIOS() { return TempApp.iOS(); } // for iPhone iPad iPod
function isTouch() { return TempApp.touchDevice(); } // for touch device


$(document).ready(function() {
    if (isIOS()) {
        $(function(){$(document).on('touchend', 'a', $.noop)});
    }
	$('[href="#"]').click(function(event) {
		event.preventDefault();
	});

    checkOnResize();

    $('.apartmetSlider').slick({
        focusOnSelect: true,
        nextArrow: '<span class="icon_next" />',
        prevArrow: '<span class="icon_prev" />',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    dots: true
                }
            }
        ]
    })

    $('.collage_mob').slick({
        focusOnSelect: true,
        nextArrow: '<span class="icon_next" />',
        prevArrow: '<span class="icon_prev" />',
        dots: true,
    })

    $('.developerSlider').slick({
        focusOnSelect: true,
        dots: true,
        nextArrow: '<span class="icon_next" />',
        prevArrow: '<span class="icon_prev" />',
    })

    $('.stage__slider').slick({
        dots: true,
        nextArrow: '<span class="icon_next" />',
        prevArrow: '<span class="icon_prev" />',
    })


    $('.optionsSlider').slick({
        pauseOnHover: false,
        pauseOnFocus: false,
        autoplay: true,
        autoplaySpeed: 5000,
        nextArrow: '<span class="icon_next" />',
        prevArrow: '<span class="icon_prev" />',
    })
    $('.optionsSlider__item').first().addClass('active');
    $('.optionsSlider').on('afterChange', function(event, slick, currentSlide, nextSlide){
        $('.optionsSlider__item').removeClass('active');
        $('.optionsSlider__item[data-slide='+currentSlide+']').addClass('active');
    });

    $("input[type=tel]").intlTelInput({
        nationalMode: true,
        defaultCountry: "ru",
        preferredCountries: ['ru'],
        onlyCountries: ['ru', 'az', 'am', 'by', 'kz', 'kg', 'md', 'tj', 'tm', 'uz', 'ua', 'lt', 'lv', 'ee'],
        utilsScript: "/js/utils.js"
    });

    var countryData = $("input[type=tel]").intlTelInput("getSelectedCountryData");

    $('[data-toggle="modal"]').on('click', function() {
        var subject = $(this).data('subject');
        var modal = $('#callback');
        // console.log(subject);

        $('[name="subject"]').val(subject);
        modal.find('[type="submit"]').text(subject);
    })

    $('a[data-lightbox]').on('click', function(e) {
        e.preventDefault();
        var href = $(this).attr('href'),
            modal = $('#lightbox'),
            body = modal.find('.modal-content');

        body.html('<img src='+href+' />')
        modal.modal('show');
    })

});


function togglePlaning() {
    var items = $('.planing__item');
    var pane = $('.planing__pane');

    items.on('click', function() {
        var id = $(this).data('tabs');
        items.removeClass('active');
        pane.removeClass('active');

        $(this).addClass('active');
        $(id).addClass('active');

    })
}
togglePlaning();

$(window).resize(function(event) {
    var windowWidth = $(window).width();
    // Запрещаем выполнение скриптов при смене только высоты вьюпорта (фикс для скролла в IOS и Android >=v.5)
    if (TempApp.resized == windowWidth) { return; }
    TempApp.resized = windowWidth;

	checkOnResize();
});

function checkOnResize() {
    if (isXsWidth()) {
        $('.pesentation .section__title').prependTo('.pesentation__content');
        $('.pesentation__descr').prependTo('.pesentation__form');
        $('.apartmet__title').prependTo('.apartmet');
        $('.planing__pane').each(function(index, el) {
            var id = $(this).attr('id');
            $(this).insertAfter('[data-tabs="#'+id+'"]');
        });
    } else {
        $('.apartmet__title').prependTo('.apartmet__descr');
        $('.pesentation__descr').appendTo('.pesentation__content');
        $('.pesentation .section__title').prependTo('.pesentation__form');

        $('.planing__pane').each(function() {
            $(this).appendTo('.planing__right');
        });
    }
}

function uploadYoutubeVideo() {
    if ($(".js_youtube")) {

        $(".js_youtube").each(function () {
            $(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');

            $(this).append($('<img src="img/play.svg" alt="Play" class="video__play">'));

        });

        $('.video__play, .video__prev').on('click', function () {
            let wrapp = $(this).closest('.js_youtube'),
                videoId = wrapp.attr('id'),
                iframe_url = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&autohide=1";

            if ($(this).data('params')) iframe_url += '&' + $(this).data('params');

            let iframe = $('<iframe/>', {
                'frameborder': '0',
                'src': iframe_url,
            })

            $(this).closest('.video__wrapper').append(iframe);

        });
    }
};

function formSubmit() {
    $("[type=submit]").on('click', function (e){
        e.preventDefault();
        var form = $(this).closest('.form');
        var url = form.attr('action');
        var form_data = form.serialize();
        var field = form.find('[required]');

        empty = 0;

        field.each(function() {
            if ($(this).val() == "") {
                $(this).addClass('invalid');
                // return false;
                empty++;
            } else {
                $(this).removeClass('invalid');
                $(this).addClass('valid');
            }
        });

        if (empty > 0) {
            return false;
        } else {
            $.ajax({
                url: url,
                type: "POST",
                dataType: "html",
                data: form_data,
                success: function (response) {
                    document.location.href = "success.html";
                },
                error: function (response) {
                    console.log(response);
                }
            });
        }

    });

    $('[required]').on('keypress', function() {
        if ($(this).val() != '') {
            $(this).removeClass('invalid').addClass('valid');
        } else {
            $(this).removeClass('valid').addClass('invalid');
        }
    });

    $('.form__privacy input').on('change', function(event) {
        event.preventDefault();
        var btn = $(this).closest('.form').find('.btn');
        if ($(this).prop('checked')) {
            btn.removeAttr('disabled');
        } else {
            btn.attr('disabled', true);
        }
    });
}

formSubmit();
