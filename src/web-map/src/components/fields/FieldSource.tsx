import { Input, Select } from 'antd'
import React from 'react'

import Block from './Block'

interface FieldSourceProps {
  value: string;
  sources: {key:string, name:string}[]
  disabled?:boolean;
  onChange: (key:string) => void
}
const FieldSource: React.FC<FieldSourceProps> = (props) => {

  return <Block label={"Source"}>
    <Select placeholder="Source" value={props.value} style={{'width':'100%'}}
      disabled={props.disabled}
      onChange={props.onChange}>
        {props.sources.map(o=>
          <Select.Option  key={o.key} value={o.key}>{o.name}</Select.Option>
        )}
     
    </Select>
  </Block>

}
export default FieldSource 