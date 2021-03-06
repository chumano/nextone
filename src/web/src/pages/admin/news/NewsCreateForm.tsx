import { faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Breadcrumb, Button, Col, Form, Input, message, Modal, Row, Upload, UploadProps, Image, Progress } from 'antd'
import React, { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons';
import { useNewsDispatch } from '../../../context/news/newsContext'
import { newsActions } from '../../../context/news/newsStore';
import TextArea from 'antd/lib/input/TextArea';
import { UploadFile } from 'antd/lib/upload/interface';
import { fileApi } from '../../../apis/fileApi';
import { BaseFile } from '../../../models/file/File.model';
import { IMAGE_FALLBACK } from '../../../utils';
import { newsApi } from '../../../apis/newsApi';
import { CreateNewsDTO } from '../../../models/dtos/NewsDTOs';
import TextEditor from '../../../components/controls/text-editor/TextEditor';


const NewsCreateForm = () => {
    const dispatch = useNewsDispatch();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<BaseFile[]>([])
    const [form] = Form.useForm();

    const uploadProps: UploadProps = {
        accept: '.png,.jpeg,image/*',
        listType: "picture",
        fileList: fileList,
        multiple: false,
        beforeUpload: file => {
            return false;
        },
        onChange: info => {
            console.log("fileList", info.fileList);
            //upload file
            if (info.fileList.length > 0) {
                setFileList([])
                uploadFile(info.fileList[0].originFileObj!)
            }
        },
    };

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        setUploadProgress(0);
        const uploadResponse = await fileApi.uploadFiles([file], (progressEvent) => {
            console.log('upload_file', progressEvent.loaded, progressEvent)
            const progress = Math.round((100 * progressEvent.loaded) / progressEvent.total);
            setUploadProgress(progress);

        }, 'message');

        setUploadProgress(100);
        setIsUploading(false);

        if (!uploadResponse.isSuccess) {
            Modal.error({
                title: 'C?? l???i khi t???i file',
                content: uploadResponse.errorMessage
            });
            return;
        }

        const uploadedFiles = uploadResponse.data;
        setUploadedFiles(uploadedFiles);
    }

    const onSubmit = () => {
        form.validateFields();
        form.submit();
    }

    const onClose = () => {
        dispatch(newsActions.setView('main'))
    }

    const onFormFinish = async (values:any) => {
        console.log('onFormFinish', values);
        const imgUrl = uploadedFiles.length>0 ?uploadedFiles[0].fileUrl:''
        const data : CreateNewsDTO= {
            title: values['title'],
            content: values['content'],
            description: values['description'],
            imageUrl: imgUrl,
            imageDescription:values['imageDescription'],
        }
        const response = await newsApi.createNews(data)

        if(!response.isSuccess){
            message.error(response.errorMessage);
            return;
        }

        setUploadedFiles([]);
        dispatch(newsActions.setView('main'))
    }
    return <div>
        <div className='admin-news-page__head' style={{ paddingTop: '10px' }}>
            <Breadcrumb>
                <Breadcrumb.Item onClick={onClose}>
                    <a href="#">Tin t???c</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Th??m m???i</Breadcrumb.Item>
            </Breadcrumb>
            <div className='flex-spacer'></div>
            <div>
                <Button type='primary' onClick={onSubmit}
                >
                    L??u
                </Button>
                <Button type='default' onClick={onClose}
                >
                    ????ng
                </Button>
            </div>
        </div>
        <div>
            <Form onFinish={onFormFinish} layout='vertical' form={form} >
                <Row>
                    <Col span={12}>
                        <Form.Item name="title" label="Ti??u ?????" style={{ maxWidth: '600px' }}
                            rules={[
                                { required: true, message: '????y l?? tr?????ng b???t bu???c' },
                                { min: 4, message: "Ph???i l???n h??n 4 k?? t???" },
                                { max: 200, message: "T???i ??a 200 k?? t???" }
                            ]}
                        >
                            <Input
                                type="text"
                                placeholder="Ti??u ?????"
                            />
                        </Form.Item>
                        <Form.Item name="description" label="T??m t???t" style={{ maxWidth: '600px' }}
                            rules={[
                                { required: true, message: '????y l?? tr?????ng b???t bu???c' },
                                { min: 20, message: "Ph???i l???n h??n 20 k?? t???" },
                                { max: 500, message: "T???i ??a 500 k?? t???" }
                            ]}
                        >
                            <TextArea rows={4}/>
                        </Form.Item>
                        <Form.Item name="content" label="N???i dung" style={{ maxWidth: '600px' }}
                            rules={[
                                { required: true, message: '????y l?? tr?????ng b???t bu???c' },
                                { min: 100, message: "Ph???i l???n h??n 100 k?? t???" }
                            ]}
                        >
                            <TextEditor  />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>T???i h??nh</Button>
                        </Upload>
                        <div style={{padding:'20px 0'}}>
                            {isUploading && <Progress percent={uploadProgress} />}
                            <Image
                                width={'100%'}
                                height={'auto'}
                                style={{
                                    minHeight: '200px', 
                                    objectFit: 'contain',
                                    maxHeight: '300px'
                                }}
                                src={uploadedFiles.length>0?uploadedFiles[0].fileUrl:'error'}
                                fallback={IMAGE_FALLBACK}
                            />
                        </div>


                        <Form.Item name="imageDescription" label="M?? t??? h??nh ???nh" style={{ maxWidth: '600px' }}
                        >
                            <TextArea rows={2} />
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </div>
    </div>
}

export default NewsCreateForm