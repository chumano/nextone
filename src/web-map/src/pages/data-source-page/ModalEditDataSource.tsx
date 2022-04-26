import { Form, Input, Select } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { useEffect, useState } from "react";
import Modal from "../../components/modals/Modal";
import { useDatasourceStore } from "../../stores/useDataSourceStore";

const ModalEditDataSource :React.FC<any> = (props)=>{
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { datasourceState: sourceState, ...sourceStore } = useDatasourceStore();
    const [formData,setFormData] = useState(props.source)
    useEffect(()=>{
        setFormData(props.source);
    }, [props.source])
    const handleOk = async () => {
        await form.validateFields();
        form.submit();
    };

    const handleCancel = () => {
        props.onToggle(false);
    };
    
    const [form] = Form.useForm();
    const onFormValuesChange = (values: any) => {
        console.log('onFormValuesChange:', values);
    };

    const onFormFinish = async (values: any) => {
        console.log('onFinish:', values);
    }
    
    return <>
        <Modal {...{
            title: 'Cập nhật dữ liệu',
            isOpen: props.visible,
            confirmLoading: confirmLoading,
            onOk: handleOk,
            onCancel: handleCancel
        }}>
            <Form form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                initialValues={{ size: 'default', requiredMarkValue: 'required', 
                    ...formData
                }}
                onValuesChange={onFormValuesChange}
                onFinish={onFormFinish}
                size={'default' as SizeType}
            >
                <Form.Item name="Name" label="Name" required tooltip="This is a required field"
                    rules={[{ required: true, message: 'Name is required' }]}>
                    <Input placeholder="input placeholder"  autoComplete="newpassword"/>
                </Form.Item>

                <Form.Item name="Tags" label="Tags" tooltip="This is a optional field">
                    <Select mode="tags" style={{ width: '100%' }} placeholder="Tags Mode" >
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default ModalEditDataSource;