import React, { useCallback } from "react";
import { CopyOutlined, EyeOutlined, EyeInvisibleOutlined, DeleteOutlined } from '@ant-design/icons';
import {IconLayer} from "../../components/icons";
import { LayerType } from "../../interfaces";
import classnames from "classnames";
interface LayerListItemProps {
    name: string;
    layerIndex: number;
    layerType: LayerType;
    isSelected?: boolean;
    visibility?: boolean;
    className: string;
    onLayerAction: (layerIndex:number, action:string)=> void;
}

const IconAction: React.FC<any> = (props) => {

    const { classBlockName, classBlockModifier } = props;
    const renderIcon = useCallback(() => {
        switch (props.action) {
            case 'duplicate': return <CopyOutlined />
            case 'show': return <EyeOutlined />
            case 'hide': return <EyeInvisibleOutlined />
            case 'delete': return <DeleteOutlined />
        }
    }, [props.action]);

    let classAdditions = '';
    if (classBlockName) {
        classAdditions = `layer-list-icon-action__${classBlockName}`;

        if (classBlockModifier) {
            classAdditions += ` layer-list-icon-action__${classBlockName}--${classBlockModifier}`;
        }
    }

    return <button
        title={props.action}
        className={`clickable layer-list-icon-action ${classAdditions}`}
        onClick={props.onClick}
        aria-hidden="true"
    >
        {renderIcon()}
    </button>
}

const LayerListItemContainer: React.FC<LayerListItemProps> = (props) => {
    const visibilityAction = props.visibility ? 'hide' : 'show';

    const actionHanlder = useCallback((action:string)=>{
        return (e:any)=>{
            e.stopPropagation();
            props.onLayerAction(props.layerIndex, action);
        }
    },[props])

    console.log('LayerListItem render', props.name);
    
    return <>
        <div
            className={classnames({
                "layer-list-item": true,
                "layer-list-item--selected": props.isSelected,
                [props.className]: true,
            })}>
            <div className="layer-list-item-title clickable"
                onClick={actionHanlder('select')}
                title={props.name}
            >
                <IconLayer
                    className="layer-handle__icon"
                    type={props.layerType}
                />
                {props.name}
            </div>

            <span className="flex-spacer" />

            <IconAction
                action={'delete'}
                classBlockName="delete"
                onClick={actionHanlder('delete')}
            />
            {/* <IconAction
                action={'duplicate'}
                classBlockName="duplicate"
                onClick={() => { }}
            /> */}
            <IconAction
                action={visibilityAction}
                classBlockName="visibility"
                classBlockModifier={visibilityAction}
                onClick={actionHanlder('visibility')}
            />
        </div>
    </>
}
const LayerListItem = React.memo(LayerListItemContainer, (prevProps:any, nexProps:any)=>{
    let isSame = true;
    let difKey = '';
    Object.keys(nexProps).forEach(key=>{
        let prevV = prevProps[key];
        let nextV = nexProps[key]
        if(prevV!= nextV){
            difKey = key;
            isSame = false;
            return;
        }
    })

    // if(!isSame){
    //     console.warn(`${prevProps.layerIndex} is not Same at key ${difKey}` )
    // }
    return isSame;
});
export default LayerListItem;