import { Button, Modal as AntDModal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import Modal from '../../components/modals/Modal';
import { DataSource, DataSourceType, GeoType } from '../../interfaces';
import { useDatasourceStore } from '../../stores/useDataSourceStore';
import '../../styles/pages/data-source-page.scss';
import ModalCreateDataSource from './ModalCreateDataSource';
import ModalEditDataSource from './ModalEditDataSource';

const DatasouceItem = ({ item, onClick, onDelete }: { item: DataSource, onClick: any, onDelete: any }) => {
    return <>
        <div className="source-item clickable" title={item.name} onClick={onClick}>
            <div>
                <h3 className='source-item__title'>
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
    </>;
}
const DataSourcePage: React.FC = () => {
    const { datasourceState: sourceState, ...sourceStore } = useDatasourceStore();
    const [modalCreateVisible, setModalCreateVisible] = useState(false);
    const [modalEditVisible, setModalEditVisible] = useState(false);
    const [modalEditSource, setModalEditSource] = useState<any>(undefined);

    useEffect(() => {
        sourceStore.list();
    }, []);

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
                title: 'Do you Want to delete these items?',
                icon: <ExclamationCircleOutlined />,
                content: 'Some descriptions',
                onOk() {
                    sourceStore.remove(item.id);
                },
                onCancel() {
                },
            });
        }
    }, [sourceStore])

    return <>
        <div className="datasource-page">
            <div className="datasource-page__header">
                <div className="datasource-page__header__title">
                    Dữ liệu bản đồ
                </div>
                <div className="flex-spacer"></div>
                <div className="datasource-page__header__actions">
                    <Button type="primary" onClick={handleCreateSource}> Upload dữ liệu </Button>
                </div>
            </div>
            <div className="datasource-page__body">
                <div className="datasource-page__list">
                    {sourceState.datasources.map((item) => {
                        return <DatasouceItem key={item.id} item={item}
                            onClick={handleEditSource(item)}
                            onDelete={handleDeleteSource(item)}
                        />
                    })}
                </div>
            </div>
        </div>

        {modalCreateVisible && <ModalCreateDataSource visible={modalCreateVisible}
            onToggle={(visible) => {
                setModalCreateVisible(visible);
            }} />
        }

        {modalEditVisible && <ModalEditDataSource visible={modalEditVisible}
            source={modalEditSource}
            onToggle={(visible:boolean) => {
                setModalEditVisible(visible);
            }} />
        }

    </>
}

export default DataSourcePage;