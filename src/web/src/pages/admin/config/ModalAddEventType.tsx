import { Button, Form, Input, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react'
import { comApi } from '../../../apis/comApi';
import { CreateEventTypeDTO } from '../../../models/dtos/EventTypeDTO';

interface ModalAddEventTypeProps {
    onClose: (isUpdated?:boolean) => void
}
const ModalAddEventType: React.FC<ModalAddEventTypeProps> = ({ onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({

        });
    }, []);


    const handleOk = async () => {
        await form.validateFields();
        form.submit();
    };
    const onFormFinish = async (values: any) => {
        setIsLoading(true);

        const data: CreateEventTypeDTO = {
            code: values['code'],
            name: values['name'],
        };
        try {
            const { isSuccess, errorMessage } = await comApi.createEventType(data);

            if (!isSuccess) {
                message.error(errorMessage);
                return;
            }

            message.success("Cập nhật thông tin thành công");
            onClose(true);
        } catch (error) {
            message.error("Lỗi hệ thống, xin vui lòng kiểm tra lại");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title="Cập nhật thông tin"
            visible={true}
            onCancel={() => { onClose(); }}
            footer={[
                <Button key="cancel" onClick={() => { onClose(); }}>
                    Huỷ bỏ
                </Button>,
                <Button key="ok" onClick={handleOk}
                    type="primary"
                    disabled={
                        !form.isFieldsTouched(true) ||
                        !!form.getFieldsError().filter(({ errors }) => errors.length).length
                    }
                    loading={isLoading}
                >
                    Đồng ý
                </Button>,
            ]}
        >
            <Form onFinish={onFormFinish} form={form} layout='vertical'>
                <Form.Item name='code' label='Mã'
                    rules={[
                        { required: true, message: 'Đây là trường bắt buộc' },
                        { min: 4, message: "Phải lớn hơn 4 ký tự" }
                    ]}
                >
                    <Input
                        type="text"
                        placeholder="Mã"
                    />
                </Form.Item>
                <Form.Item name='name' label='Tên'
                    rules={[
                        { required: true, message: 'Đây là trường bắt buộc' },
                        { min: 4, message: "Phải lớn hơn 4 ký tự" }
                    ]}
                >
                    <Input
                        type="text"
                        placeholder="Tên"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ModalAddEventType