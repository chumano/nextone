
import L from 'leaflet';
import { useCallback, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
interface DisplayPositionProps {
}
const MapDisplayPosition: React.FC<DisplayPositionProps> = ({  }) => {
    const map = useMap();
    const [position, setPosition] = useState(() => map.getCenter())
    const [zoom, setZoom] = useState(() => map.getZoom())
    const center: L.LatLngTuple = [51.505, -0.09]
    const defaultzoom = 13;
    const onClick = useCallback(() => {
        map.setView(center, defaultzoom)
    }, [map])

    const onMove = useCallback(() => {
        setPosition(map.getCenter())
        setZoom( map.getZoom());
    }, [map])

    useEffect(() => {
        map.on('move', onMove)
        return () => {
            map.off('move', onMove)
        }
    }, [map, onMove])

    return <>
        <p className='leaflet-top leaflet-left' >
            <span className='leaflet-control' style={{ backgroundColor: 'white', padding: '5px' }}>
                lat: {position.lat.toFixed(2)}, 
                lon: {position.lng.toFixed(2)},
                zoom: {zoom}
                {' '}
                <button onClick={onClick}>reset</button>
            </span>
        </p>
    </>
}

export default MapDisplayPosition;