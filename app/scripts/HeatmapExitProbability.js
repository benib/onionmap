var HeatmapExitProbability = HeatmapRelayFlag.extend({

    loadData: function() {
        this._super('exit', 'exit_probability');
    },

    getColor: function(value) {
        return value > 0.18 ? '#002810' :
               value > 0.16 ? '#00441b' :
               value > 0.14 ? '#006d2c' :
               value > 0.12 ? '#238b45' :
               value > 0.10 ? '#41ab5d' :
               value > 0.08 ? '#74c476' :
               value > 0.06 ? '#a1d99b' :
               value > 0.04 ? '#c7e9c0' :
               value > 0.02 ? '#e5f5e0' :
               value > 0.01 ? '#f7fcf5' :
                              '#ffffff' ;
    },

    getGrades: function() {
        return [0.01, 0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.14, 0.16, 0.18];
    },

});