$(function() {
    'use strict';

    var map = L.map('map').setView([14.12, 0.34], 3);

    L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.',
        styleId: 22677
    }).addTo(map);

    var heatmaps = {};

    $('#heatmapType').on('change', function() {
        $.each(heatmaps, function(key, heatmap) {
            heatmap.hide();
        });
        if (!(heatmaps[this.value] instanceof Heatmap)) {
            switch (this.value) {
                case 'Exit Probability':
                    heatmaps[this.value] = new HeatmapExitProbability(map);
                    break;
                case 'Guard Probability':
                    heatmaps[this.value] = new HeatmapGuardProbability(map);
                    break;
                case 'Middle Probability':
                    heatmaps[this.value] = new HeatmapMiddleProbability(map);
                    break;
                case 'Advertised Exit Bandwidth':
                    heatmaps[this.value] = new HeatmapBandwidthAdvertisedExit(map);
                    break;
                case 'Observed Exit Bandwidth':
                    heatmaps[this.value] = new HeatmapBandwidthObservedExit(map);
                    break;
                default:
                    return;
            }
        }
        
        heatmaps[this.value].show(map);
    });

    $('#heatmapType').trigger('change');

});
 