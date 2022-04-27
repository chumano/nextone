import Collapser from "../../components/common/Collapser";

interface LayerListGroupProps {
    name: string;
}

const LayerListGroup: React.FC<LayerListGroupProps> = (props) => {
    return <>
        <div className="layer-list-group clickable">
            <div
                className="layer-list-group-title"
            >
                Group : {props.name}
            </div>
            <span className="flex-spacer" />
            <Collapser
                style={{ height: 14, width: 14 }}
                isCollapsed={true}
            />
        </div>
    </>
}

export default LayerListGroup;