var HeatmapLegend = L.Control.extend({

	initialize: function (heatmap) {
        this.heatmap = heatmap;
        L.Util.setOptions(this,{});
    },

    options: {
        position: 'bottomright'
    },


    onAdd: function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = this.heatmap.getGrades(),
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + this.heatmap.getColor(grades[i] + 0.001) + '"></i> ' +
                '> ' + grades[i] + '<br>';
        }

        return div;
    }
});