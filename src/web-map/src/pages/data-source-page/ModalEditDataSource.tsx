import { Form, Input, Select } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { useEffect, useState } from "react";
import Modal from "../../components/modals/Modal";
import { DataSourceType } from "../../interfaces";
import { useDatasourceStore } from "../../stores/useDataSourceStore";

const ModalEditDataSource :React.FC<any> = (props)=>{
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { datasourceState: sourceState, ...sourceStore } = useDatasourceStore();
    useEffect(()=>{
        const formData :any = {};
        Object.keys(props.source).forEach((key:string) => {
            if(props.source[key]!=undefined){
              formData[key] = props.source[key];
            }
        });
        form.setFieldsValue(formData);
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
        
    };

    const onFormFinish = async (values: any) => {
        setConfirmLoading(true);
        const source : any = {
            Name: values['Name'],
            Tags : values['Tags']
            
        };
        await sourceStore.update(props.source.Id, source);

        setConfirmLoading(false);
        props.onToggle(false);
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
                initialValues={{ size: 'default', requiredMarkValue: 'required'}}
                onValuesChange={onFormValuesChange}
                onFinish={onFormFinish}
                size={'default' as SizeType}
            >
                <Form.Item name="Name" label="Name" required tooltip="This is a required field"
                    rules={[{ required: true, message: 'Name is required' }]}>
                    <Input placeholder="input placeholder"  autoComplete="newpassword"/>
                </Form.Item>

                <Form.Item name="Tags" label="Tags" tooltip="This is a optional field">
                    <Select mode="tags" style={{ width: '100%' }} placeholder="Tags Mode">
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default ModalEditDataSource;