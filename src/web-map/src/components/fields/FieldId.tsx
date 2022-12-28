import { Input } from 'antd'
import React, { ChangeEvent, useEffect, useState } from 'react'

import Block from './Block'

const FieldId: React.FC<any> = (props) => {
  const [value, setValue] = useState(props.value);
  useEffect(()=>{
    setValue(props.value);
  },[props.value])

  const onChange = (e: ChangeEvent<any>) => {
    const value = e.target.value;
    setValue(value);
    props.onChange(value);
  };
  
  return <Block label={"Tên"}>
    <Input
      value={value}
      onChange={onChange}
    />
  </Block>

}
export default FieldId 