import { Input } from 'antd'
import React from 'react'

import Block from './Block'

const FieldId: React.FC<any> = (props) => {

  return <Block label={"Name"}>
    <Input
      value={props.value}
      onChange={props.onChange}
    />
  </Block>

}
export default FieldId 