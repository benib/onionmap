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

    var relays = [];

    var showRelays = function(filters,query, limit) {
        
        $('#map').addClass('loading');

        var apiUrl = getOnionooUri(filters,query, limit);
        $.getJSON(apiUrl, function(data) {

            $('#filteredRelaysCount')[0].innerHTML = data.relays.length;

            $.each(relays, function(k, r) {
                r.setMatchesFilters(false);
            });
            
            $.each(data.relays, function( key, rawRelay ) {
                var r = window.relay.getInstance(rawRelay);
                r.setMatchesFilters(true);
                if (r.hasMarker() === true) {
                    markers.addLayer(r.getMarker());
                }
                relays.push(r);
            });

            $.each(relays, function(k, r) {
                if (r.isMatchingFilters() === false) {
                    if (r.hasMarker()) {
                        markers.removeLayer(r.getMarker());
                    }
                }
            });

            $('#map').removeClass('loading');

        });

    };

    var applyFilter = function() {
        var form = this;
        //wait with reading the values from the form,
        //maybe the slider is still moving
        setTimeout(function() {
            var filters = [];
            if ($(form).find('#running')[0].checked === true) {
                filters.running = 'true';
            }
            if ($(form).find('#flag')[0].value !== 'All (no flag)') {
                filters.flag = $(form).find('#flag')[0].value;
            }
            if ($(form).find('#as')[0].value > 0) {
                filters.as = $(form).find('#as')[0].value;
            }
            if ($(form).find('#first_seen_days')[0].value) {
                filters.first_seen_days = $(form).find('#first_seen_days')[0].value;
            }
            if ($(form).find('#last_seen_days')[0].value) {
                filters.last_seen_days = $(form).find('#first_seen_days')[0].value;
            }
            if ($(form).find('#contact')[0].value) {
                filters.contact = $(form).find('#contact')[0].value;
            }
            showRelays(filters, $('#query')[0].value, $('#limit')[0].value);
            $('#filters').one('change', applyFilter);
        },500);
    };

    $('#filters').one('change', applyFilter);

    var getOnionooUri = function(filters,query, limit) {
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

        return 'https://onionoo.torproject.org/details?limit='+ limit + searchParamString + filterParamsString + '&order=-consensus_weight';
    };

    
    var defaultFilters = [];
    showRelays(defaultFilters,'',$('#limit')[0].value);
});
