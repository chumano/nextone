import { Select } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { comApi } from '../../apis/comApi';
import { useMapDispatch } from '../../context/map/mapContext'
import { mapActions } from '../../context/map/mapStore';
import { EventType } from '../../models/event/EventType.model';

const MapToolBar = () => {
  const dispatch = useMapDispatch();
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<string>('all')

  useEffect(() => {
    const fetcheEventTypes = async () => {
      const response = await comApi.getEventTypesForMe();
      if (response.isSuccess) {
        const eventTypes = response.data;
        const selectedEventTypes = [...eventTypes.map(o => o.code)];
        setEventTypes(eventTypes);
        dispatch(mapActions.updateSelectedEventTypes(selectedEventTypes))
      }
    }

    fetcheEventTypes();
  }, [])

  useEffect(() => {
    let selectedEventTypes = [];
    if (selectedEventType !== 'all') {
      selectedEventTypes.push(selectedEventType);
    } else {
      selectedEventTypes = [...eventTypes.map(o => o.code)];
    }
    if (selectedEventTypes.length > 0) {
      dispatch(mapActions.updateSelectedEventTypes(selectedEventTypes))
    }
  }, [selectedEventType, eventTypes, dispatch, mapActions])

  const onEventTypesChanges = useCallback((value: string) => {
    setSelectedEventType(value);
  }, [])

  return <div className='map-toolbar map-overlay'>
    <div className=' map-overlay__content'>
      <Select style={{ width: 300 }} placeholder='Loại sự kiện'
        value={selectedEventType} onChange={onEventTypesChanges}>
        <Select.Option key='all' value='all'>Tất cả</Select.Option>
        {eventTypes.map(o =>
          <Select.Option key={o.code} value={o.code}>{o.name}</Select.Option>
        )}
      </Select>
    </div>
  </div>
}

export default MapToolBar