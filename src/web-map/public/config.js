window.ENV = {
    Map: {
        center : [16.21, 106.79],
        zoom : 5,
        //southWest: LatLngExpression, northEast: LatLngExpression
        //boundingBox : [ [7.01,95.01],  [23.89,119.92]] //vietnam
        boundingBox : undefined,
        apiUrl: 'http://localhost:5105',
        //apiUrl : 'https://ucom-apis.dientoan.vn/map',
        googleApiKey: '',
        baseMapUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        //baseMapUrl: 'http://localhost/{z}/{x}/{y}.png',
    },
    Identity: {
        identityUrl : 'https://localhost:5102',
        //identityUrl : 'https://ucom-id.dientoan.vn'
    }
}