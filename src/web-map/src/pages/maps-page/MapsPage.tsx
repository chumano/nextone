import { Button, Input, Pagination, Select, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {GlobalOutlined} from '@ant-design/icons';
import { MapInfo } from "../../interfaces";
import { MapState, useMapStore } from "../../stores";
import '../../styles/pages/maps-page.scss';
import { useObservable } from "../../utils/hooks";
import ModalCreateMap from "./ModalCreateMap";
import defaultMapImg from  '../../assets/images/default_map.png';
import { MAP_API } from "../../config/AppWindow";
import Item from "antd/lib/list/Item";

const { Paragraph } = Typography;
const { Search } = Input;

const MapItem = ( {map, onClick } : {map:MapInfo, onClick : any})=>{
    return <>
        <div className="map-item clickable" title={map.name} onClick={onClick}> 
            <div className="map-item__image-block">
                {map.imageUrl &&
                    <img src={map.imageUrl} alt="map image" />
                }
                {!map.imageUrl &&
                    <img src={defaultMapImg} />
                }
            </div>
            <div className="map-item__body">
                <div  className="map-item__title">
                    {map.name} 
                    {map.isPublished &&
                       <GlobalOutlined title="Đã publish" style={{marginLeft: '5px'}}/>
                    }
                    
                </div>
                <div style={{marginTop: '10px'}}>
                    <div className="tile-info">
                        <label>Current Tile Url: </label>
                        <div className="url-path">
                            <Paragraph code={true} copyable>{MAP_API + map.currentTileUrl}</Paragraph>
                        </div>
                    </div>
                    <div className="tile-info">
                        <label>Latest Tile Url: </label>
                        <div className="url-path">
                            <Paragraph code={true} copyable>{MAP_API + map.latestTileUrl}</Paragraph>
                        </div>
                    </div>
                </div>
               
            </div>
            
        </div>
    </>
}

const MapsPage : React.FC = ()=>{
    const {mapState, ...mapStore} = useMapStore();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    const [modalCreateVisible, setModalCreateVisible] = useState(false);
    const showModalCreate = () => {
        setModalCreateVisible(true);
    };

    const editMap = (item: MapInfo) =>{
        return (e: any)=>{
            navigate("/maps/" + item.id);
        }
    } 
    const [searchFilter, setSearchFilter] = useState<any>({
        offset :0,
        pageSize: 10
    });
    const [currentPage, setCurentPage] = useState<number>(1);

    useEffect(()=>{
        mapStore.list(searchFilter);
    },[searchFilter])

    const onSearch = useCallback((value:string)=>{
        console.log(`search text ${value}`);
        setCurentPage(1);
        setSearchFilter((filter:any)=>{
           return {
               ...filter,
               offset: 0,
               textSearch: value
           }
        })
    },[setSearchFilter, setCurentPage])

    const handlePublishFilterChange = useCallback((value: number)=>{
        console.log(`search text ${value}`);
        setCurentPage(1);
        setSearchFilter((filter:any)=>{
           return {
               ...filter,
               offset: 0,
               publishState: value
           }
        })
    },[setSearchFilter, setCurentPage])


    return <>
        <div className="maps-page">
            <div className="maps-page__header">
                <div className="maps-page__header__title">
                    Danh sách map
                </div>
                <div className="flex-spacer"></div>
                <div className="maps-page__header__actions">
                    {/* <Link to="/maps/new">Tạo map</Link> */}
                    <Button type="primary" onClick={showModalCreate}> Tạo Map </Button>
                </div>
            </div>
            <div className="maps-page__filter">
                <div className='flex-spacer'> </div>
                <Select defaultValue={0} style={{ width: '110px', marginRight: '10px' }}
                    onChange={handlePublishFilterChange}>
                    <Select.Option value={0}>Tất cả</Select.Option>
                    <Select.Option value={1}>Đã publish</Select.Option>
                    <Select.Option value={2}>Chưa publish</Select.Option>
                </Select>

                <Search
                    style={{ width: 400 }}
                    placeholder="Tìm kiếm"
                    allowClear
                    enterButton
                    onSearch={onSearch}
                    />
            </div>
            <div  className="maps-page__body">
                <div className="maps-page__list-map">
                    {mapState.maps.map( (map_item) =>{
                        return <MapItem key={map_item.id} map={map_item} onClick={editMap(map_item)} />
                    })}
                </div>

            </div>
            <div className="maps-page__paging">
                <div className='flex-spacer'></div>
                <Pagination current={currentPage} 
                    total={mapState.count} 
                    pageSize={searchFilter.pageSize}
                    onChange={(page,pageSize)=>{
                        setCurentPage(page);
                        setSearchFilter((filter:any)=>{
                            return {
                                ...filter,
                                offset: (page - 1) * pageSize,
                                pageSize: pageSize
                            }
                        });
                    }}/>
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