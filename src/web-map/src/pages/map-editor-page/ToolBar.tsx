import { Button, Modal, notification, Modal as AntDModal, Typography } from "antd";
import { SaveOutlined,DeleteOutlined ,ExclamationCircleOutlined, 
    EnvironmentOutlined,
    EditOutlined} from '@ant-design/icons';
import { MapInfoState, useMapEditor } from "./useMapEditor";
import { getResponseErrorMessage } from "../../utils/functions";
import { useMapApi } from "../../apis";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;
interface ToolBarProps {
    map? : MapInfoState;
}
const ToolBar : React.FC<ToolBarProps> = (props) => {
    const mapApi = useMapApi();
    const navigate = useNavigate();
    const mapEditor = useMapEditor();

    const [name, setName] = useState(props.map?.name);
    useEffect(()=>{
        setName(props.map?.name);
    },[props.map?.name])

    const onSave = async () => {
        try{
            await mapEditor.saveMap();
            
            notification['success']({
                message: 'Lưu map',
                description:
                  'Đã lưu thành công',
              });
        }catch(err){
            const errMsg = getResponseErrorMessage(err);
            Modal.error({
                title: 'Có lỗi',
                content: `Không thể lưu: ${errMsg}`,
            });
        }
     
    }

    const deleteMap = async()=>{
        try{
            await mapApi.remove(props.map!.id);
            
            notification['success']({
                message: 'Xóa map',
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
            title: `Bạn có muốn xóa map này không?`,
            icon: <ExclamationCircleOutlined />,
           
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
        <div className="map-editor-toolbar">
            <h3 style={{ width: '600px' }}>
                <Link className="link" to="/maps">Maps</Link>
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
                <Button type="primary" onClick={onSave}>
                    <SaveOutlined /> Lưu Map
                </Button>

                <Button type="default" style={{marginLeft:'10px'}}
                    onClick={openModalSymbol}>
                    <EnvironmentOutlined /> Tải icon
                </Button>
            </div>
            <div className="flex-spacer"></div>
            <div style={{marginLeft:'20px'}}>
                <Button className='delete-btn' onClick={onDelete}
                        disabled={!props.map?.id}
                        danger icon={<DeleteOutlined />} >
                        Xóa Map
                </Button>
            </div>
        </div>
    </>
}

export default ToolBar;