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
        const createdMap = await mapStore.create(map);

        props.onToggle(false);
        setConfirmLoading(false);

        if (!createdMap) {
            AntDModal.error({
                title: 'Có lỗi',
                content:  <>
                    {`Không thể tạo map `}
                    <b>{map.name}</b>
                </>,
            });
            return;
        }

        const id = createdMap.id || '';
        navigate("/maps/" + id);
    };
    return <>
        <Modal {...{
            title: 'Tạo map',
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
                <Form.Item name="name" label="Name" required tooltip="This is a required field"
                     rules={[{ required: true, message: 'Name is required' }]}>
                    <Input placeholder=""  autoComplete="newpassword"/>
                </Form.Item>

                <Form.Item name="note" label="Note" tooltip="This is a optional field">
                    <TextArea rows={4} placeholder="" maxLength={255} />
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default ModalCreateMap;