import { Modal } from 'antd'
import React from 'react'
import { EventInfo } from '../../models/event/Event.model'

export const ModalEvent = () => {
  return (
    <div>ModalEvent</div>
  )
}


export const showModalEvent = (evt: EventInfo)=>{
    Modal.info({
        title: 'Thông tin sự kiện - ' + evt.eventType.name,
        width: '800px',
        content : <ModalEvent />
    })
}