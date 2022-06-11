import { faSave, faMap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Button, Input, message, Select, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import { comApi } from '../../../apis/comApi';
import { mapApi } from '../../../apis/mapApi'
import MapDisplayPosition from '../../../components/map/MapPositionDisplay';
import { AppWindow } from '../../../config/AppWindow';
import { AppSettings } from '../../../models/AppSettings';
import { MapInfo } from '../../../models/map/Map.modal'
import { MapConfig, parseMapConfig } from '../../../utils/functions';
import API from '../../../config/apis';

declare let window: AppWindow;
const mapPage: string = window.ENV.Map.mapPage;

const MapController = () => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 500)
    }, []);
    return null;
};

const ConfigMap = () => {
    const [mapConfig, setMapConfig] = useState<MapConfig>();
    const [mapInfos, setInfoMaps] = useState<MapInfo[]>([]);
    const [selectedMapId, setSelectedMapId] = useState<string>();
    const [mapTileUrl, setMapTileUrl] = useState<string>();

    const [map, setMap] = useState<L.Map | undefined>(undefined);
    const [position, setPosition] = useState<L.LatLng | undefined>(undefined);
    const layerRef = useRef<L.TileLayer>(null);

    const fetchMaps = useCallback(async () => {
        const maps = await mapApi.getMaps()
        setInfoMaps(maps);
    }, [mapApi, setInfoMaps]);

    const fetchSettings = useCallback(async () => {
        const resposne = await comApi.getSettings();
        if (resposne.isSuccess) {
            const appSettings = resposne.data;
            const mapConfig = parseMapConfig(appSettings);
            setMapConfig(mapConfig);
        }

    }, [mapApi, setInfoMaps]);

    useEffect(() => {
        fetchMaps();
        fetchSettings();
    }, [])

    useEffect(() => {
        if (mapConfig && mapConfig.layers.length > 0) {
            const { id, url } = mapConfig.layers[0];
            const tileMapUrl = API.MAP_SERVICE + url;

            setSelectedMapId(id);
            setMapTileUrl(tileMapUrl);
            if (layerRef.current) {
                layerRef.current.setUrl(tileMapUrl);
            }
        }
    }, [mapConfig, layerRef.current])

    const onMove = useCallback(() => {
        setPosition(map?.getCenter())
    }, [map]);

    useEffect(() => {
        map?.on('move', onMove)
        return () => {
            map?.off('move', onMove)
        }
    }, [map, onMove])

    useEffect(() => {
        const mapInfo = mapInfos.find(o => o.id === selectedMapId);
        if (!mapInfo) {
            setMapTileUrl(undefined);
            return;
        }

        const tileMapUrl = API.MAP_SERVICE + mapInfo.latestTileUrl;
        setMapTileUrl(tileMapUrl);
        if (layerRef.current) {
            layerRef.current.setUrl(tileMapUrl);
        }
        
    }, [selectedMapId, mapInfos, layerRef.current]);

    const onSave = useCallback(async () => {
        if (!map) return;
        const center = map.getCenter();
        const zoom = map.getZoom();
        const bounding = map.getBounds();

        // console.log({
        //     center,
        //     zoom, 
        //     bounding: [[bounding.getSouth(),bounding.getWest()], [bounding.getNorth(),bounding.getEast()]]
        // })

        await comApi.updateSettings('MapDefaultCenter', JSON.stringify([center.lat, center.lng]))
        await comApi.updateSettings('MapDefaultZoom', zoom.toString())
        await comApi.updateSettings('MapBounding',
            JSON.stringify([[bounding.getSouth(), bounding.getWest()], [bounding.getNorth(), bounding.getEast()]]));

        const mapInfo = mapInfos.find(o => o.id === selectedMapId);
        let layers = [];
        if (mapInfo) {
            layers.push({ id: mapInfo.id, url: mapInfo!.currentTileUrl });
        }
        await comApi.updateSettings('MapTileLayers', JSON.stringify(layers));

        message.success("Lưu thành công")

    }, [map, selectedMapId, mapInfos]);

    return (
        <div className='config-map'>
            <div className='config-map__header'>
                <h5>Cấu hình bản đồ</h5>
                <div className='flex-spacer'></div>
                <div>
                    <button className="button button-primary button--icon-label add-btn"
                        onClick={onSave} disabled={!map}
                    >
                        <FontAwesomeIcon icon={faSave} />
                        <span className="button-label"> Lưu </span>
                    </button>
                </div>
            </div>
            <div>
                <Input.Group compact>
                    <Select placeholder="Chọn bản đồ nền" style={{ width: 300 }}
                        value={selectedMapId}
                        onChange={(value, option) => {
                            setSelectedMapId(value);
                        }}>
                        {mapInfos.length > 0 &&
                            <Select.Option key='none' value={''} >
                                Không chọn
                            </Select.Option>
                        }
                        {mapInfos.map(o => <Select.Option key={o.id} value={o.id} label={o.name} >
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: "center"
                            }}>
                                <Avatar src={o.imageUrl} shape="square" size={'small'} />
                                <span style={{ marginLeft: '5px' }}>{o.name} </span>
                            </div>
                        </Select.Option>
                        )}
                    </Select>
                    <Tooltip title="Tải lại">
                        <Button icon={<ReloadOutlined />} onClick={() => {
                            fetchMaps();
                        }} />
                    </Tooltip>
                    <Tooltip title="Tạp bản đồ nền">
                        <Button icon={<FontAwesomeIcon icon={faMap} />}
                            onClick={() => {
                                window.open(mapPage, "_blank");
                            }}
                        />
                    </Tooltip>
                </Input.Group>

            </div>

            <div style={{ marginTop: 20 }}>
                {mapConfig &&
                    <MapContainer center={mapConfig.center} zoom={mapConfig.zoom}
                        scrollWheelZoom={true}
                        zoomControl={false}
                        whenCreated={setMap}>

                        <MapController />
                        <ZoomControl position="topright" />

                        <TileLayer key="base" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {mapTileUrl &&
                            <TileLayer tms={true} ref={layerRef} url={mapTileUrl} />
                        }

                        {/* {mapConfig.layers.map((o,index)=>{
                            <TileLayer key={'layer'+index} url={o}
                            />
                        })} */}
                        <MapDisplayPosition />
                    </MapContainer>
                }
            </div>

            {/* {mapInfos.map(o =>
                <>
                    <div className="map-item">
                        <div className="map-item__img-container">
                            <img src={o.imageUrl} alt="map image" />
                        </div>
                        {o.name}
                        <div>
                            {o.latestTileUrl}
                        </div>
                    </div>

                </>
            )} */}
        </div>
    )
}

export default ConfigMap