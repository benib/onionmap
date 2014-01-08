(function(window, document, undefined) {
    'use strict';

    window.relay = {

        _instances: {},

        getInstance: function(data) {
            if (this._instances[data.fingerprint] !== Relay) {
                this._instances[data.fingerprint] = new Relay(data);
            }
            return this._instances[data.fingerprint];
        },

    };

    var _matchesFilter;

    var _marker;

    var _ip;

    var _fingerprint;

    var _geoIpData;

    var _latlng;

    var _data;

    function Relay(data) {
        this._ip          = data.or_addresses[0].split(':')[0];
        this._fingerprint = data.fingerprint;
        this._latlng      = L.latLng(data.latitude, data.longitude);
        this._data        = data;
        this.loadMarker();
        return this;
    }

    Relay.prototype.loadMarker = function() {
        if (this._latlng) {
            this._marker = new L.RelayMarker(this);
            this._marker.populatePopup(this);
        }
    };

    Relay.prototype.get = function(field) {
        return this._data[field];
    };

    Relay.prototype.getNiceBandwidth = function() {
        var bps = this._data.advertised_bandwidth;
        if (bps > Math.pow(10,6)) {
            return this._getRoundedNumber(bps/Math.pow(10,6),2) + ' MB/s';
        }
        if (bps > Math.pow(10,3)) {
            return this._getRoundedNumber(bps/Math.pow(10,3),2) + ' kB/s';
        }
        return this._getRoundedNumber(bps,2) + ' B/s';
    };

    Relay.prototype._getRoundedNumber = function(number,numberOfDecimals) {
        var shift = Math.pow(10,numberOfDecimals);
        return (Math.round(number * shift)/shift).toFixed(numberOfDecimals);
    };

    Relay.prototype.getLatLng = function() {
        return this._latlng;
    };

    Relay.prototype.getFingerprint = function() {
        return this._fingerprint;
    };

    Relay.prototype.getMarker = function() {
        return this._marker;
    };

    Relay.prototype.hasMarker = function() {
        if (this._marker !== undefined) {
            return true;
        }
        return false;
    };

    Relay.prototype.setMatchesFilters = function(matchesFilters) {
        this._matchesFilter = matchesFilters;
        return this;
    };

    Relay.prototype.isMatchingFilters = function() {
        return this._matchesFilter;
    };

}(window, document));