import { Modal as AntDModal} from "antd";
import classnames from 'classnames';

const AntD = {
   Modal: AntDModal as any
}
interface ModalProps {
   isOpen: boolean,
   title: string,
   children: any,
   className?: string,
   confirmLoading?: boolean,
   onOk: (e:any) => void,
   onCancel?: (e:any) => void,
   width?: number
}

const Modal: React.FC<ModalProps> = (props) => {
   return <>
      <AntD.Modal
          width={props.width || 500}
          title={props.title}
          visible={props.isOpen}
          onOk={props.onOk}
          confirmLoading={props.confirmLoading}
          onCancel={props.onCancel}
      >
         <div className={classnames("maputnik-modal", props.className)}>
            <div className="maputnik-modal-scroller">
               <div className="maputnik-modal-content">{props.children}</div>
            </div>
         </div>
      </AntD.Modal>

   </>;
}

export default Modal;
