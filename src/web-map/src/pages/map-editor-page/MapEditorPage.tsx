import { Button, Modal as AntDModal } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MapEditorLayout from "../../components/_layouts/MapEditorLayout";
import { MapInfo } from "../../interfaces";
import { MapState, useMapStore } from "../../stores";
import LayerList from "./LayerList";
import ToolBar from "./ToolBar";
import '../../styles/pages/map-editor-page.scss';
import LayerEditor from "./LayerEditor";
import { LayersControl, MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const bottomPanel = <>Map@2022</>
const modals = <>
</>
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

const MapEditorPage: React.FC = () => {

    const { mapState, ...mapStore } = useMapStore();
    const [mapInfo, setMapInfo] = useState<MapInfo>();
    let params = useParams();
    const mapid = params['mapid'] as string;

    useEffect(() => {
        if (!mapid) return;
        const fetchMapInfo = async () => {
            const map = await mapStore.get(mapid);
            setMapInfo(map);
        }

        fetchMapInfo()
            .catch(err => {
                AntDModal.error({
                    title: 'Có lỗi',
                    content: <>
                        {`Không thể lấy thông tin map ${mapid} `}
                    </>,
                });
            })
    }, [mapid]);

    const mapRenderer = useCallback(() => {
        const defaultCenter: L.LatLngTuple = [51.505, -0.09];
        const defaultZoom = 13

        return <>
            <MapContainer center={[51.505, -0.09]} zoom={13} 
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

            </MapContainer>
        </>
    }, [mapInfo])

    return <>
        <MapEditorLayout
            toolbar={<ToolBar map={mapInfo} />}
            layerList={<LayerList />}
            layerEditor={<LayerEditor />}
            map={mapRenderer()}
            bottom={bottomPanel}
            modals={modals}
            onItemClick={() => { }}
        />
    </>
        ;
}

export default MapEditorPage;