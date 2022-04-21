import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapInfo } from "../interfaces";
import { MapState, useMapStore } from "../stores";
import '../styles/pages/maps-page.scss';
import { useObservable } from "../utils/hooks";

const MapItem = ( {map} : any)=>{
    return <>
        <div className="map-item">
            Map {map}
        </div>
    </>
}
const MapsPage : React.FC = ()=>{
    const [maps, setMaps] = useState([
        1,2,3,4,5
    ]);
    const mapStore = useMapStore();
    const mapObservable = mapStore.getMapObservable();
    const mapState = useObservable<MapState>(mapObservable);
    useEffect(() => {
        mapStore.list();
    }, []);

    return <>
        <div className="maps-page">
            <div>
                <div className="new-map-btn">
                    <Link to="/maps/new">Tạo map</Link>
                </div>
            </div>
            <div>
                mapState.maps.length: {mapState.maps.length}
            </div>
            <div className="maps-page__list-map">
                {maps.map( (map_item) =>{
                    return <MapItem key={map_item} map={map_item} />
                })}
            </div>
        </div>
        
    </>
}

export default MapsPage;