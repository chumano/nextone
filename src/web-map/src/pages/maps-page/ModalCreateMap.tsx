import { Form, Input, Modal as AntDModal } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import TextArea from "antd/lib/input/TextArea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modals/Modal";
import { MapInfo } from "../../interfaces";
import { CreateMapDTO } from "../../interfaces/dtos";
import { useMapStore } from "../../stores/useMapStore";

interface ModalCreateMapProps {
    visible: boolean,
    onToggle: (visible: boolean) => void
}
const ModalCreateMap: React.FC<ModalCreateMapProps> = (props) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { ...mapStore } = useMapStore();

    const navigate = useNavigate();

    const handleOk = async () => {
        try{
            //Hàm này sẽ throw error nếu có field ko hợp lệ
            await form.validateFields();
            form.submit();
            const hasError = form.getFieldsError().some(({ errors }) => errors.length);
        }catch(err){

        }
    };

    const handleCancel = () => {
        props.onToggle(false);
    };

    const [form] = Form.useForm();
    const onFormValuesChange = (values:any) => {
        
    };
    const onFormFinish = async (values: any) => {
        setConfirmLoading(true);

        const map: CreateMapDTO = {
            name: values['name'],
        }
        const createdObjResponse = await mapStore.create(map);

        props.onToggle(false);
        setConfirmLoading(false);

        if (!createdObjResponse?.isSuccess) {
            AntDModal.error({
                title: 'Có lỗi',
                content:  <>
                    <b>{createdObjResponse?.errorMessage||'Có lỗi bất thường'}</b>
                </>,
            });
            return;
        }

        const id = createdObjResponse.data.id || '';
        navigate("/maps/" + id);
    };
    return <>
        <Modal {...{
            title: 'Tạo bản đồ',
            isOpen: props.visible,
            confirmLoading: confirmLoading,
            onOk: handleOk,
            onCancel: handleCancel
        }}>
            <Form form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                initialValues={{ size: 'default' , requiredMarkValue: 'required'}}
                onValuesChange={onFormValuesChange}
                onFinish={onFormFinish}
                size={'default' as SizeType}
            >
                <Form.Item name="name" label="Tên" required tooltip="Bắt buộc"
                     rules={[{ required: true, message: 'Thông tin bắt buộc' }]}>
                    <Input placeholder=""  autoComplete="newpassword"/>
                </Form.Item>

                <Form.Item name="note" label="Ghi chú">
                    <TextArea rows={4} placeholder="" maxLength={255} />
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default ModalCreateMap;