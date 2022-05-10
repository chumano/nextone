import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    LayersControl, MapContainer, TileLayer,
    useMap, ZoomControl
} from "react-leaflet";
import LayerGoogleLeaflet from "../../map/LayerGoogleLeaflet";
import './setting-map.scss';
import 'leaflet/dist/leaflet.css';
import { AppWindow } from "../../../config/AppWindow";
import { LatLngBounds, LatLngBoundsExpression } from "leaflet";

declare let window: AppWindow;
const defaultCenter = window.ENV.Map.center;
const defaultZoom = window.ENV.Map.zoom;
const defaultBoudingBox = window.ENV.Map.boundingBox;
const GoogleApiKey = process.env.REACT_APP_GOOGLE_APIKEY ||  window.ENV.Map.googleApiKey;

const MapController = () => {
    const map = useMap();
    const [position, setPosition] = useState(() => map.getCenter())
    const [zoom, setZoom] = useState(() => map.getZoom())
    const [boudingBox, setBoudingBox] = useState(() => map.getBounds())
    
    const onMove = useCallback(() => {
        setPosition(map.getCenter())
        setZoom( map.getZoom());
        setBoudingBox(map.getBounds())
    }, [map])

    useEffect(() => {
        setTimeout(() => {
            console.log("map.invalidateSize")
            map.invalidateSize();
        }, 500)
    }, [map]);

    useEffect(() => {
        map.on('move', onMove)
        return () => {
            map.off('move', onMove)
        }
    }, [map, onMove])

    return <p className='leaflet-bottom leaflet-left'  style={{ backgroundColor: 'white', padding: '5px' }}>
        <span className='leaflet-control'>
            lat: {position.lat.toFixed(2)},
            lon: {position.lng.toFixed(2)},
            zoom: {zoom}
            {' '}
            <br/>
            <span>
                [{boudingBox.getSouth().toFixed(2)},{boudingBox.getWest().toFixed(2)}]
                - [{boudingBox.getNorth().toFixed(2)},{boudingBox.getEast().toFixed(2)}]
            </span>
        </span>
    </p>;
};

interface SettingMapProps{
    onMap? : (map:L.Map) =>void
}
const SettingMap: React.FC<SettingMapProps> = ({onMap}) => {
    const center: L.LatLngTuple = defaultCenter
    const zoom = defaultZoom;
    const mapRef = useRef<L.Map>()
    const [map, setMap] = useState<L.Map | any>(null);
    const ref = useRef<L.TileLayer>(null);
    useEffect(() => {
        console.log('map', map);
        if(map){
            onMap && onMap(map);
        }
    }, [map])
    console.log('SettingMap render...')

    const displayMap = useMemo(() => {
        const bb = defaultBoudingBox;
        return <MapContainer center={center} zoom={zoom} maxBounds={undefined}
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

            <LayersControl position="topright" collapsed={true} >
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
                    />
                </LayersControl.BaseLayer>



            </LayersControl>
        </MapContainer>
    }, []);

    return <>
        <div style={{ overflow: 'hidden', height: '400px' }}>
            {displayMap}
        </div>
    </>
}

export default SettingMap;