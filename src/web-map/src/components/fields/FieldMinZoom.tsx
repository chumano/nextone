import { Col, Input, InputNumber, Row, Slider } from 'antd'
import React, { useEffect, useState } from 'react'

import Block from './Block'

const FieldMixZoom: React.FC<any> = (props) => {
  const [value, setValue] = useState(props.value);
  
  useEffect(()=>{
    setValue(props.value);
  },[props.value])
  
  const onChange = (value: any) => {
    setValue(value);
    props.onChange(value);
  };

  return <Block label={"MinZoom"}>
    <div className='input-slider'>
      <Slider
        min={1}
        max={20}
        step={1}
        style={{flexGrow:1}}
        onChange={onChange}
        value={typeof value === 'number' ? value : 0}
        
      />
      <InputNumber
        min={1}
        max={20}
        style={{width:'50px',marginLeft: '5px'}}
        value={value}
        onChange={onChange}
      />
    </div>

  </Block>

}
export default FieldMixZoom 