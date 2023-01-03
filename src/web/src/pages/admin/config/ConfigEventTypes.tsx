import { faPencilAlt, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, message, Modal, Table } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { comApi } from '../../../apis/comApi'
import { EventType } from '../../../models/event/EventType.model'
import ModalAddEventType from './ModalAddEventType'
import ModalUpdateEventType from './ModalUpdateEventType'

const ConfigEventTypes = () => {
    const [eventTypes, setEventTypes] = useState<EventType[]>([])
    const [showModalAddEventType, setModalAddEventType] = useState(false);
    const [showModalUpdateEventType, setShowModalUpdateEventType] = useState(false);
    const [selectedEventType, setSelectedEventType] = useState<EventType>()
    const fectchData = useCallback(async () => {
        const response = await comApi.getEventTypes();
        if (!response.isSuccess) {
            message.error(response.errorMessage);
            return;
        }

        setEventTypes(response.data);
    }, [comApi]);

    useEffect(() => {
        fectchData();
    }, [])

    const onDelete = useCallback((eventType: EventType) => {
        Modal.confirm({
            title: `Bạn có muốn xóa "${eventType.name}" không?`,
            onOk: async () => {
                const response = await comApi.deleteEventType(eventType.code);
                const { isSuccess, errorMessage } = response;
                if (!isSuccess) {
                    Modal.error({
                        title: 'Có lỗi!',
                        content: errorMessage
                    });
                    return;
                }

                fectchData();

            },
            onCancel() {
            },
        });
    }, []);

    return (
        <div className='config-event-types'>
            <div className='config-event-types__header'>
                <h5>Danh sách loại sự kiện</h5>
                <div className='flex-spacer'></div>
                <div>
                    <button className="button button-primary button--icon-label add-btn"
                        onClick={() => {
                            setModalAddEventType(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span className="button-label"> Thêm mới </span>
                    </button>
                </div>
            </div>
            <div style={{ marginTop: 20 }}>
                <Table
                    dataSource={eventTypes}
                    bordered
                    rowKey="code"
                    pagination={{
                        position: ['none', 'none'] as any
                    }}
                >
                    <Table.Column
                        title="#"
                        key="index"
                        render={(_, _1, index) => <span>{index + 1}</span>}
                    />
                    <Table.Column
                        title="Mã"
                        dataIndex="code"
                        key="code"
                    ></Table.Column>
                    <Table.Column
                        title="Tên loại sự kiện"
                        dataIndex="name"
                        key="name"
                    ></Table.Column>
                    <Table.Column
                        key="actions"
                        align="right"
                        render={(_, record: EventType) => (
                            <div className="list-button-actions">
                                <Button
                                    type="default"
                                    onClick={() => {
                                        setSelectedEventType(record);
                                        setShowModalUpdateEventType(true);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </Button>
                                <Button
                                    danger
                                    onClick={() => {
                                        onDelete(record)
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>

                            </div>
                        )}
                    ></Table.Column>
                </Table>
            </div>

            {showModalAddEventType && <ModalAddEventType
                onClose={(isUpdate) => {
                    setModalAddEventType(false);
                    if (isUpdate) {
                        fectchData();
                    }
                }} />}

            {showModalUpdateEventType && selectedEventType && <ModalUpdateEventType
                eventType={selectedEventType}
                onClose={(isUpdate) => {
                    setShowModalUpdateEventType(false);
                    if (isUpdate) {
                        fectchData();
                    }
                }} />}
        </div>
    )
}

export default ConfigEventTypes