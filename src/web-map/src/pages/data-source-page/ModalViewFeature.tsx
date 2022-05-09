import { Form, Input, Select } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { features } from "process";
import { useEffect, useState } from "react";
import Modal from "../../components/modals/Modal";
import { DataSource, DataSourceType, FeatureData } from "../../interfaces";
import { UpdateDataSourceDTO } from "../../interfaces/dtos";
import { useDatasourceStore } from "../../stores/useDataSourceStore";

interface ModalViewFeatureProps{
    features: FeatureData[];
    visible : boolean;
    onToggle: (visible: boolean) => void;
}
const ModalViewFeature :React.FC<ModalViewFeatureProps> = (props)=>{
    useEffect(()=>{
       
    }, [props.features])

    const handleOk = async () => {
        props.onToggle(false);
    };

    return <>
        <Modal {...{
            width: 800,
            title: 'Features',
            isOpen: props.visible,
            onOk: handleOk,
            onCancel: handleOk
        }}>
            <div style={{maxHeight: '500px', overflow: 'auto'}}>
                <table >
                    <thead>
                        {Object.keys(props.features[0]).map(k=> 
                            <th key={k}>
                                {k}
                            </th>
                        )}
                    </thead>
                    <tbody>
                    {props.features.map( (o,index)=>
                        <tr key={index}>
                            {Object.keys(o).map(k=> 
                                <td key={k}>
                                    {o[k]}
                                </td>
                            )}
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </Modal>
    </>
}

export default ModalViewFeature;