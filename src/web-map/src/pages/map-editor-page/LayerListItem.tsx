import { useCallback } from "react";
import { CopyOutlined, EyeOutlined, EyeInvisibleOutlined, DeleteOutlined } from '@ant-design/icons';
import {IconLayer} from "../../components/icons";
import { LayerType } from "../../interfaces";
import classnames from "classnames";
interface LayerListItemProps {
    name: string;
    layerType: LayerType;
    isSelected?: boolean;
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
        classAdditions = `maputnik-layer-list-icon-action__${classBlockName}`;

        if (classBlockModifier) {
            classAdditions += ` maputnik-layer-list-icon-action__${classBlockName}--${classBlockModifier}`;
        }
    }

    return <button
        title={props.action}
        className={`maputnik-layer-list-icon-action ${classAdditions}`}
        onClick={props.onClick}
        aria-hidden="true"
    >
        {renderIcon()}
    </button>
}

const LayerListItem: React.FC<LayerListItemProps> = (props) => {
    return <>
        <div
            className={classnames({
                "layer-list-item": true,
                "layer-list-item--selected": props.isSelected,
            })}>
            <div
                className="layer-list-item-title"
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
                onClick={() => { }}
            />
            <IconAction
                action={'duplicate'}
                classBlockName="duplicate"
                onClick={() => { }}
            />
            <IconAction
                action={'show'}
                classBlockName="visibility"
                classBlockModifier={'show'}
                onClick={() => { }}
            />
        </div>
    </>
}

export default LayerListItem;