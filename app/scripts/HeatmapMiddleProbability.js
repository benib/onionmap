var HeatmapMiddleProbability = HeatmapRelayValuesPerCountry.extend({

    loadData: function() {
        this._super('running', 'middle_probability');
    },

    getColors: function() {
        return ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'];
    },

    getGrades: function() {
        return [0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4];
    },

    getRelayValueName: function() {
        return 'Middle Probability';
    },

    getRelayValueForPopup: function(value) {
        return Math.round(value*10000)/100 + '%';
    },

});