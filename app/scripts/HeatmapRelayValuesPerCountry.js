var HeatmapRelayValuesPerCountry = Heatmap.extend({

    loadData: function(flag, relayAttribute) {
        var that = this;

        var apiUrl = 'https://onionoo.torproject.org/details?flag='+flag;
        var values = {};
        
        $.getJSON(apiUrl, function(relayData) {
            $.each(relayData.relays, function(key, relay) {
                var relayValue = relay[relayAttribute] || 0;
                var country = relay.country;

                if (values[country] === undefined) {
                    values[country] = 0;
                }

                values[country] = values[country] + relayValue;

            });

            $.each(that.countryData.features, function(key, country) {
                that.countryData.features[key].properties.relayValue = values[country.properties.iso_a2.toLowerCase()] || 0;
            });

            that.geojson = L.geoJson(that.countryData, {

                style: function(feature){
                    var relayValue = that.getRoundedRelayValue(feature.properties.relayValue);

                    return {
                        fillColor: that.getColor(relayValue),
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    };
                },

                onEachFeature: function(feature, layer) {
                    if (feature.properties) {
                        var popupContent = '<h4>' + feature.properties.name + '</h4><p>' + that.getRelayValueName() + ': '+
                                           that.getRelayValueForPopup(feature.properties.relayValue)+ '</p>'; 
                        layer.bindPopup(popupContent);
                    }
                }

            }).addTo(that.map);

            that.countryData.features.sort(function(a, b) {
                return b.properties.relayValue - a.properties.relayValue;
            });

            for (var i = 0; i < 10; i++) {
                $('#topten').append(
                        '<li>'+that.countryData.features[i].properties.name + ' ' + that.getRelayValueForPopup(that.countryData.features[i].properties.relayValue)+ '</li'
                    );
            }

        });
        this.legend.addTo(this.map);
    },

    getRoundedRelayValue: function(value) {
        return value;
    },

    getColor: function(value) {
        var that = this;
        var color = '#ffffff';
        $.each(this.getGrades().reverse(), function(key, grade) {
            if (value > grade) {
                color = that.getColors().reverse()[key];
                return false;
            }
        });
        return color;
    },

});