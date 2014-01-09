L.RelayMarker = L.Marker.extend({

    _relay: undefined,
    _instance: undefined,

    initialize: function(r) {

        this._relay = r;

        L.Marker.prototype.initialize.call(this, r.getLatLng());

        this.populatePopup();
    },

    populatePopup: function() {
        var globeBaseUrl = 'https://globe.torproject.org/#/relay/';
        var content =   '<h4>' + this._relay.get('nickname') + '</h4>'+
                        '<a href="'+globeBaseUrl+this._relay.getFingerprint()+'">View on Globe</a>'+
                        '<table>'+
                            '<tr><th>OR Address</th><td>' + this._relay.get('or_addresses')[0] + '</td></tr>'+
                            '<tr><th>AS Name</th><td>' + this._relay.get('as_name') + '</td></tr>'+
                            '<tr><th>AS Number</th><td>' + this._relay.get('as_number') + '</td></tr>'+
                            '<tr><th>Bandwitdh adv.</th><td>' + this._relay.getNiceBandwidth() + '</td></tr>'+
                            '<tr><th>Platform</th><td>' + this._relay.get('platform') + '</td></tr>';

        var family = this._relay.get('family');
        if (family !== undefined) {
            content = content + '<tr><th>Familymembers</th><td class="fingerprint">';
            for (var i=0; i < family.length; i++) {
                content = content + '<a href="' + globeBaseUrl + family[i].substr(1) + '">' + family[i] + '</a><br/>';
            }
            content = content + '</tr>';
        }

        content = content + '</table>';

        this.bindPopup(content);
    },

});