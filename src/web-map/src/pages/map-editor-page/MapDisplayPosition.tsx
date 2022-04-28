
import L from 'leaflet';
import { useCallback, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
interface DisplayPositionProps {
}
const MapDisplayPosition: React.FC<DisplayPositionProps> = ({  }) => {
    const map = useMap();
    const [position, setPosition] = useState(() => map.getCenter())
    const center: L.LatLngTuple = [51.505, -0.09]
    const zoom = 13;
    const onClick = useCallback(() => {
        map.setView(center, zoom)
    }, [map])

    const onMove = useCallback(() => {
        setPosition(map.getCenter())
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
                latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{' '}
                <button onClick={onClick}>reset</button>
            </span>
        </p>
    </>
}

export default MapDisplayPosition;