//var API_URL =  'https://192.168.0.122:7443';
//var IDENTITY_URL = 'https://192.168.0.122:8443';
var API_URL =  'https://ucom-apis.dientoan.vn';
var IDENTITY_URL = 'https://ucom-id.dientoan.vn';
window.ENV = {
    Map: {
        center : [16.21, 106.79],
        zoom : 10,
        minZoom: 9,
        maxZoom: 20,
        //southWest: LatLngExpression, northEast: LatLngExpression
        boundingBox : [ [7.01,95.01],  [23.89,119.92]],//vietnam
        googleApiKey: '',
        baseMapUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        mapPage: 'http://localhost:5107',
    },


    useWebrtcUtils: true,

    //LOCAL //////////////////////////
    Identity: {
        identityUrl : 'https://localhost:5102',
    },
    Apis:{
        masterUrl : 'http://localhost:5103',
        comUrl : 'http://localhost:5104',
        mapUrl : 'http://localhost:5105',
        fileUrl : 'http://localhost:5106',
    },

    //DEMO //////////////////////////
    // Identity: {
    //     identityUrl : IDENTITY_URL,
    // },
    // Apis:{
    //     masterUrl :  API_URL + '/master',
    //     comUrl :  API_URL + '/com',
    //     mapUrl :  API_URL + '/map',
    //     fileUrl :  API_URL + '/file',
    // },

}