import { Button, Form, Input, Modal as AntDModal, Select, Upload } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { UploadOutlined } from '@ant-design/icons';
import TextArea from "antd/lib/input/TextArea";
import { useState } from "react";
import Modal from "../../components/modals/Modal";
import { DataSourceType, GeoType } from "../../interfaces";
import { useDatasourceStore } from "../../stores/useDataSourceStore";

interface ModalCreateDataSourceProps {
    visible: boolean,
    onToggle: (visible: boolean) => void
}
const ModalCreateDataSource: React.FC<ModalCreateDataSourceProps> = (props) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('');
    const { datasourceState: sourceState, ...sourceStore } = useDatasourceStore();

    const [uploadProps, setUploadProps] = useState<any>({
        fileList: [],
        uploading: false,
        multiple: false,
        accept: '.zip',
        beforeUpload: (file: any) => {
            setUploadProps((state: any) => ({
                ...state,
                fileList: [file]// [...state.fileList, file],
            }));
            return false;
        },
        onRemove: (file: any) => {
            setUploadProps((state: any) => {
                const index = state.fileList.indexOf(file);
                const newFileList = state.fileList.slice();
                newFileList.splice(index, 1);
                return {
                    ...state,
                    fileList: newFileList,
                };
            });
        },
    })

    const handleOk = async () => {
        await form.validateFields();
        form.submit();
    };

    const handleCancel = () => {
        props.onToggle(false);
    };

    const childrenTags = [];
    childrenTags.push(<Select.Option key={'sample'}>{'sample'}</Select.Option>);
    const onTagsChange = (value: any) => {
        console.log(`selected ${value}`);
    }

    const [form] = Form.useForm();
    const onFormValuesChange = (values: any) => {
        console.log('onFormValuesChange:', values);
    };

    const onFormFinish = async (values: any) => {
        console.log('onFinish:', values);
        setConfirmLoading(true);
        const source = {
            Name: values['Name'],
            DataSourceType: DataSourceType.ShapeFile,
            File : values['File'].file, //.fileList
            Tags : values['Tags']
            
        };
        
        const createdSource = await sourceStore.create(source);
       
        setConfirmLoading(false);
        if(!createdSource){
            AntDModal.error({
                title: 'Có lỗi',
                content: <>
                    {`Không thể upload `}
                    <b>{source.Name}</b>
                </>,
            });
            return;
        }
       
        props.onToggle(false);

    };
    return <>
        <Modal {...{
            title: 'Upload dữ liệu',
            isOpen: props.visible,
            confirmLoading: confirmLoading,
            onOk: handleOk,
            onCancel: handleCancel
        }}>
            <Form form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                initialValues={{ size: 'default', requiredMarkValue: 'required', Note: 'dd' }}
                onValuesChange={onFormValuesChange}
                onFinish={onFormFinish}
                size={'default' as SizeType}
            >
                <Form.Item name="File" label="File" required tooltip="This is a required field"
                    rules={[{ required: true, message: 'File is required' }]}>
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                </Form.Item>

                <Form.Item name="Name" label="Name" required tooltip="This is a required field"
                    rules={[{ required: true, message: 'Name is required' }]}>
                    <Input placeholder="input placeholder"  autoComplete="newpassword"/>
                </Form.Item>

                <Form.Item name="Tags" label="Tags" tooltip="This is a optional field">
                    <Select mode="tags" style={{ width: '100%' }} placeholder="Tags Mode" onChange={onTagsChange}>
                        {childrenTags}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default ModalCreateDataSource;