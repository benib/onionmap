$(function() {
    'use strict';

    var heatmaps = {
        exitprobability: {
            name: 'Exit Probability',
            cn: HeatmapExitProbability,
        },
        guardprobability: {
            name: 'Guard Probability',
            cn: HeatmapGuardProbability,
        },
        middleprobability: {
            name: 'Middle Probability',
            cn: HeatmapMiddleProbability,
        },
        advertisedexitbw: {
            name: 'Advertised Exit Bandwidth',
            cn: HeatmapBandwidthAdvertisedExit,
        },
        observedexitbw: {
            name: 'Observed Exit Bandwidth',
            cn: HeatmapBandwidthObservedExit,
        },
    };

    
    $.each(heatmaps, function(key, heatmap) {
        $('#heatmapType').append('<option value="'+ key +'">'+ heatmap.name +'</option>');
    });

    var map = L.map('map').setView([14.12, 0.34], 3);

    L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.',
        styleId: 22677
    }).addTo(map);

    $('#heatmapType').on('change', function() {
        location.hash = this.value;
        $.each(heatmaps, function(key, heatmap) {
            if (heatmap.instance instanceof Heatmap) {
                heatmap.instance.hide();
            }
        });
        if (!(heatmaps[this.value].instance instanceof Heatmap)) {
            heatmaps[this.value].instance = new heatmaps[this.value].cn();
        }
        heatmaps[this.value].instance.show(map);
    });

    if (location.hash) {
        $('#heatmapType').val(location.hash.substring(1));
    } else {
        location.hash = 'exitprobability';
        $('#heatmapType').val('exitprobability');
    }

    $('#heatmapType').trigger('change');

});
 