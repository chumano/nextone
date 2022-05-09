import { Button, Form, Input,  Modal, Select, Upload } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import React, { useState } from "react";
import { useMapEditor } from "./useMapEditor";


const ModalMap: React.FC = () => {
    const mapEditor = useMapEditor();

    const [confirmLoading, setConfirmLoading] = useState(false);

  
    const handleOk = async () => {
        await form.validateFields();
        form.submit();
    };

    const handleCancel = () => {
        mapEditor.showModal('map', false);
    };


    const [form] = Form.useForm();
    const onFormFinish = async (values: any) => {
        
        setConfirmLoading(true);
        const item = {
            name: values['name'],
        };
        
       
        setConfirmLoading(false);
        if(!false){
            Modal.error({
                title: 'Có lỗi',
                content: <>
                    {`Không thể upload `}
                    <b>{item.name}</b>
                </>,
            });
            return;
        }
       

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
                initialValues={{ size: 'default', requiredMarkValue: 'required', Note: 'dd' }}
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
