import { Button, Form, Input, InputNumber, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react'
import { userApi } from '../../../apis/userApi';
import { BackupSchedule } from './backupContext';


interface IProps {
    backupSchedule: BackupSchedule,
    onClose: (isUpdated?:boolean) => void
}

const ModalBackupSchedule: React.FC<IProps> = ({backupSchedule,  onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            ...backupSchedule
        });
    }, []);


    const handleOk = async () => {
        //await form.validateFields();
        form.submit();
    };
    const onFormFinish = async (values: any) => {
        setIsLoading(true);

        const data = {
            backupIntervalInDays: values['backupIntervalInDays'],
            keepNumber: values['keepNumber'],
        };
        try {
            const { isSuccess, errorMessage } = await userApi.updateBackupSchedule(data.backupIntervalInDays, data.keepNumber);

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
                <Form.Item name='backupIntervalInDays' label='Thời gian định kỳ backup (ngày)'
                    rules={[
                        { required: true, message: 'Đây là trường bắt buộc' }
                    ]}
                >
                    <InputNumber
                        type="number" min={1} max={30}
                        placeholder=""
                    />
                </Form.Item>
                <Form.Item name='keepNumber' label='Số bản backup lưu giữ'
                    rules={[
                        { required: true, message: 'Đây là trường bắt buộc' }
                    ]}
                >
                    <InputNumber
                        type="number" min={1} max={10}
                        placeholder=""
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ModalBackupSchedule