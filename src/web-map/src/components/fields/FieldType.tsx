import { Input } from 'antd'
import React from 'react'
import { GeoTypeNames } from '../../interfaces';

import Block from './Block'

const FieldType: React.FC<any> = (props) => {

  const geoType = props.value;
  const geoTypeName = GeoTypeNames[geoType] || geoType;
  return <Block label={"Loại dữ liệu"}>
    <Input
      disabled={true}
      value={geoTypeName}
      // onChange={props.onChange}
    />
  </Block>

}
export default FieldType 