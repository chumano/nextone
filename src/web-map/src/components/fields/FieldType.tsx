import { Input } from 'antd'
import React from 'react'

import Block from './Block'

const FieldType: React.FC<any> = (props) => {

  return <Block label={"Type"}>
    <Input
      disabled={true}
      value={props.value}
      onChange={props.onChange}
    />
  </Block>

}
export default FieldType 