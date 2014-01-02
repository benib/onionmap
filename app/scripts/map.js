$(function() {
    'use strict';

    var map = L.map('map').setView([14.12, 0.34], 3);

    L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
        subdomains: ['otile1','otile2','otile3','otile4']
    }).addTo(map);

    var markers = new L.MarkerClusterGroup();
    map.addLayer(markers);

    $(window).on('relay:markercreated', function(event,r) {
        if (r.isMatchingFilters()) {
            markers.addLayer(r.getMarker());
        }
    });

    var relays = [];

    var showRelays = function(filters,query,limit) {
        
        var apiUrl = getOnionooUri(filters,query,limit);

        $.getJSON(apiUrl, function(data) {

            $('#filteredRelaysCount')[0].innerHTML = data.relays.length;

            $.each(relays, function(k, r) {
                r.setMatchesFilters(false);
            });
            
            $.each(data.relays, function( key, rawRelay ) {
                relays.push(window.relay.getInstance(rawRelay).setMatchesFilters(true));
            });

            $.each(relays, function(k, r) {
                if (r.isMatchingFilters() === false) {
                    markers.removeLayer(r.getMarker());
                }
            });

        });

    };

    

    var applyFilter = function() {
        var form = this;

        //wait with reading the values from the form,
        //maybe the slider is still moving
        setTimeout(function() {
            var filters = [];
            if ($(form).find('#flag')[0].value !== 'None') {
                filters.flag = $(form).find('#flag')[0].value;
            }
            if ($(form).find('#as')[0].value > 0) {
                filters.as = $(form).find('#as')[0].value;
            }
            showRelays(filters, $('#query')[0].value, $('#limit')[0].value);
            $('#filters').one('change', applyFilter);
        },500);
    };

    $('#filters').one('change', applyFilter);

    var getOnionooUri = function(filters,query,limit) {
        var filterParamsString = '&';
        for(var filterParam in filters){
            if(filters.hasOwnProperty(filterParam)){
                if(filters[filterParam].length){
                    filterParamsString += filterParam + '=' + filters[filterParam] + '&';
                }
            }
        }

        // remove last &
        filterParamsString = filterParamsString.slice(0, -1);

        var searchParamString = '';
        if (query.length) {
            searchParamString = '&search='+query;
        }

        return 'https://onionoo.torproject.org/summary?limit='+ limit + searchParamString + filterParamsString + '&order=-consensus_weight';
    };

    
    var defaultFilters = [];
    defaultFilters.flag = $('#flag')[0].value;
    showRelays(defaultFilters,'',$('#limit')[0].value);

});
