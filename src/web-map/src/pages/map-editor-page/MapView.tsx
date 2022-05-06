import { useEffect, useMemo, useRef } from "react";
import { LayersControl, MapContainer, Marker, Popup,
     TileLayer, useMap, ZoomControl } from "react-leaflet";
import L from 'leaflet';
import MapDisplayPosition from "./MapDisplayPosition";
import React from "react";
import { useMapEditor } from "./useMapEditor";
import LayerGoogleLeaflet from "../../components/map/LayerGoogleLeaflet";
import LayerGridLeaftlet from "../../components/map/LayerGridLeaflet";

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

const GoogleApiKey = process.env.REACT_APP_GOOGLE_APIKEY;

interface MapViewProps {
    mapId : string;
}
const MapViewContainer : React.FC<MapViewProps> = (props)=>{
    //const mapEditor = useMapEditor();
    const defaultCenter: L.LatLngTuple = [40.26,  -102.91];
    const defaultZoom = 5;
    const mapRef = useRef<any>()
    console.log("display map : MapViewContainer")
    const tileMapUrl = `http://localhost:5105/tms/1.0.0/map-${props.mapId}/{z}/{x}/{y}.png`
    const displayMap = useMemo(()=>{
        console.log("display map")
        return <MapContainer center={defaultCenter} zoom={defaultZoom} 
            ref={mapRef}
            zoomControl={false}
            doubleClickZoom={false}
            dragging={true}
            scrollWheelZoom={true}
            attributionControl={false}
            maxZoom={18}
        >
            <MapController />
            <ZoomControl position="topright" />

            <LayersControl position="topright" collapsed={false} >
                {/*osm la tms */}
                <LayersControl.BaseLayer name="OSM" >
                    <TileLayer maxZoom={19}
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>
               
                <LayersControl.BaseLayer name="Google"  checked>
                    <LayerGoogleLeaflet apiKey={GoogleApiKey} 
                        type={'roadmap'} 
                        // googleMapsAddLayers={[{name:'BicyclingLayer'},{name:'TrafficLayer'},{name:'TransitLayer'}]}
                    />
                </LayersControl.BaseLayer>

                <LayersControl.Overlay name="Current Map" checked={true}> 
                    <TileLayer tms={true} 
                            url={tileMapUrl}
                        />
                </LayersControl.Overlay>

                {/* <LayersControl.Overlay name="us_states" checked={false}> 
                    <TileLayer tms={true}
                            url="http://localhost:5105/tms/1.0.0/us_states/{z}/{x}/{y}.png"
                        />
                </LayersControl.Overlay>

                <LayersControl.Overlay name="Grid" checked={true}> 
                    <LayerGridLeaftlet opacity={1.0} zIndex={2} pane='overlayPane'
                        />
                </LayersControl.Overlay> */}

                {/* <LayersControl.Overlay name="Marker with popup">
                   
                    <Marker position={defaultCenter}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </LayersControl.Overlay> */}
            </LayersControl>
            
            <MapDisplayPosition></MapDisplayPosition>
            
        </MapContainer>
    },[props.mapId]);
    return <>
        {displayMap}
    </>
}

const MapView = React.memo(MapViewContainer) 
export default MapView;