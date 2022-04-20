(function () {

    // TODO: update Tile Grid overlay after base map change
    // TODO: get tilesets list from TMS capabilities response

    var baseMaps = {
        'world-countries': L.tileLayer('/tms/1.0.0/world-countries/{z}/{x}/{y}.png', {
            attribution: 'world-countries',
            maxZoom: 5,
            tms: true //If true, inverses Y axis numbering for tiles (turn this on for TMS services, bottom left is orgin |__
            //https://alastaira.wordpress.com/2011/07/06/converting-tms-tile-coordinates-to-googlebingosm-tile-coordinates/
        }),
        'osm' : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'OpenStreetMap'
        })
    };

    var tileGrid = L.gridLayer.tileGrid({
        opacity: 1.0,
        zIndex: 2,
        pane: 'overlayPane'
    });

    var overlayMaps = {
        'Tile Grid': tileGrid,
        'gg_vn_map': L.tileLayer('/tms/1.0.0/vn_map/{z}/{x}/{y}.png', {
            attribution: 'google map',
            maxZoom: 19,
            tms: false
        }),
        'gg_vn_satelite': L.tileLayer('/tms/1.0.0/vn_satelite/{z}/{x}/{y}.png', {
            attribution: 'google satelite',
            maxZoom: 19,
            tms: false
        }),
        'us_states': L.tileLayer('/tms/1.0.0/us_states/{z}/{x}/{y}.png', {
            attribution: 'wms',
            maxZoom: 19,
            tms: true
        })
    };

    var map = L.map('map', {
        inertia: false,
        doubleClickZoom: false,
        layers: [baseMaps['world-countries'], overlayMaps['vn_map'], tileGrid] //
    }).setView([0, 0], 0);


    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

})();