import { useState } from "react";
import Modal from "../../components/modals/Modal";

interface ModalCreateDataSourceProps{
    visible: boolean,
    onToggle: (visible:boolean)=>void
}
const ModalCreateDataSource: React.FC<ModalCreateDataSourceProps> = (props) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('');

    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            props.onToggle(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
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
            WTF : {modalText}
        </Modal>
    </>
}

export default ModalCreateDataSource;