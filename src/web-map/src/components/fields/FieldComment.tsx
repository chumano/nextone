import { Input } from 'antd'
import React, { ChangeEvent, useEffect, useState } from 'react'

import Block from './Block'

const FieldComment: React.FC<any> = (props) => {
  const [value, setValue] = useState(props.value);
  useEffect(()=>{
    setValue(props.value);
  },[props.value])

  const onChange = (e: ChangeEvent<any>) => {
    const value = e.target.value;
    setValue(value);
    props.onChange(value);
  };

  const fieldSpec = {
    doc: "Comments for the current layer."
  };
  return <Block label={"Ghi chú"} fieldSpec={undefined}
      style={{alignItems:'flex-start'}}>
    <Input.TextArea
      value={value}
      onChange={onChange}
      placeholder={''}
      showCount maxLength={200} style={{ height: 80 }}
    />
  </Block>

}
export default FieldComment 