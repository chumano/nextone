import { Button, Modal, notification } from "antd";
import { SaveOutlined } from '@ant-design/icons';
import { MapInfoState, useMapEditor } from "./useMapEditor";
import { getResponseErrorMessage } from "../../utils/functions";

interface ToolBarProps {
    map? : MapInfoState;
}
const ToolBar : React.FC<ToolBarProps> = (props) => {
    const mapEditor = useMapEditor();
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
    return <>
        <div className="map-editor-toolbar">
            <h3 style={{ width: '600px' }}>
                Maps/{props.map?.name}
            </h3>
            <div className="flex-spacer"></div>
            <div>
                <Button type="primary" onClick={onSave}>
                    <SaveOutlined /> Lưu Map
                </Button>
            </div>
        </div>
    </>
}

export default ToolBar;