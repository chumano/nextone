import { useEffect, useMemo, useRef } from "react";
import { LayersControl, MapContainer, Marker, Popup,
     TileLayer, useMap, ZoomControl } from "react-leaflet";
import L from 'leaflet';
import MapDisplayPosition from "./MapDisplayPosition";
import React from "react";
import { useMapEditor } from "./useMapEditor";

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
    const defaultCenter: L.LatLngTuple = [51.505, -0.09];
    const defaultZoom = 13;
    const mapRef = useRef<any>()
    console.log("display map : MapViewContainer")
    const displayMap = useMemo(()=>{
        console.log("display map")
        return <MapContainer center={[51.505, -0.09]} zoom={13} 
            ref={mapRef}
            zoomControl={false}
            doubleClickZoom={false}
            dragging={true}
            scrollWheelZoom={true}
            attributionControl={false}
        >
            <MapController />
            <ZoomControl position="topright" />

            <LayersControl position="topright">
                <LayersControl.BaseLayer name="OSM" checked >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>
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