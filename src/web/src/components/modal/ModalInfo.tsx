import { useEffect, useState } from "react";
import { Modal, ModalBody, Spinner } from "reactstrap";
import '../../styles/components/modal/modal.scss';

interface IProp {
    isOpen: boolean,
    title: string,
    content: string,
    className?: string,
    loading?: boolean

    type: 'yes-no' | 'ok',
    yesNoOptions?: {
        onYes: () => void,
        onNo: () => void,
        yesText?: string,
        noText?: string
    }
    okOptions?: {
        onOk: () => void
        okText?: string
    }
}

const ModalInfo: React.FC<IProp> = ({
    isOpen,
    title,
    content,
    className,
    loading,
    type,
    yesNoOptions,
    okOptions
}) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const closeModal = ()=>{
        setIsOpenModal(false);
    }

    useEffect(() => {
        setIsOpenModal(isOpen);
    }, [isOpen])
    return <>
        <Modal isOpen={isOpenModal} className={"modal-info modal-dialog-centered" + (className ? className : "")}>
            <ModalBody>
                <p className="modal-info__head">
                    {title}
                </p>
                <p className="modal-info__content">
                    {content}
                </p>

                <div className="modal-info__bottom">
                    {type == 'yes-no' && (
                        <>
                            <button className="button button-link no-btn" onClick={()=>{ yesNoOptions?.onNo()}}>
                                {yesNoOptions?.noText || "Không"}
                            </button>

                            {!loading?(
                                 <button className="button yes-btn button-primary" onClick={yesNoOptions?.onYes}>
                                    {yesNoOptions?.yesText || "Có"}
                                </button>
                            ):(
                                <button  className="button button-primary">
                                    <Spinner color="primary" size="sm"></Spinner>
                               </button>
                            )}
                        </>
                    )}

                    {type == 'ok' && (
                        <>
                            <button className="" onClick={okOptions?.onOk}>
                                {okOptions?.okText || "Đồng ý"}
                            </button>
                        </>
                    )}
                </div>

            </ModalBody>
        </Modal>
    </>;
}

export default ModalInfo;