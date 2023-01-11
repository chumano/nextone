import { Button, Form, Input, Modal as AntDModal, Select, Upload } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { UploadOutlined } from '@ant-design/icons';
import TextArea from "antd/lib/input/TextArea";
import React, { useState } from "react";
import Modal from "../../components/modals/Modal";
import { DataSourceType, GeoType } from "../../interfaces";
import { useDatasourceStore } from "../../stores/useDataSourceStore";
import { CreateDataSourceDTO } from "../../interfaces/dtos";

interface ModalCreateDataSourceProps {
    visible: boolean,
    onToggle: (visible: boolean) => void
}
const ModalCreateDataSource: React.FC<ModalCreateDataSourceProps> = (props) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { datasourceState: sourceState, ...sourceStore } = useDatasourceStore();

    const [uploadProps, setUploadProps] = useState<any>({
        fileList: [],
        uploading: false,
        multiple: false,
        accept: '.zip',
        beforeUpload: (file: File) => {
            if(!form.getFieldValue('name')){
                form.setFieldsValue({
                    'name': file.name.split('.')[0]
                })
            }
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

    const childrenTags :React.ReactElement[]= [];
    //childrenTags.push(<Select.Option key={'sample'}>{'sample'}</Select.Option>);

    const [form] = Form.useForm();
    const onFormFinish = async (values: any) => {
        
        setConfirmLoading(true);
        const source : CreateDataSourceDTO= {
            name: values['name'],
            dataSourceType: DataSourceType.shapeFile,
            file : values['file'].file, //.fileList
            tags : values['tags']
        };
        
        const createdSourceResponse = await sourceStore.create(source);
       
        setConfirmLoading(false);
        if(!createdSourceResponse?.isSuccess){
            AntDModal.error({
                title: 'Có lỗi',
                content: <>
                    <b>{createdSourceResponse?.errorMessage || 'Không thể upload dữ liệu'}</b>
                </>,
            });
            return;
        }
       
        props.onToggle(false);

    };
    return <>
        <Modal {...{
            title: 'Tải dữ liệu',
            isOpen: props.visible,
            confirmLoading: confirmLoading,
            onOk: handleOk,
            onCancel: handleCancel,
        }}>
            <Form form={form}
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 11 }}
                layout="horizontal"
                initialValues={{ size: 'default', requiredMarkValue: 'required', Note: 'dd' }}
                onFinish={onFormFinish}
                size={'default' as SizeType}
            >
                <Form.Item name="file" label="Shapefile" required 
                    rules={[{ required: true, message: 'Thông tin bắt buộc' }]}>
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Chọn tệp tin</Button>
                    </Upload>
                </Form.Item>

                <Form.Item name="name" label="Tên dữ liệu" required
                    rules={[{ required: true, message: 'Thông tin bắt buộc' }]}>
                    <Input placeholder=""  autoComplete="newpassword"/>
                </Form.Item>

                <Form.Item name="tags" label="Nhãn">
                    <Select mode="tags" style={{ width: '100%' }} placeholder="Nhãn dữ liệu">
                        {childrenTags}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default ModalCreateDataSource;