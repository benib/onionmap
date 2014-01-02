$(function() {
    'use strict';

    var map = L.map('map').setView([14.12, 0.34], 3);

    L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.',
        styleId: 22677
    }).addTo(map);

    var countryData;
    var exitProbability = [];

    

    var style = function(feature) {

        var exitProbability = feature.properties.exit_probability;

        return {
            fillColor: getColor(exitProbability),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    };

    function getColor(value) {
        return value > 0.18 ? '#002810' :
               value > 0.16 ? '#00441b' :
               value > 0.14 ? '#006d2c' :
               value > 0.12 ? '#238b45' :
               value > 0.10 ? '#41ab5d' :
               value > 0.08 ? '#74c476' :
               value > 0.06 ? '#a1d99b' :
               value > 0.04 ? '#c7e9c0' :
               value > 0.02 ? '#e5f5e0' :
               value > 0.01 ? '#f7fcf5' :
                              '#ffffff' ;
    }

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0.01, 0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.14, 0.16, 0.18],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 0.001) + '"></i> ' +
                '> ' + grades[i] + '<br>';
        }

        return div;
    };

    legend.addTo(map);

    $.getJSON('/data/countries.geo.json', function(countries) {

        countryData = countries;
        
        var apiUrl = 'https://onionoo.torproject.org/details?flag=exit';

        $.getJSON(apiUrl, function(exitRelayData) {

            $.each(exitRelayData.relays, function(key, exitRelay) {
                var probability = exitRelay.exit_probability || 0;
                var country = exitRelay.country_name;

                if (exitProbability[country] === undefined) {
                    exitProbability[country] = 0;
                }

                exitProbability[country] = exitProbability[country] + probability;

            });

            $.each(countryData.features, function(key, country) {
                countryData.features[key].properties.exit_probability = exitProbability[country.properties.name] || 0;
            });

            L.geoJson(countryData, {style: style}).addTo(map);

            countryData.features.sort(function(a, b) {
                return b.properties.exit_probability - a.properties.exit_probability;
            });

            for (var i = 0; i < 10; i++) {
                $('#topten').append(
                        '<li>'+countryData.features[i].properties.name + ' ' + Math.round(countryData.features[i].properties.exit_probability*1000)/10 + '%</li'
                    );
            }

        });
    });

});
 