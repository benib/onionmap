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

    var visibleRelays   = [];
    var invisibleRelays = [];

    var showRelays = function(filters,query,limit) {
        
        var apiUrl = getOnionooUri(filters,query,limit);
        console.log(apiUrl);

        $.getJSON(apiUrl, function(data) {

            $('#filteredRelaysCount')[0].innerHTML = data.relays.length;

            //move the old ones to invisible
            invisibleRelays = visibleRelays;
            visibleRelays = [];
            
            $.each( data.relays, function( key, rawRelay ) {
                var invisibleRelayIndex = getRelayIndex(rawRelay, invisibleRelays);
                
                if (invisibleRelayIndex >= 0) {
                    visibleRelays.push(invisibleRelays.slice(invisibleRelayIndex,1));
                } else {
                    visibleRelays.push(rawRelay);
                }
            });

            $.each(invisibleRelays, function(key, relay) {
                if (relay.hasOwnProperty('marker')) {
                    markers.removeLayer(relay.marker);
                }
            });

            $.each(visibleRelays, function(key, relay) {

                if (relay.hasOwnProperty('marker') === false) {
                    if (relay.hasOwnProperty('a')) {
                        $.getJSON('http://www.telize.com/geoip/' + relay.a[0] + '?callback=?', function(geoipData) {
                            if (geoipData.latitude && geoipData.longitude) {

                                relay.latlng = L.latLng(geoipData.latitude, geoipData.longitude);

                                relay.marker = new L.Marker(relay.latlng);

                                if (getRelayIndex(relay,visibleRelays) >= 0) {
                                    markers.addLayer(relay.marker);
                                }
                                
                                relay.marker.bindPopup('loading...')
                                    .on('popupopen', function() {
                                        var popup = this._popup;
                                        $.getJSON('https://onionoo.torproject.org/details?search=' + relay.f, function(detailData) {
                                            relay.detail = detailData.relays[0];
                                            popup.setContent(getPopupContent(relay));
                                        });
                                    });
                            }
                            
                        });
                    }
                    
                }

            });

        });

    };

    var getRelayIndex = function(relay,arr) {
        var index = -1;
        $.each(arr, function(k, r) {
            if (r.f === relay.f) {
                index = k;
            }
        });
        return index;
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

    var getPopupContent = function(relay) {
        return '<h4>' + relay.detail.nickname + '</h4>'+
                '<a href="https://globe.torproject.org/#/relay/'+relay.f+'">View on Globe</a>'+
                '<table>'+
                    '<tr><th>OR Address</th><td>' + relay.detail.or_addresses[0] + '</td></tr>'+
                    '<tr><th>AS Name</th><td>' + relay.detail.as_name + '</td></tr>'+
                    '<tr><th>AS Number</th><td>' + relay.detail.as_number + '</td></tr>'+
                    '<tr><th>Bandwitdh adv.</th><td>' + getNiceBandwidth(relay.detail.advertised_bandwidth) + '</td></tr>'+
                    '<tr><th>Platform</th><td>' + relay.detail.platform + '</td></tr>'+
                '</table>';
    };

    var getNiceBandwidth = function(bps) {
        if (bps > Math.pow(10,6)) {
            return getRoundedNumber(bps/Math.pow(10,6),2) + ' MB/s';
        }
        if (bps > Math.pow(10,3)) {
            return getRoundedNumber(bps/Math.pow(10,3),2) + ' kB/s';
        }
        return getRoundedNumber(bps,2) + ' B/s';
    };

    var getRoundedNumber = function(number,numberOfDecimals) {
        var shift = Math.pow(10,numberOfDecimals);
        return (Math.round(number * shift)/shift).toFixed(numberOfDecimals);
    };
    
    var defaultFilters = [];
    defaultFilters.flag = $('#flag')[0].value;
    showRelays(defaultFilters,'',$('#limit')[0].value);

});
