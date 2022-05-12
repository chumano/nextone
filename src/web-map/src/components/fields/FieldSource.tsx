import { Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDatasourceApi } from '../../apis';
import { DataSource } from '../../interfaces';
import { handleAxiosApi } from '../../utils/functions';

import Block from './Block'

interface FieldSourceProps {
  value: string;
  name: string;
  sources: { key: string, name: string }[]
  disabled?: boolean;
  onChange: (key: string) => void
}
const FieldSource: React.FC<FieldSourceProps> = (props) => {
  const api = useDatasourceApi();
  const [option, setOption] = useState<any>(
    
  );

  // useEffect(() => {
  //   setOption(<Select.Option key={props.value} value={props.value}>
  //     {props.name}
  //   </Select.Option>)
  // }, [props.name, props.value])


  return <Block label={"Source"}>
    <Select placeholder="" value={props.value} style={{ 'width': '100%' }}
      disabled={props.disabled}
      onChange={props.onChange}>
        {option || <Select.Option key={props.value} value={props.value}>
        {props.name}
      </Select.Option>}

      {/* {props.sources.map(o =>
        <Select.Option key={o.key} value={o.key}>{o.name}</Select.Option>
      )} */}

    </Select>
  </Block>

}
export default FieldSource 