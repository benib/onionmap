var HeatmapBandwidthObservedExit = HeatmapRelayValuesPerCountry.extend({

    loadData: function() {
        this._super('exit', 'observed_bandwidth');
    },

    getColors: function() {
        return ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b', '#002810'];
    },

    getGrades: function() {
        return [10, 50, 100, 150, 200, 250, 300, 350, 400, 500];
    },

    getRelayValueName: function() {
        return 'Exit Bandwidth Observed';
    },

    getRelayValueForPopup: function(value) {
        return this.getRoundedRelayValue(value) + ' MB/s';
    },

    getRoundedRelayValue: function(value) {
        return (Math.round(value/Math.pow(10,6) * 100)/100).toFixed(2);
    }

});