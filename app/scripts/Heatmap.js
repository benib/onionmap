var Heatmap = Class.extend({

    map: undefined,
    countryData: undefined,
    legend: undefined,
    geojson: undefined,

    init: function() {
        this.legend = new HeatmapLegend(this);
    },

    show: function(map) {
        var that = this;
        that.map = map;

        $.getJSON('/data/countries.geo.json', function(countries) {
            that.countryData = countries;
            that.loadData();
        });
    },

    hide: function() {
        $('#topten')[0].innerHTML = '';
        try {
            this.map.removeLayer(this.geojson);
        } catch(e) { }
        try {
            this.legend.removeFrom(this.map);
            $('#topten')[0].innerHTML = '';
        } catch(e) { }
    },

    loadData: function() {
        throw new Error('not implemented');
    },

    getColor: function(value) {
        throw new Error('not implemented');
    }

});