import { Form, Modal, notification, Tabs } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { useState } from "react";
import SettingMap from "./SettingMap";

interface ModalSettingsProps {
    onClose: () => void
}
const ModalSettings: React.FC<ModalSettingsProps> = ({ onClose }) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [map, setMap] = useState<L.Map>();
    const [tabKey, setTabKey] = useState<string>('map');
    const onTabChange = (key: string) => {
        setTabKey(key);
    }

    const handleOk = async () => {
        if(tabKey == 'map'){
            console.log('map', map?.getCenter());

            setTimeout(()=>{
                setConfirmLoading(false);
                notification['success']({
                    message: 'Lưu icon',
                    description:
                        'Đã lưu thành công',
                });
            },1000)
           
        }else{
            await form.validateFields();
            form.submit();
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const [form] = Form.useForm();
    const onFormFinish = async (values: any) => {
        setConfirmLoading(true);
        const item = {
            name: values['name'],
        };
      
        setTimeout(()=>{
            setConfirmLoading(false);
            notification['success']({
                message: 'Lưu icon',
                description:
                    'Đã lưu thành công',
            });
        },1000)
       
    };
    return <>
        <Modal
            width={800}
            title={'Settings'}
            visible={true}
            confirmLoading={confirmLoading}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Tabs defaultActiveKey="map" tabPosition={'left'} style={{ height: 400 }}
                size={'large'} onChange={onTabChange}
            >
                <Tabs.TabPane tab={`Cấu hình Map`} key={'map'} disabled={false}>
                    <SettingMap onMap={setMap}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab={`Cấu hình Chung`} key={'common'} disabled={false}>
                    <Form form={form}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        initialValues={{ size: 'default', requiredMarkValue: 'required'}}
                        onFinish={onFormFinish}
                        size={'default' as SizeType}
                    >
                        Settings
                    </Form>
                </Tabs.TabPane>
            </Tabs>

        </Modal>
    </>
}

export default ModalSettings;