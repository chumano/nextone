import { Avatar, Button, Input, InputNumber, Select, Switch } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Block from "../../components/fields/Block";
import InputColor from "../../components/ui-inputs/InputColor";
import { DashStyle, DataSource, ShapeFileProps, Symbol } from "../../interfaces";
import { useSymbolStore } from "../../stores";
import { capitalize } from "../../utils/functions";
import { useMapEditor } from "./useMapEditor";
import { EnvironmentOutlined} from "@ant-design/icons";
import SymbolSelect from "../../components/SymbolSelect";

interface PaintPropertyProps {
    property: string;
    dataSource?: DataSource;
    value: any;
    onChange: (val: any) => void;
}
const getPropertyName = (property: string) => {
    let parts = property.split('-').map((p, index) => {
        if (index === 0)
            return p;
        return capitalize(p);
    });

    const name = parts.join('');
    return name;
}

interface PropertyInputProps {
    property: string, 
    dataSource: DataSource | undefined,
    value:any,
    onChange : (value:string) =>void
}
const PropertyInput : React.FC<PropertyInputProps> = ({property,
    dataSource,
    ...props
}) => {
    const [value,setValue] = useState(props.value);
    
    useEffect(()=>{
        setValue(props.value);
    },[props.value])
    
    const onChange = useCallback((value:any)=>{
        setValue(value);

        props.onChange(value);
    },[props.onChange])

    if (property.indexOf('symbol-image') !== -1) {
       return <SymbolSelect value={value} onChange={onChange} />
    } else if (property.indexOf('symbol-scale') !== -1) {
        return <InputNumber min={1} max={5}
            value={value || 1}
            onChange={onChange} />
    } else if (property.indexOf('theme-value-min') !== -1) {
        return <InputNumber min={0}
            value={value || 0}
            onChange={onChange} />
    } else if (property.indexOf('theme-value-max') !== -1) {
        return <InputNumber min={1}
            value={value || 100}
            onChange={onChange} />
    } else if (property.indexOf('column') !== -1) {
        let columns: string[] = [];
        if (dataSource && dataSource.properties && dataSource.properties[ShapeFileProps.COLUMNS]) {
            const dataTypeColumns = dataSource.properties[ShapeFileProps.COLUMNS];
            try {
                columns = dataTypeColumns.map((o: any) => o.Name);
            } catch { }
        }
        if (columns.length == 0) {
            return <Input name={property}
                value={value}
                onChange={(e) => onChange(e.target.value)} />
        }
        return <Select value={value}
            style={{ width: '100%' }}
            onChange={onChange}>
            {columns.map((col) => {
                return <Select.Option key={col} value={col}  >
                    {col}
                </Select.Option>
            })}
        </Select>;

    } else if (property.indexOf('font') !== -1) {
        return <Input name={property}
            value={value || 'Arial'}
            onChange={(e) => onChange(e.target.value)} />
    } else if (property.indexOf('color') !== -1) {
        return <InputColor name={property}
            value={value || '#000000'}
            onChange={onChange} />
    } else if (property.indexOf('width') !== -1) {
        return <InputNumber min={1} max={10}
            value={value || 1}
            onChange={onChange} />
    } else if (property.indexOf('size') !== -1) {
        return <InputNumber min={10} max={64}
            value={value || 10}
            onChange={onChange} />
    } else if (property.indexOf('enabled') !== -1) {
        return <Switch checked={value || false} onChange={onChange} />;
    } else if (property.indexOf('style') !== -1) {
        const styles = Object.keys(DashStyle).filter(key => isNaN(Number(DashStyle[key as any])));
        return <Select value={value || `${DashStyle.solid}`}
            style={{ width: '100%' }}
            onChange={onChange}>
            {styles.map((style) => {
                return <Select.Option key={style} value={style}  >
                    {DashStyle[style as any]}
                </Select.Option>
            })}
        </Select>;
    }

    return <>{property}</>;
}

const InternalPaintProperty: React.FC<PaintPropertyProps> = ({ property, value, dataSource, onChange }) => {
    const name = getPropertyName(property);


    const handleChange = useCallback((val: any) => {
        console.log('PaintProperty-' + property, val);
        onChange(val);
    },[onChange]);

    const properyInput = useMemo(()=>{
        return  <PropertyInput property={property} value={value}
            dataSource={dataSource} 
            onChange={handleChange} 
        />;
    },[property, value, dataSource,  handleChange])
    return <>
        <Block label={name}>
           {properyInput}
        </Block>
    </>
}
const PaintProperty = React.memo(InternalPaintProperty);

export default PaintProperty;