
import { ControlPosition } from 'leaflet';
import { useCallback, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
interface DisplayPositionProps {
    controlPosition?: ControlPosition
}
const MapDisplayPosition: React.FC<DisplayPositionProps> = ({ controlPosition }) => {
    const map = useMap();
    const [position, setPosition] = useState(() => map.getCenter())
    const [zoom, setZoom] = useState(() => map.getZoom())
    const [className, setClassName] = useState('leaflet-top leaflet-left');

    // const fixedCenter: L.LatLngTuple = [51.505, -0.09]
    // const fixedZoom = 13;
    // const onClick = useCallback(() => {
    //     map.setView(fixedCenter, fixedZoom)
    // }, [map])

    useEffect(() => {
        let clas = 'leaflet-top leaflet-left';
        switch (controlPosition) {
            case 'topleft':
                break;
            case 'bottomleft':
                clas = 'leaflet-bottom leaflet-left';
                break;
            case 'topright':
                clas = 'leaflet-top leaflet-right';
                break;
            case 'bottomright':
                clas = 'leaflet-bottom leaflet-right';
                break;
        }
        setClassName(clas);
    }, [controlPosition])


    const onMove = useCallback(() => {
        setPosition(map.getCenter())
        setZoom(map.getZoom());
    }, [map])

    useEffect(() => {
        map.on('move', onMove)
        return () => {
            map.off('move', onMove)
        }
    }, [map, onMove])


    return <>
        <p className={className} >
            <span className='leaflet-control' style={{ backgroundColor: 'white', padding: '5px' }}>
                lat: {position.lat.toFixed(2)},
                lon: {position.lng.toFixed(2)},
                zoom: {zoom}
                {' '}
                {/* <button onClick={onClick}>reset</button> */}
            </span>
        </p>
    </>
}

export default MapDisplayPosition;