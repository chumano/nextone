import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    LayersControl, MapContainer, Marker, Popup,
    TileLayer, useMap, ZoomControl
} from "react-leaflet";
import L from 'leaflet';
import MapDisplayPosition from "./MapDisplayPosition";
import React from "react";
import { useMapEditor } from "./useMapEditor";
import LayerGoogleLeaflet from "../../components/map/LayerGoogleLeaflet";
import LayerGridLeaftlet from "../../components/map/LayerGridLeaflet";
import { AppWindow, MAP_API } from "../../config/AppWindow";
import { MapBoudingBox } from "../../interfaces";

declare let window: AppWindow;
const defaultCenter = window.ENV.Map.center;
const defaultZoom = window.ENV.Map.zoom;
const defaultBoudingBox = window.ENV.Map.boundingBox;
const GoogleApiKey = process.env.REACT_APP_GOOGLE_APIKEY || window.ENV.Map.googleApiKey;

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

interface MapViewProps {
}
const MapViewContainer: React.FC<MapViewProps> = (props) => {
    const mapEditor = useMapEditor();
    const center: L.LatLngTuple = defaultCenter;
    const zoom = defaultZoom;
    const mapRef = useRef<L.Map | any>()
    const [map, setMap] = useState<L.Map | any>(null);
    const mapid = mapEditor.mapEditorState.mapInfo?.id;
    const ref = useRef<L.TileLayer>(null);
    const tileMapUrl = `${MAP_API}/tms/map-${mapid}/{z}/{x}/{y}.png`
    useEffect(() => {
        const tileMapUrl = `${MAP_API}/tms/map-${mapid}/{z}/{x}/{y}.png`
        if (ref.current) {
            ref.current.setUrl(tileMapUrl);
        }
    }, [mapid, ref.current])

   
    const [isFirst, setIsFirst] =useState(true);
    useEffect(() => {
        const boundingBox = mapEditor.mapEditorState.mapInfo!.boundingBox;
        if (map && boundingBox) {
            if(!isFirst) return;
            setIsFirst(false)
            setTimeout(() => {
                const lMap = map as L.Map;
                lMap.flyToBounds([
                    [boundingBox.minY, boundingBox.minX],
                    [boundingBox.maxY, boundingBox.maxX]
                ])
            }, 500)

        }
    }, [mapEditor.mapEditorState.mapInfo?.boundingBox, map, isFirst])

    const displayMap = useMemo(() => {
        console.log("display map", mapid, ref.current)
        return <MapContainer center={center} zoom={zoom} maxBounds={defaultBoudingBox}
            ref={setMap}
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

                <LayersControl.BaseLayer name="Google" checked>
                    <LayerGoogleLeaflet apiKey={GoogleApiKey}
                        type={'roadmap'}
                    // googleMapsAddLayers={[{name:'BicyclingLayer'},{name:'TrafficLayer'},{name:'TransitLayer'}]}
                    />
                </LayersControl.BaseLayer>

                <LayersControl.Overlay name="Current Map" checked={true}>
                    <TileLayer tms={true} ref={ref}
                        url={tileMapUrl}
                    />
                </LayersControl.Overlay>

                {/* <LayersControl.Overlay name="us_states" checked={false}> 
                    <TileLayer tms={true}
                            url="${MAP_API}/tms/1.0.0/us_states/{z}/{x}/{y}.png"
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
    }, []);
    return <>
        {displayMap}
    </>
}

const MapView = React.memo(MapViewContainer)
export default MapView;