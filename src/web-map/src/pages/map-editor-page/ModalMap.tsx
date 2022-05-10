import { Button, Form, Input,  Modal, notification, Select, Upload } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import React, { useEffect, useState } from "react";
import { useMapApi } from "../../apis";
import { MapInfo } from "../../interfaces";
import { UpdateMapNameDTO } from "../../interfaces/dtos";
import { useMapStore } from "../../stores";
import { handleAxiosApi } from "../../utils/functions";
import { useMapEditor } from "./useMapEditor";


const ModalMap: React.FC = () => {
    const api = useMapApi();
    const mapEditor = useMapEditor();
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(()=>{
        form.setFieldsValue({
            name: mapEditor.mapEditorState.mapInfo?.name
        })
    },[mapEditor.mapEditorState.mapInfo?.name])
    
    const handleOk = async () => {
        await form.validateFields();
        form.submit();
    };

    const handleCancel = () => {
        mapEditor.showModal('map', false);
    };


   
    const onFormFinish = async (values: any) => {
        
        setConfirmLoading(true);
        const item : UpdateMapNameDTO = {
            name: values['name'],
        };
        
        const mapid = mapEditor.mapEditorState.mapInfo!.id;
        try{
            const updated = await handleAxiosApi<MapInfo>(api.updateName(mapid, item));
            mapEditor.setMapInfo(updated);

            notification['success']({
                message: 'Lưu map',
                description:
                  'Đã lưu thành công',
              });
        }catch{
            Modal.error({
                title: 'Có lỗi',
                content: <>
                    {`Không thể upload `}
                    <b>{item.name}</b>
                </>,
            });
            return;
        }
      
        setConfirmLoading(false);

    };
    return <>
        <Modal  width={500}
            title={'Map'}
            visible={true}
            confirmLoading={confirmLoading}
            onOk={handleOk}
            onCancel={handleCancel}
            >
            <Form form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                initialValues={{ 
                    size: 'default', 
                    requiredMarkValue:  'required', 
                }}
                onFinish={onFormFinish}
                size={'default' as SizeType}
            >
              
                <Form.Item name="name" label="Name" required tooltip="This is a required field"
                    rules={[{ required: true, message: 'Name is required' }]}>
                    <Input placeholder="input placeholder"  autoComplete="newpassword"/>
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default ModalMap;
