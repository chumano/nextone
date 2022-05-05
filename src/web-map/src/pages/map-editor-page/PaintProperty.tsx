import { Input, InputNumber, Select, Switch } from "antd";
import React from "react";
import Block from "../../components/fields/Block";
import InputColor from "../../components/ui-inputs/InputColor";
import { DashStyle } from "../../interfaces";
import { capitalize } from "../../utils/functions";

interface PaintPropertyProps {
    property: string;
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

const renderPropertyInput = (property: string, value: any, onChange: (val: any) => void) => {

    if (property.indexOf('symbol-image') !== -1) {
        const symbols = ['default', 'marker']
        return <Select value={value || symbols[0]}
            style={{ width: '100%' }}
            onChange={onChange}>
            {symbols.map((symbol) => {
                return <Select.Option key={symbol} value={symbol}  >
                    {symbol}
                </Select.Option>
            })}
        </Select>
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
        return <Input name={property}
            value={value}
            onChange={(e) => onChange(e.target.value)} />
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
        return <Switch defaultChecked={value || false} onChange={onChange} />;
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

    return property;
}

const InternalPaintProperty: React.FC<PaintPropertyProps> = ({ property, value, onChange }) => {
    const name = getPropertyName(property);

    const handleChange = (val: any) => {
        console.log('PaintProperty-' + property, val);
        onChange(val);
    }
    return <>
        <Block label={name}>
            {renderPropertyInput(property, value, handleChange)}
        </Block>
    </>
}
const PaintProperty = React.memo(InternalPaintProperty);

export default PaintProperty;