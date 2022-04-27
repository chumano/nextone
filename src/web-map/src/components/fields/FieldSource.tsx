import { Input, Select } from 'antd'
import React from 'react'

import Block from './Block'

const FieldSource: React.FC<any> = (props) => {

  return <Block label={"Source"}>
    <Select placeholder="Source" value={props.value} style={{'width':'100%'}}
      onChange={props.onChange}>
      <Select.Option value="source1">source 1</Select.Option>
      <Select.Option value="source2">source 2</Select.Option>
    </Select>
  </Block>

}
export default FieldSource 