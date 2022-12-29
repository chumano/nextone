import { Avatar, Select, Spin } from "antd"
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDatasourceApi } from "../apis";
import { DataSource, GeoType, GeoTypeNames } from "../interfaces";
import { handleAxiosApi } from "../utils/functions";
import debounce from 'lodash/debounce';

interface DataSourceSelectProps {
    datasources: DataSource[];
    value?: string;
    onChange?: (value: any) => void;
}

const renderDataSourceOption = (o:DataSource) =>{
    const geoType = GeoType[o.geoType];
    const geoTypeName = GeoTypeNames[geoType] || geoType;
    return <Select.Option key={o.id} value={o.id} label={o.name} data-geotype={o.geoType}>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: "center"
        }}>
            <Avatar src={o.imageUrl} shape="square" size={'small'} />
            <span style={{ marginLeft: '5px' }}>{o.name} </span>
            <div className="flex-spacer"></div>
            <span>{geoTypeName}</span>
        </div>
    </Select.Option>
}
const DataSourceSelect: React.FC<DataSourceSelectProps> = ({ datasources, value, onChange }) => {
    const api = useDatasourceApi();
    const [state, setState] = useState({
        loading: false,
        value: value,
        children: [] as any[]
    })

    useEffect(()=>{
        setState((state)=>{
            return {
                ...state,
                loading: false,
                children: datasources?.map(o=>renderDataSourceOption(o))
            }
        })
    },[datasources])

    const fetchData = useCallback(async () => {
        const reponse = api.list({
            offset: state.children.length
        });
        const nextDataSources = await handleAxiosApi<DataSource[]>(reponse); 
        const newChildren = nextDataSources?.map(o=>renderDataSourceOption(o));
        const children = [...state.children, ...newChildren];
        setState((state)=>{
            return {
                ...state,
                loading: false,
                children: children
            }
        })
            
    },[api, state.children])

    const fetchGood = useMemo(()=>{
        return debounce(fetchData, 500);
    },[fetchData])

    const onScroll = useCallback((event: any) => {
        var target = event.target
        if (!state.loading && target.scrollTop + target.offsetHeight === target.scrollHeight) {
            console.log("load")
            setState((state) => {
                return {
                    ...state,
                    loading: true
                }
            });
            target.scrollTo(0, target.scrollHeight)
            fetchGood();
        }
    },[fetchGood, state.loading]);

    const myOnChange = (value:string, option:any)=>{
        console.log('DataSourceSelect', option)
        setState((state) => {
            return {
                ...state,
                value: value
            }
        });
        onChange && onChange({
            id: option.key,
            name: option.label,
            geoType: option['data-geotype']
        })
    }

    return <Select placeholder="" optionLabelProp="label"
        value={state.value} onChange={myOnChange}
        onPopupScroll={onScroll}>
            
        {!state.loading ? 
            state.children : 
            [...state.children, <Select.Option key="loading">Loading...</Select.Option>]
        }
    </Select>
}

export default DataSourceSelect;