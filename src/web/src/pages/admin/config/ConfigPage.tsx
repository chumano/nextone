import { useEffect, useState } from "react";
import { mapApi } from "../../../apis/mapApi";
import { MapInfo } from "../../../models/map/Map.modal";
import '../../../styles/pages/admin-config/system-config.scss'

const ConfigPage: React.FC = () => {
    const [maps, setMaps] = useState<MapInfo[]>([])
    useEffect(() => {
        const fetchMaps = async () => {
            const maps = await mapApi.getMaps()
            setMaps(maps);
        }

        fetchMaps();
    }, [])
    return <>
        <div className="system-config">
            Cấu hình hệ thống
            {maps.map(o =>
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
            )}
        </div>

    </>;
}

export default ConfigPage;