var HeatmapGuardProbability = HeatmapRelayFlag.extend({

    loadData: function() {
        this._super('guard', 'guard_probability');
    },

    getColor: function(value) {
        return value > 0.4  ? '#3f007d' :
               value > 0.35 ? '#54278f' :
               value > 0.3  ? '#6a51a3' :
               value > 0.25 ? '#807dba' :
               value > 0.2  ? '#9e9ac8' :
               value > 0.15 ? '#bcbddc' :
               value > 0.1  ? '#dadaeb' :
               value > 0.05 ? '#efedf5' :
               value > 0.01 ? '#fcfbfd' :
                              '#ffffff' ;
    },

    getGrades: function() {
        return [0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4];
    },

});