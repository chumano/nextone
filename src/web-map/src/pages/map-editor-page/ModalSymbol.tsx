import { Avatar, Button, Form, Input, List, Modal, notification, Select, Tabs, Upload ,Image as AntDImage} from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { UploadOutlined } from '@ant-design/icons';
import TextArea from "antd/lib/input/TextArea";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { useSymbolStore } from "../../stores";
import { useMapEditor } from "./useMapEditor";
import {DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import { Symbol } from "../../interfaces";

const getBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
const getImageSize = (url: string) => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            resolve({
                width: img.width,
                height: img.height
            });
        }
        img.onerror = error => reject(error);
        img.src = url;
    });
}
const ModalSymbol: React.FC = () => {
    console.log('ModalSymbol render...')
    const mapEditor = useMapEditor();

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<any>();
    const { symbolState, ...symbolStore } = useSymbolStore();

    useEffect(()=>{
        symbolStore.list();
    },[])
    const [uploadProps, setUploadProps] = useState<any>({
        fileList: [],
        uploading: false,
        multiple: false,
        accept: '.png,.jpg',
        beforeUpload: async (file: File) => {
            const preview = await getBase64(file);
            const size = await getImageSize(preview as string)
            setPreviewImage({
                preview,
                size
            });

            setUploadProps((state: any) => ({
                ...state,
                fileList: [file]// [...state.fileList, file],
            }));
            return false;
        },
        onRemove: (file: File) => {
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
        mapEditor.showModal('symbol', false);
    };


    const [form] = Form.useForm();
    const onFormFinish = async (values: any) => {

        setConfirmLoading(true);
        const item = {
            name: values['name'],
            file: values['file'].file,
        };

        const createdItem = await symbolStore.create(item);

        setConfirmLoading(false);
        if (!createdItem) {
            Modal.error({
                title: 'Có lỗi',
                content: <>
                    {`Không thể upload `}
                    <b>{item.name}</b>
                </>,
            });
            return;
        }

        notification['success']({
            message: 'Lưu icon',
            description:
              'Đã lưu thành công',
          });
        form.resetFields();
        setUploadProps((state: any) => ({
            ...state,
            fileList: []
        }));
        setPreviewImage(null);
    };

    const onDelete = (item:Symbol) =>{
        return async (e:any)=>{
            Modal.confirm({
                title: `Bạn có muốn xóa symbol này không?`,
                icon: <ExclamationCircleOutlined />,
               
                onOk: async() => {
                    await symbolStore.remove(item.name);
                },
                onCancel() {
                },
            });
           
        }
    }

    const [tabKey, setTabKey] = useState<string>('list');
    const onTabChange = (key: string) => {
        setTabKey(key);
    }
    return <>
        <Modal 
            width={500}
            title={'Map icons'}
            visible={true}
            confirmLoading={confirmLoading}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={<>
            {tabKey==='add' && 
                <div>
                     <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button key="submit" type="primary" loading={confirmLoading} onClick={handleOk}>
                        OK
                    </Button>
                </div>
            }
            </>}
        >
            <div style={{minHeight: '300px'}}>
            <Tabs defaultActiveKey="list" onChange={onTabChange}>
                <Tabs.TabPane tab="Danh sách icons" key="list">
                    <AntDImage.PreviewGroup>
                    <List
                        itemLayout="horizontal"
                        dataSource={symbolState.symbols}
                        renderItem={item => (
                        <List.Item
                            actions={[
                                 <Button className='delete-btn' onClick={onDelete(item)}
                                    danger icon={<DeleteOutlined />} />
                            ]}
                            >
                            <List.Item.Meta
                                avatar={
                                // <Avatar src={item.imageUrl} shape="square"  size={'default'}/>
                                <AntDImage width={40} src={item.imageUrl}  />
                                }
                                title={item.name}
                            />
                        </List.Item>
                        )}
                    />
                    </AntDImage.PreviewGroup>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Thêm icon" key="add">
                    <Form form={form}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        initialValues={{ size: 'default', requiredMarkValue: 'required', Note: 'dd' }}
                        onFinish={onFormFinish}
                        size={'default' as SizeType}
                    >
                        <Form.Item name="file" label="File" required tooltip="This is a required field"
                            rules={[{ required: true, message: 'File is required' }]}>
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />}>Select File</Button>
                            </Upload>
                        </Form.Item>
                        {previewImage &&
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '5px'
                            }}>
                                <img alt="example" style={{ maxWidth: '100px' }} src={previewImage.preview} />
                                <span>{previewImage.size.width}x{previewImage.size.height}</span>
                            </div>
                        }


                        <Form.Item name="name" label="Name" required tooltip="This is a required field"
                            rules={[{ required: true, message: 'Name is required' }]}>
                            <Input placeholder="" autoComplete="newpassword" />
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>
            </Tabs>
            </div>
            

        </Modal>
    </>
}

export default ModalSymbol;
