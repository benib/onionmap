var HeatmapGuardProbability = HeatmapRelayValuesPerCountry.extend({

    loadData: function() {
        this._super('guard', 'guard_probability');
    },

    getColors: function() {
        return ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'];
    },

    getGrades: function() {
        return [0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4];
    },

    getRelayValueName: function() {
        return 'Guard Probability';
    },

    getRelayValueForPopup: function(value) {
        return Math.round(value*10000)/100 + '%';
    },

});