import { Form, Input, Modal as AntDModal } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import TextArea from "antd/lib/input/TextArea";
import { title } from "process";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MODAL_TYPES, useGlobalModalContext } from "../../components/common/GlobalModals";
import Modal from "../../components/modals/Modal";
import { MapInfo } from "../../interfaces";
import { useMapStore } from "../../stores/useMapStore";

interface ModalCreateMapProps {
    visible: boolean,
    onToggle: (visible: boolean) => void
}
const ModalCreateMap: React.FC<ModalCreateMapProps> = (props) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { mapState, ...mapStore } = useMapStore();
    const { showModal } = useGlobalModalContext();

    const navigate = useNavigate();

    const handleOk = async () => {
        try{
            console.log("form", form);
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
        console.log('onFormValuesChange:', values);
    };
    const onFormFinish = async (values: any) => {
        console.log('onFinish:', values);
        setConfirmLoading(true);

        const map: MapInfo = {
            Name: values['Name'],
            Layers: []
        }
        const createdMap = await mapStore.create(map);

        props.onToggle(false);
        setConfirmLoading(false);

        if (!createdMap) {
            //Show modal
            // showModal(MODAL_TYPES.INFO_MODAL, {
            //     title: 'Có lỗi',
            //     content: `Không thể tạo map ${map.Name}`
                
            // })
            AntDModal.error({
                title: 'Có lỗi',
                content:  <>
                    {`Không thể tạo map `}
                    <b>{map.Name}</b>
                </>,
            });
            return;
        }

        const id = createdMap.Id || '';
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
                initialValues={{ size: 'default' , requiredMarkValue: 'required' , Note :'dd'}}
                onValuesChange={onFormValuesChange}
                onFinish={onFormFinish}
                size={'default' as SizeType}
            >
                <Form.Item name="Name" label="Name" required tooltip="This is a required field"
                     rules={[{ required: true, message: 'Name is required' }]}>
                    <Input placeholder="input placeholder"  autoComplete="newpassword"/>
                </Form.Item>

                <Form.Item name="Note" label="Note" tooltip="This is a optional field">
                    <TextArea rows={4} placeholder="maxLength is 255" maxLength={255} />
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default ModalCreateMap;