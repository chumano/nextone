import { Button } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { map } from "rxjs";
import { MapInfo } from "../../interfaces";
import { MapState, useMapStore } from "../../stores";
import '../../styles/pages/maps-page.scss';
import { useObservable } from "../../utils/hooks";
import ModalCreateMap from "./ModalCreateMap";

const MapItem = ( {map, onClick } : {map:MapInfo, onClick : any})=>{
    return <>
        <div className="map-item clickable" title={map.Name} onClick={onClick}> 
            <div className="map-item__image-block">
                <img src="https://cloud.maptiler.com/static/img/maps/basic.png?t=1634127409" />
            </div>
            <div  className="map-item__title">
                {map.Name}
            </div>
        </div>
    </>
}

const MapsPage : React.FC = ()=>{
    const {mapState, ...mapStore} = useMapStore();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    useEffect(() => {
        mapStore.list();
    }, []);

    const [modalCreateVisible, setModalCreateVisible] = useState(false);
    const showModalCreate = () => {
        setModalCreateVisible(true);
    };

    const createMap = async ()=>{
        showModalCreate();
    }


    const editMap = (item: MapInfo) =>{
        return (e: any)=>{
            navigate("/maps/" + item.Id);
        }
    } 

    return <>
        <div className="maps-page">
            <div className="maps-page__header">
                <div className="maps-page__header__title">
                    Danh sách map
                </div>
                <div className="flex-spacer"></div>
                <div className="maps-page__header__actions">
                    {/* <Link to="/maps/new">Tạo map</Link> */}
                    <Button type="primary" onClick={createMap}> Tạo Map </Button>
                </div>
            </div>
            <div  className="maps-page__body">
                <div className="maps-page__list-map">
                    {mapState.maps.map( (map_item) =>{
                        return <MapItem key={map_item.Id} map={map_item} onClick={editMap(map_item)} />
                    })}
                </div>

            </div>
            
        </div>

        {modalCreateVisible && <ModalCreateMap visible={modalCreateVisible} 
            onToggle={(visible)=>{
                setModalCreateVisible(visible);
            }}/>
        }
    </>
}

export default MapsPage;