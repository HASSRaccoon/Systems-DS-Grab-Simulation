function load_map() {
    var map = L.map('map')
        .setView([103.96380397575058,
            1.341720496819363], 13);
    // console.log(map);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(map);

    var marker = L.marker(
        [103.96380397575058, 1.341720496819363]
    ).addTo(map);

    var circle = L.circle(
        [103.96352438854126, 1.3422551161508807],
        {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
        }
    ).addTo(map);

    var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]
    ).addTo(map);

    marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
    // .openPopup();
    circle.bindPopup("I am a circle.");
    polygon.bindPopup("I am a polygon.");

    var popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);

    map.on('click', mutils.onMapClick);
}

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

function load_geojson(){
    var geojsonFeature = {
        "type": "Feature",
        "properties": {
            "name": "Coors Field",
            "amenity": "Baseball Stadium",
            "popupContent": "This is where the Rockies play!"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-104.99404, 39.75621]
        }
    };

    L.geoJSON(geojsonFeature).addTo(map);
}

export { load_map, onMapClick, load_geojson };