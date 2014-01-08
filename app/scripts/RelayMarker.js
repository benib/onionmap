L.RelayMarker = L.Marker.extend({

    _relay: undefined,
    _instance: undefined,

    initialize: function(r) {

        this._relay = r;

        L.Marker.prototype.initialize.call(this, r.getLatLng());

        this.populatePopup();
    },

    populatePopup: function() {

        var content =   '<h4>' + this._relay.get('nickname') + '</h4>'+
                        '<a href="https://globe.torproject.org/#/relay/'+this._relay.getFingerprint()+'">View on Globe</a>'+
                        '<table>'+
                            '<tr><th>OR Address</th><td>' + this._relay.get('or_addresses')[0] + '</td></tr>'+
                            '<tr><th>AS Name</th><td>' + this._relay.get('as_name') + '</td></tr>'+
                            '<tr><th>AS Number</th><td>' + this._relay.get('as_number') + '</td></tr>'+
                            '<tr><th>Bandwitdh adv.</th><td>' + this._relay.getNiceBandwidth() + '</td></tr>'+
                            '<tr><th>Platform</th><td>' + this._relay.get('platform') + '</td></tr>'+
                        '</table>';

        this.bindPopup(content);
    },

});