import { Button, Modal, notification, Modal as AntDModal, Typography, Spin } from "antd";
import { SaveOutlined,DeleteOutlined ,ExclamationCircleOutlined, 
    EnvironmentOutlined,PauseOutlined,
    EditOutlined, GlobalOutlined} from '@ant-design/icons';
import { MapInfoState, useMapEditor } from "./useMapEditor";
import { getResponseErrorMessage, handleAxiosApi } from "../../utils/functions";
import { useMapApi } from "../../apis";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PublishMapDTO } from "../../interfaces/dtos";
import { MapInfo } from "../../interfaces";
const { Paragraph } = Typography;
interface ToolBarProps {
    map? : MapInfoState;
}
const ToolBar : React.FC<ToolBarProps> = (props) => {
    const mapApi = useMapApi();
    const navigate = useNavigate();
    const mapEditor = useMapEditor();
    const mapInfo = mapEditor.mapEditorState.mapInfo!;
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState(props.map?.name);
    useEffect(()=>{
        setName(props.map?.name);
    },[props.map?.name])

    const onSave = async () => {
        try{
            setLoading(true);
            await mapEditor.saveMap();
            
            notification['success']({
                message: 'Lưu bản đồ',
                description:
                  'Đã lưu thành công',
              });
        }catch(err){
            const errMsg = getResponseErrorMessage(err);
            Modal.error({
                title: 'Có lỗi',
                content: `Không thể lưu: ${errMsg}`,
            });
        }finally{
            setLoading(false);
        }
     
    }

    const onPublish = async (isPublished: boolean) => {
        const item : PublishMapDTO = {
            isPublished: isPublished
        };
        
        const mapid = mapInfo!.id;
        try{
            const updated = await handleAxiosApi<MapInfo>(mapApi.publish(mapid, item));
            mapEditor.setMapInfo(updated);

            notification['success']({
                message: 'Lưu bản đồ',
                description:
                  'Đã lưu thành công',
              });
        }catch{
            Modal.error({
                title: 'Có lỗi',
                content: <>
                    {`Không thể cập nhật `}
                    <b>{mapInfo!.name}</b>
                </>,
            });
            return;
        }
     
    }

    const deleteMap = async()=>{
        try{
            await mapApi.remove(props.map!.id);
            
            notification['success']({
                message: 'Xóa bản đồ',
                description:
                  'Đã xóa thành công',
              });
              
            navigate("/maps");
        }catch(err){
            const errMsg = getResponseErrorMessage(err);
            Modal.error({
                title: 'Có lỗi',
                content: `Không thể xóa: ${errMsg}`,
            });
        }
    }
    const onDelete = ()=>{
        AntDModal.confirm({
            title: `Bạn có muốn xóa bản đồ này không?`,
            icon: <ExclamationCircleOutlined />,
            okText:'Đồng ý',
            cancelText:'Hủy hỏ',
            onOk() {
                deleteMap();
            },
            onCancel() {
            },
        });
    }

    const openModalEditMap = ()=>{
        mapEditor.showModal('map', true);
    }

    const openModalSymbol = ()=>{
        mapEditor.showModal('symbol', true);
    }

    return <>
        {mapInfo &&
        <div className="map-editor-toolbar">
            <h3 style={{ width: '600px' }}>
                <Link className="link" to="/maps">Bản đồ</Link>
                /{props.map?.name}

                <EditOutlined color={'#1890ff'}  
                    className="clickable"  
                    onClick={openModalEditMap}/>
                {/* <div style={{display:'inline-block', maxWidth:'300px'}}>
                    <Paragraph editable={{ onChange: setName }} style={{display:'inline-block'}}>
                        {name}
                    </Paragraph>
                </div> */}
                
            </h3>
            
            <div>
                <Button type="primary" onClick={onSave} loading={loading}>
                    <SaveOutlined /> Lưu bản đồ
                </Button>

                {!mapInfo.isPublished &&
                <Button type="default" onClick={()=>{onPublish(true)}} >
                    <GlobalOutlined/> Xuất bản
                </Button>
                }

                {mapInfo.isPublished &&
                <Button type="default" onClick={()=>{onPublish(false)}} >
                    <PauseOutlined /> Hủy xuất bản
                </Button>
                }

                {/* <Button type="ghost" style={{marginLeft:'10px'}}
                    onClick={openModalSymbol}>
                    <EnvironmentOutlined /> Tải icon
                </Button> */}
            </div>

            <div className="flex-spacer"></div>
            <div style={{marginLeft:'20px'}}>
                <Button className='delete-btn' onClick={onDelete} 
                        disabled={!props.map?.id}
                        danger icon={<DeleteOutlined />} >
                        Xóa bản đồ
                </Button>
            </div>
        </div>
        }
    </>
}

export default ToolBar;