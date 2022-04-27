import { useCallback, useState } from "react";
import {InfoCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';

const FieldDocLabel : React.FC<any> = (props)=>{
    const {label, fieldSpec} = props;
    const {doc} = fieldSpec || {};
    const [open,setOpen]= useState(false);

    const onToggleDoc = useCallback((open:boolean) => {
        setOpen(open);
        props.onToggleDoc(open);
    },[]);

    if (doc) {
      return <label className="doc-wrapper">
        <div className="doc-target">
          {label}
          {'\xa0'}
          <span
            aria-label={open ? "close property documentation" : "open property documentation"}
            className={`clickable doc-button doc-button--${open ? 'open' : 'closed'}`}
            onClick={() => onToggleDoc(!open)}
          >
            {open ? <CloseCircleOutlined /> : <InfoCircleOutlined />}
          </span>
        </div>
      </label>
    }
    else if (label) {
      return <label className="doc-wrapper">
        <div className="doc-target">
          {label}
        </div>
      </label>
    }

    return <div />
    
}

export default FieldDocLabel;