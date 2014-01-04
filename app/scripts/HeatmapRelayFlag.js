var HeatmapRelayFlag = Heatmap.extend({

    loadData: function(flag, probabilityField) {
        var that = this;

        var apiUrl = 'https://onionoo.torproject.org/details?flag='+flag;
        var probabilities = [];
        
        $.getJSON(apiUrl, function(relayData) {

            $.each(relayData.relays, function(key, relay) {
                var probability = relay[probabilityField] || 0;
                var country = relay.country_name;

                if (probabilities[country] === undefined) {
                    probabilities[country] = 0;
                }

                probabilities[country] = probabilities[country] + probability;

            });

            $.each(that.countryData.features, function(key, country) {
                that.countryData.features[key].properties.probability = probabilities[country.properties.name] || 0;
            });

            that.geojson = L.geoJson(that.countryData, {

                style: function(feature){
                    var probability = feature.properties.probability;

                    return {
                        fillColor: that.getColor(probability),
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    };
                }
            }).addTo(that.map);

            that.countryData.features.sort(function(a, b) {
                return b.properties.probability - a.properties.probability;
            });

            for (var i = 0; i < 10; i++) {
                $('#topten').append(
                        '<li>'+that.countryData.features[i].properties.name + ' ' + Math.round(that.countryData.features[i].properties.probability*1000)/10 + '%</li'
                    );
            }

        });
        this.legend.addTo(this.map);
    },
});