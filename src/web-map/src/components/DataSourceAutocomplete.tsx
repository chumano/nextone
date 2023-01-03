import { AutoComplete, Avatar, Select, Spin } from "antd"
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDatasourceApi } from "../apis";
import { DataSource, GeoType, GeoTypeNames } from "../interfaces";
import { handleAxiosApi } from "../utils/functions";
import debounce from 'lodash/debounce';

interface DataSourceAutocompleteProps {
    datasources: DataSource[];
    value?: string;
    onChange?: (value: any) => void;
}

const renderDataSourceOption = (o: DataSource) => {
    const geoType = GeoType[o.geoType];
    const geoTypeName = GeoTypeNames[geoType] || geoType;
    return <AutoComplete.Option key={o.id} value={o.name} label={o.name} 
        data-geotype={o.geoType} >
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
    </AutoComplete.Option>
}
const DataSourceAutocomplete: React.FC<DataSourceAutocompleteProps> = ({ datasources, value, onChange }) => {
    const api = useDatasourceApi();
    const [state, setState] = useState({
        loading: false,
        value: value,
        children: [] as any[],
        datasources: datasources
    })

    useEffect(() => {
        setState((state) => {
            return {
                ...state,
                loading: false,
                children: datasources?.map(o => renderDataSourceOption(o)),
                datasources : datasources
            }
        });
    }, [datasources, value])

    const fetchData = useCallback(async (textSearch: string) => {
        console.log("fetchData...: ", textSearch)
        const reponse = api.list({
            textSearch: textSearch,
            offset: 0,
            pageSize: 5
        });
        const nextDataSources = await handleAxiosApi<DataSource[]>(reponse);
        const newChildren = nextDataSources?.map(o => renderDataSourceOption(o));
        const children = [...newChildren];
        setState((state) => {
            return {
                ...state,
                loading: false,
                children: children,
                datasources: nextDataSources
            }
        })

    }, [api, state.children])

    const fetchGood = useMemo(() => {
        return debounce(fetchData, 500);
    }, [fetchData])

    const onSearch = useCallback((value: string) => {
        console.log("onSearch...: ", value)
        if(!state.loading){
            setState((state) => {
                return {
                    ...state,
                    loading: true
                }
            });
        }
        fetchGood(value);
    }, [fetchGood, state.loading]);

    const onSelect = (value: string, option: any) => {
        console.log("DataSourceAutocomplete-onSelect", value, option)
        onChange && onChange({
            id: option.key,
            name: option.label,
            geoType: option['data-geotype'],
            dataSource: state.datasources.find(o=>o.id == option.key)
        })
    }

    return <AutoComplete
        onSelect={onSelect}
        onSearch={onSearch}
        placeholder=""
    >
        {!state.loading ?
            state.children :
            [<AutoComplete.Option key="loading">Loading...</AutoComplete.Option>]
        }
    </AutoComplete>
}

export default DataSourceAutocomplete;