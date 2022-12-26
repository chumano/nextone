import { Input } from 'antd';
import React, { useEffect } from 'react'
import { userApi } from '../../../apis/userApi';
import { userActivityActions, UserActivityContextProvider, useUserActivityDispatch, useUserActivitySelector } from './userActivityContext';
import UserActivityList from './UserActivityList';

const UserActivityPageInternal = () => {
  const dispatch = useUserActivityDispatch();
  const { filters } = useUserActivitySelector(o => o);
  useEffect(() => {

    const fecthData = async () => {
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 10;
      const countResponse = await userApi.countUserActivities(filters?.textSearch || '');
      const listResponse = await userApi.getUserActivities(filters?.textSearch || '',
        {
          offset: (page - 1) * pageSize,
          pageSize: pageSize
        }
      );
      if (countResponse.isSuccess) {
        dispatch(userActivityActions.setUserActivityCount(countResponse.data))
      }
      if (listResponse.isSuccess) {
        dispatch(userActivityActions.setUserActivityList(listResponse.data))
      }
    }

    fecthData();
  }, [filters])

  return (
    <div className='user-activity-page'>
      <div className='user-activity-page__head'>
        <div>
          <h5 >Hoat động người dùng</h5>
        </div>
      </div>
      <div className='user-activity-page__filter'>
        <div className="input-label-group" style={{width:'300px'}}>
          <Input.Search
            placeholder="Tìm kiếm"
            allowClear
            onSearch={(value) => {
              const newFilter = {
                ...filters,
                textSearch: value
              };
              dispatch(userActivityActions.setFilter(newFilter))
            }}
            enterButton
          />
        </div>
      </div>
      <div className='user-activity-page__body'>
        <UserActivityList />
      </div>
    </div>
  )
}

const UserActivityPage = () => {
  return <UserActivityContextProvider>
    <UserActivityPageInternal />
  </UserActivityContextProvider>
}
export default UserActivityPage