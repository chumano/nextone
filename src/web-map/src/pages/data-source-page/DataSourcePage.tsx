import { Button, Input, Modal as AntDModal, Pagination, Select } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, TableOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Modal from '../../components/modals/Modal';
import { DataSource, DataSourceType, FeatureData, GeoType, ShapeFileProps } from '../../interfaces';
import { useDatasourceStore } from '../../stores/useDataSourceStore';
import '../../styles/pages/data-source-page.scss';
import ModalCreateDataSource from './ModalCreateDataSource';
import ModalEditDataSource from './ModalEditDataSource';
import ModalViewFeature from './ModalViewFeature';
const { Search } = Input;
interface DatasouceItemProps {
    item: DataSource,
    onClick: any,
    onDelete: any,
    onViewData?: (item: DataSource) => void
}
const DatasouceItem: React.FC<DatasouceItemProps> = ({ item, onClick, onDelete, onViewData }) => {

    return <>
        <div className="source-item" title={item.name} >
            <div className='source-item-image'>
                <img src={item.imageUrl} alt="default image" />
            </div>
            <div className='source-item-info'>
                <div>
                    <h3 className='source-item-title clickable' onClick={onClick}>
                        {item.name}
                    </h3>
                    <Button className='delete-btn' onClick={onDelete}
                        danger icon={<DeleteOutlined />} />
                </div>

                <div>
                    <span className='source-info'>
                        {DataSourceType[item.dataSourceType]}
                    </span>
                    <span className='source-info'>
                        {GeoType[item.geoType]}
                    </span>

                </div>

                {item.dataSourceType === DataSourceType.shapeFile &&
                    <div className='source-item-shapefile'>
                        <div>
                            
                            Số dữ liệu: {item.properties[ShapeFileProps.FEATURECOUNT]}
                            
                        </div>
                        <div>
                            { item &&
                                <span className='clickable' onClick={(e) => {
                                    e.stopPropagation();
                                    onViewData && onViewData(item)
                                }}>
                                    <TableOutlined />
                                </span>
                            }


                        </div>
                    </div>
                }


                {item.tags &&
                    <div className='tags__block'>
                        Tags :
                        <ul className='tags__list'>
                            {item.tags.map(tag =>
                                <li className='tag-item' key={tag}> {tag} </li>
                            )}
                        </ul>
                    </div>
                }
            </div>
        </div>
    </>;
}
const DataSourcePage: React.FC = () => {
    const { datasourceState: sourceState, ...sourceStore } = useDatasourceStore();
    const [modalCreateVisible, setModalCreateVisible] = useState(false);
    const [modalEditVisible, setModalEditVisible] = useState(false);
    const [modalViewFeatureVisible, setModalViewFeatureVisible] = useState(false);
    const [modalViewFeatureData, setmodalViewFeatureData] = useState<DataSource>();
    const [modalEditSource, setModalEditSource] = useState<any>(undefined);

    const handleCreateSource = async () => {
        setModalCreateVisible(true);
    }

    const handleEditSource = (item: DataSource) => {
        return (e: MouseEvent) => {
            setModalEditVisible(true);
            setModalEditSource(item);
        }
    }

    const handleDeleteSource = useCallback((item: DataSource) => {
        return (e: MouseEvent) => {
            e.stopPropagation();
            AntDModal.confirm({
                title: `Bạn có muốn xóa ${item.name}?`,
                icon: <ExclamationCircleOutlined />,
                // content: 'Some descriptions',
                onOk() {
                    sourceStore.remove(item.id);
                },
                onCancel() {
                },
            });
        }
    }, [sourceStore])

    const handleViewData = useCallback((item: DataSource) => {
        setModalViewFeatureVisible(true);
        setmodalViewFeatureData(item)
    }, []);

    
    const geoTypeOptions = useMemo(()=>{
        const keytypes = Object.keys(GeoType)
            .filter(key => isNaN(Number(GeoType[key as any])));
        
        return keytypes.map(key =>(
            <Select.Option key={key}>
                {GeoType[key as any]}
            </Select.Option>
        ));
    },[]);
    
    const [searchFilter, setSearchFilter] = useState<any>({
        offset :0,
        pageSize: 10
    });
    const [currentPage, setCurentPage] = useState<number>(1);

    useEffect(()=>{
        //console.log("search...", searchFilter)
        sourceStore.list(searchFilter);
    },[searchFilter])

    const onSearch = useCallback((value:string)=>{
        //console.log(`search text ${value}`);
        setCurentPage(1);
        setSearchFilter((filter:any)=>{
           return {
               ...filter,
               offset:0,
               textSearch: value
           }
        })
    },[setSearchFilter])

    const filterGeoTypeChange = useCallback((values: any[])=>{
        //console.log(`selected geotypes `, values);
        const types = values;
        setCurentPage(1);
        setSearchFilter((filter:any)=>{
            return {
                ...filter,
                offset:0,
                geoTypes: types
            }
         })
    },[])


    return <>
        <div className="datasource-page">
            <div className="datasource-page__header">
                <div className="datasource-page__header__title">
                    Dữ liệu bản đồ
                </div>
                <div className="flex-spacer"></div>
                <div className="datasource-page__header__actions">
                    <Button type="primary" onClick={handleCreateSource}> Tải dữ liệu </Button>
                </div>
            </div>
            <div className="datasource-page__filter">
                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '400px' }}
                    placeholder="Chọn loại dữ liệu"
                    onChange={filterGeoTypeChange}
                    >
                    {geoTypeOptions}
                </Select>
                <div className='flex-spacer'> </div>
                <Search
                    style={{ width: 400 }}
                    placeholder="Tìm kiếm"
                    allowClear
                    enterButton
                    onSearch={onSearch}
                    />
            </div>
            <div className="datasource-page__body">
                <div className="datasource-page__list">
                    {sourceState.datasources.map((item) => {
                        return <DatasouceItem key={item.id} item={item}
                            onClick={handleEditSource(item)}
                            onDelete={handleDeleteSource(item)}
                            onViewData={handleViewData}
                        />
                    })}
                </div>
               
            </div>
            <div className="datasource-page__paging">
                <div className='flex-spacer'></div>
                <Pagination 
                    current={currentPage}
                    total={sourceState.count} 
                    pageSize={searchFilter.pageSize}
                    onChange={(page,pageSize)=>{
                        setCurentPage(page)
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

        {modalCreateVisible && <ModalCreateDataSource visible={modalCreateVisible}
            onToggle={(visible) => {
                setModalCreateVisible(visible);
            }} />
        }

        {modalEditVisible && <ModalEditDataSource visible={modalEditVisible}
            source={modalEditSource}
            onToggle={(visible: boolean) => {
                setModalEditVisible(visible);
            }} />
        }

        {modalViewFeatureVisible 
            && modalViewFeatureData
            && <ModalViewFeature visible={modalViewFeatureVisible}
                item={modalViewFeatureData}
                onToggle={(visible: boolean) => {
                    setModalViewFeatureVisible(visible);
                }} />
        }

    </>
}

export default DataSourcePage;