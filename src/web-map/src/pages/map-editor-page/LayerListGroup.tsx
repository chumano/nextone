import Collapser from "../../components/common/Collapser";

interface LayerListGroupProps {
    name: string;
    collapsed: boolean;
    onToggleCollapse : () => void
}

const LayerListGroup: React.FC<LayerListGroupProps> = (props) => {
    return <>
        <div className="layer-list-group clickable" onClick={()=>props.onToggleCollapse() }>
            <div
                className="layer-list-group-title"
            >
                {props.name}
            </div>
            <span className="flex-spacer" />
            <Collapser
                style={{ height: 14, width: 14 }}
                isCollapsed={props.collapsed}
            />
        </div>
    </>
}

export default LayerListGroup;