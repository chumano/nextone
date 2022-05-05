import { Divider } from "antd";
import { DataSource } from "../../interfaces";
import PaintProperty from "./PaintProperty";
import { LayerStyle } from "./useMapEditor";

interface PaintPropertyGroupProps {
    layerStyle: {[key:string]: any};
    paintProperties: string[];
    dataSource?: DataSource;
    onChange: (property: string, value: any) => void;
}
const PaintPropertyGroup: React.FC<PaintPropertyGroupProps> = (props) => {
    return <>
        {props.paintProperties.map(p =>
            <PaintProperty key={p} 
                property={p}
                dataSource={props.dataSource}
                value={props.layerStyle[p]}
                onChange={(val)=> props.onChange(p,val)}
            />
        )}
    </>
}

export default PaintPropertyGroup;