window.ENV = {
    Map: {
        center : [16.21, 106.79],
        zoom : 10,
        minZoom: 9,
        maxZoom: 20,
        //southWest: LatLngExpression, northEast: LatLngExpression
        boundingBox : [ [7.01,95.01],  [23.89,119.92]],//vietnam
        googleApiKey: '',
        mapPage: 'http://localhost:5107',
    },
    Identity: {
        identityUrl : 'https://localhost:5102',
    },
    Apis:{
        masterUrl : 'http://localhost:5103',
        comUrl : 'http://localhost:5104',
        mapUrl : 'http://localhost:5105',
        fileUrl : 'http://localhost:5106',
    }
}