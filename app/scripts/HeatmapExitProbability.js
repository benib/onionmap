var HeatmapExitProbability = HeatmapRelayValuesPerCountry.extend({

    loadData: function() {
        this._super('exit', 'exit_probability');
    },

    getColors: function() {
        return ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b', '#002810'];
    },

    getGrades: function() {
        return [0.01, 0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.14, 0.16, 0.18];
    },

    getRelayValueName: function() {
        return 'Middle Probability';
    },

    getRelayValueForPopup: function(value) {
        return Math.round(value*10000)/100 + '%';
    },

});