var HeatmapMiddleProbability = HeatmapRelayFlag.extend({

    loadData: function() {
        this._super('running', 'middle_probability');
    },

    getColor: function(value) {
        return value > 0.4  ? '#7f2704' :
               value > 0.35 ? '#a63603' :
               value > 0.3  ? '#d94801' :
               value > 0.25 ? '#f16913' :
               value > 0.2  ? '#fd8d3c' :
               value > 0.15 ? '#fdae6b' :
               value > 0.1  ? '#fdd0a2' :
               value > 0.05 ? '#fee6ce' :
               value > 0.01 ? '#fff5eb' :
                              '#ffffff' ;
    },

    getGrades: function() {
        return [0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4];
    },

});