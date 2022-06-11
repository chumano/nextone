import { Select } from 'antd'
import React from 'react'

const MapToolBar = () => {
  return <div className='map-toolbar map-overlay'>
  <div className=' map-overlay__content'>
      <Select style={{ width: 300 }} placeholder='Loại sự kiện'
          value='all'>
          <Select.Option key='all' value='all'>Tất cả</Select.Option>
      </Select>
  </div>
</div>
}

export default MapToolBar