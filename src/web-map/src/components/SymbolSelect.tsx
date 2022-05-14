import { Avatar, Button, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useMapEditor } from "../pages/map-editor-page/useMapEditor";
import { useSymbolStore } from "../stores";
import {EnvironmentOutlined} from '@ant-design/icons';

interface SymbolSelectProps{
    value:any,
    onChange : (value:string) =>void
}
const SymbolSelect : React.FC<SymbolSelectProps> = (props)=>{
    const mapEditor = useMapEditor();
    const { symbolState:{symbols}} = useSymbolStore();
    //const [symbols,_]  = useState<any[]>([])
    const openModalSymbol = useCallback(()=>{
        mapEditor.showModal('symbol', true);
    },[])
    
    
    const [value,setValue] = useState(props.value);
    
    useEffect(()=>{
        setValue(props.value);
    },[props.value])

    const onChange = useCallback((value:any)=>{
        setValue(value);

        props.onChange(value);
    },[props.onChange])

    
    const [defaultValue, setDefaultValue] = useState<string>();
    useEffect(()=>{
        const fisrt = symbols.find(o=>true);
        setDefaultValue(fisrt?.name);
        props.onChange(fisrt?.name as string);
    },[symbols])

    return <>
        <Select  value={value}
            style={{ width: '100%' }}
            onChange={onChange}>
            {symbols.map((symbol) => {
                return <Select.Option key={symbol.name} value={symbol.name}  >
                    <Avatar src={symbol.imageUrl} shape="square"  size={'small'}/>
                    {symbol.name}
                </Select.Option>
            })}
        </Select>
        <Button type="default" title="Tải icon" style={{marginTop: "5px"}}
                onClick={openModalSymbol}>
                <EnvironmentOutlined />
        </Button>
    </>
}

export default SymbolSelect