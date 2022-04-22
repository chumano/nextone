import { Button } from 'antd';
import { useEffect, useState } from 'react';
import Modal from '../../components/modals/Modal';
import { LayerSource, LayerSourceType } from '../../interfaces';
import { useDatasourceStore } from '../../stores/useDataSourceStore';
import '../../styles/pages/data-source-page.scss';
import ModalCreateDataSource from './ModalCreateDataSource';

const DatasouceItem = ({ item, onClick }: { item: LayerSource, onClick: any }) => {
    return <>
        <div className="source-item clickable" title={item.Name} onClick={onClick}>
            {item.Name}
        </div>
    </>;
}
const DataSourcePage: React.FC = () => {
    const { datasourceState: sourceState, ...sourceStore } = useDatasourceStore();
    const [visible, setVisible] = useState(false);
    console.log('sourceState.datasources',sourceState.datasources)
    const showModalCreate = () => {
        //setVisible(true);
        
        sourceStore.create({
            Id: 'aaa',
            Name:'aaaaaaaaa',
            SourceFile: '',
            Properties:{},
            Type: LayerSourceType.Fill
        })
    };

    useEffect(() => {
        sourceStore.list();
    }, []);

    const handleCreateSource = async () => {
        //TODO : show modal to input name 
        showModalCreate();
    }

    const handleEditSource = (item: LayerSource) => {
        return (e: any) => {
        }
    }

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
                        return <DatasouceItem key={item.Id} item={item} onClick={handleEditSource(item)} />
                    })}
                </div>
            </div>  
        </div>
        
        {visible && <ModalCreateDataSource visible={visible} 
            onToggle={(visible)=>{
                setVisible(visible);
            }}/>
        }

    </>
}

export default DataSourcePage;