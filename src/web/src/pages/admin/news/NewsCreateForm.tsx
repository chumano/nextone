import { faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Breadcrumb, Button, Form, Input, message, Upload, UploadProps } from 'antd'
import React from 'react'
import {UploadOutlined} from '@ant-design/icons';
import { useNewsDispatch } from '../../../context/news/newsContext'
import { newsActions } from '../../../context/news/newsStore';

const props: UploadProps = {
    beforeUpload: file => {
      const isPNG = file.type === 'image/png';
      if (!isPNG) {
        message.error(`${file.name} is not a png file`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },
    onChange: info => {
      console.log(info.fileList);
    },
  };
  
const NewsCreateForm = () => {
    const dispatch = useNewsDispatch();
	const [form] = Form.useForm();
    const onClose = () => {
        dispatch(newsActions.setView('main'))
    }

    const onFormFinish =()=>{

    }
    return <div>
        <div className='admin-news-page__head' style={{ paddingTop: '10px' }}>
            <Breadcrumb>
                <Breadcrumb.Item onClick={onClose}>
                    <a href="#">Tin tức</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Thêm mới</Breadcrumb.Item>
            </Breadcrumb>
            <div className='flex-spacer'></div>
            <div>
                <Button type='primary' onClick={onClose}
                >
                    Lưu
                </Button>
                <Button type='default' onClick={onClose}
                >
                    Đóng
                </Button>
            </div>
        </div>
        <div>
        <Form onFinish={onFormFinish} layout='vertical' form={form} >
				<Form.Item name="title" label="Tiêu đề" style={{maxWidth: '600px'}}
					rules={[
						{ required: true, message: 'Đây là trường bắt buộc' },
						{ min: 4, message: "Tên người dùng phải lớn hơn 4 ký tự" }
					]}
				>
					<Input
						type="text"
						placeholder="Tiêu đề"
					/>
				</Form.Item>

                description
                content
				imageUrl
                imageDescription
                
                <Upload {...props}>
    <Button icon={<UploadOutlined />}>Upload png only</Button>
  </Upload>
			</Form>
        </div>
    </div>
}

export default NewsCreateForm