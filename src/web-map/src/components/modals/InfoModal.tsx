import { useEffect, useState } from "react";
import Modal from "../../components/modals/Modal";

interface InfoModalProps{
    title: string,
    content : string | JSX.Element,
}
const InfoModal: React.FC<InfoModalProps> = (props) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [visible, setVisible] = useState(true);

    useEffect(()=>{
        if(props) setVisible(true);
    },[props]);

    const handleOk = async () => {
        setConfirmLoading(true);
        
        setConfirmLoading(false);
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return <>
        <Modal {...{
            title: props.title,
            isOpen: visible,
            confirmLoading: confirmLoading,
            onOk: handleOk,
            onCancel: handleCancel
        }}>
            
            {typeof(props.content) == 'string' && 
                <>
                    <h3>{props.content}</h3>
                </>
            }
            {typeof(props.content) != 'string' && 
                <>
                    {props.content}
                </> 
            }
        </Modal>
    </>
}

export default InfoModal;