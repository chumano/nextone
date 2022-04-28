import { Input, Select } from 'antd'
import React from 'react'

import Block from './Block'

interface FieldSourceProps {
  value: string;
  sources: {key:string, name:string}[]
  onChange: (key:string) => void
}
const FieldSource: React.FC<FieldSourceProps> = (props) => {

  return <Block label={"Source"}>
    <Select placeholder="Source" value={props.value} style={{'width':'100%'}}
      onChange={props.onChange}>
        <Select.Option value="source">source </Select.Option>
        {props.sources.map(o=>
          <Select.Option  key={o.key} value={o.key}>{o.name}</Select.Option>
        )}
     
    </Select>
  </Block>

}
export default FieldSource 