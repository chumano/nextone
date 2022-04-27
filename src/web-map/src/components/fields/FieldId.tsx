import { Input } from 'antd'
import React from 'react'

import Block from './Block'

const FieldId: React.FC<any> = (props) => {

  return <Block label={"ID"}>
    <Input
      value={props.value}
      onInput={props.onChange}
    />
  </Block>

}
export default FieldId 