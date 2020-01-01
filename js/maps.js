var mapCenter = [43.62284457457145,39.72077099999994];
var officeCenter = [43.59057857453821,39.719621000000004];

function init() {
    var myMap = new ymaps.Map('maps', {
        center: officeCenter,
        zoom: 15,
        controls: []
    });


    var myPlacemark;

    function setMarkerAfterSearch(text) {
        if (text) {
            data = window[text];
        } else {
            data = medical;
        }

        var result = data;
        if (result.length) {
            for (var i = 0; i < result.length; i++) {
                var center = result[i][5],
                    category = result[i][0],
                    name = result[i][1],
                    description = result[i][4],
                    img;
                if (result[i][6] !== '') {
                    img = `<div class="placemark__img" style="background-image: url(`+result[i][6]+`)"></div>`;
                } else {
                    img = '';
                }
                var  template = `<div class="placemark">
                        <div class="placemark__cat">`+category+`</div>
                        `+img+`
                        <div class="placemark__name">`+name+`</div>
                        <div class="placemark__address">`+description+`</div>
                    </div>`;

                var HintLayout = ymaps.templateLayoutFactory.createClass( template, {
                        getShape: function () {
                            var el = this.getElement(),
                                result = null;
                            if (el) {
                                var firstChild = el.firstChild;
                                result = new ymaps.shape.Rectangle(
                                    new ymaps.geometry.pixel.Rectangle([
                                        [0, 0],
                                        [firstChild.offsetWidth, firstChild.offsetHeight]
                                    ])
                                );
                            }
                            return result;
                        }
                    }
                );

                myPlacemark = new ymaps.Placemark(center, {
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: 'img/marker.png',
                    iconImageSize: [60, 84],
                    iconImageOffset: [-30, -65],

                    hintLayout: HintLayout
                });


                myMap.geoObjects.add(myPlacemark);
            }
        }

        officePlacemark = new ymaps.Placemark(officeCenter, {
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'img/marker2.png',
            iconImageSize: [60, 84],
            iconImageOffset: [-30, -65],
        });
        myMap.geoObjects.add(officePlacemark);

    }

    setMarkerAfterSearch();
    myMap.behaviors.disable('scrollZoom');

    $('.infrastructure__item').on('click', function() {
        var text = $(this).data('search');
        myMap.geoObjects.removeAll();
        setMarkerAfterSearch(text)
        $('.infrastructure__item').removeClass('active');
        $(this).addClass('active');
    })

    var myMapCont = new ymaps.Map('map', {
        center: officeCenter,
        zoom: 15,
        controls: []
    }),

    myPlacemarkCont = new ymaps.Placemark(myMapCont.getCenter(), {
    }, {
        iconLayout: 'default#image',
        iconImageHref: 'img/marker.png',
        iconImageSize: [60, 84],
        iconImageOffset: [-30, -65]
    });

    myMapCont.geoObjects.add(myPlacemarkCont)
    myMapCont.behaviors.disable('scrollZoom');

}

ymaps.ready(init);
