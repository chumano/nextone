import { useEffect, useMemo, useRef } from "react";
import { LayersControl, MapContainer, Marker, Popup,
     TileLayer, useMap, ZoomControl } from "react-leaflet";
import L from 'leaflet';
import MapDisplayPosition from "./MapDisplayPosition";
import React from "react";
import { useMapEditor } from "./useMapEditor";
import LayerGoogleLeaflet from "../../components/map/LayerGoogleLeaflet";

const MapController = () => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            console.log(" map.invalidateSize")
            map.invalidateSize();
        }, 500)
    }, []);
    return null;
};

const MapViewContainer : React.FC<any> = (props)=>{
    //const mapEditor = useMapEditor();
    const defaultCenter: L.LatLngTuple = [40.26,  -102.91];
    const defaultZoom = 5;
    const mapRef = useRef<any>()
    console.log("display map : MapViewContainer")
    const displayMap = useMemo(()=>{
        console.log("display map")
        return <MapContainer center={defaultCenter} zoom={defaultZoom} 
            ref={mapRef}
            zoomControl={false}
            doubleClickZoom={false}
            dragging={true}
            scrollWheelZoom={true}
            attributionControl={false}
        >
            <MapController />
            <ZoomControl position="topright" />

            <LayersControl position="topright" collapsed={false} >
                <LayersControl.BaseLayer name="OSM"  >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Google"  checked>
                    <LayerGoogleLeaflet apiKey='AIzaSyDHCY13CNFQE8V6VEzQSEpo0ssyD0xp5g8' 
                    type={'roadmap'} 
                    // googleMapsAddLayers={[{name:'BicyclingLayer'},{name:'TrafficLayer'},{name:'TransitLayer'}]}
                    />
                </LayersControl.BaseLayer>

                <LayersControl.Overlay name="us_states" checked={true}> 
                    <TileLayer tms={true}
                            url="http://localhost:5105/tms/1.0.0/us_states/{z}/{x}/{y}.png"
                        />
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Marker with popup">
                   
                    <Marker position={defaultCenter}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </LayersControl.Overlay>
            </LayersControl>
            
            <MapDisplayPosition></MapDisplayPosition>
            
        </MapContainer>
    },[]);
    return <>
        {displayMap}
    </>
}

const MapView = React.memo(MapViewContainer) 
export default MapView;