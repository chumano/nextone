import { Input } from 'antd'
import React from 'react'

import Block from './Block'

const FieldComment: React.FC<any> = (props) => {
  const fieldSpec = {
    doc: "Comments for the current layer."
  };
  return <Block label={"Comment"} fieldSpec={fieldSpec}
      style={{alignItems:'flex-start'}}>
    <Input.TextArea
      value={props.value}
      onChange={props.onChange}
      placeholder={'Comment..'}
      showCount maxLength={200} style={{ height: 80 }}
    />
  </Block>

}
export default FieldComment 