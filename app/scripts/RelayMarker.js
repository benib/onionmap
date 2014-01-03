L.RelayMarker = L.Marker.extend({

    _relay: undefined,
    _instance: undefined,

    initialize: function(r) {

        this._relay = r;

        L.Marker.prototype.initialize.call(this, r.getLatLng());

        var marker = this;

        this.bindPopup('loading...')
            .on('popupopen', function() {
                this._relay.loadDetails(marker);
            });
    },

    populatePopup: function(r) {

        var content =   '<h4>' + r.get('nickname') + '</h4>'+
                        '<a href="https://globe.torproject.org/#/relay/'+r.getFingerprint()+'">View on Globe</a>'+
                        '<table>'+
                            '<tr><th>OR Address</th><td>' + r.get('or_addresses')[0] + '</td></tr>'+
                            '<tr><th>AS Name</th><td>' + r.get('as_name') + '</td></tr>'+
                            '<tr><th>AS Number</th><td>' + r.get('as_number') + '</td></tr>'+
                            '<tr><th>Bandwitdh adv.</th><td>' + r.getNiceBandwidth() + '</td></tr>'+
                            '<tr><th>Platform</th><td>' + r.get('platform') + '</td></tr>'+
                        '</table>';

        this._popup.setContent(content);
    },

});