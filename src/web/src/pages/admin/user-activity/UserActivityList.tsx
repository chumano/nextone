import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal, Table } from 'antd';
import React, { useCallback } from 'react'
import { userApi } from '../../../apis/userApi';
import { UserActivity, userActivityActions, useUserActivityDispatch, useUserActivitySelector } from './userActivityContext';

const UserActivityList = () => {
    const dispatch = useUserActivityDispatch();
    const { userActivityList, count } = useUserActivitySelector(o => o);
    const onPaginationChange = (page: number, pageSize: number) => {
      dispatch(userActivityActions.setPagination({
        page,
        pageSize
      }))
    };
  
  
    const onDelete = useCallback((item:UserActivity)=>{
      Modal.confirm({
          title: `Bạn có muốn xóa hoạt động "${item.action}" của "${item.userName}" không?`,
          onOk: async() => {
             const response = await userApi.deleteUserActivity(item.id);
             const { isSuccess, errorMessage } = response;
             if (!isSuccess) {
               Modal.error({
                 title: 'Có lỗi bất thường xảy ra!',
                 content: errorMessage
               });
               return;
             }
  
             dispatch(userActivityActions.deleteUserActivity(item.id));
  
          },
          onCancel() {
          },
      });
    },[dispatch]);
  
    return (
      <div>	<Table
        dataSource={userActivityList}
        bordered
        rowKey="id"
        pagination={{
          total: count,
          pageSize: 10,
          onChange: onPaginationChange,
        }}
      >
        <Table.Column
          title="#"
          key="index"
          render={(_, _1, index) => <span>{index + 1}</span>}
        />
        <Table.Column
          title="Người dùng"
          dataIndex="userName"
          key="userName"
        ></Table.Column>
        
        <Table.Column
          title="Hoạt động"
          dataIndex="action"
          key="action"
        ></Table.Column>

        <Table.Column
          title="Thời gian"
          dataIndex="createdDate"
          key="createdDate"
        ></Table.Column>
      
        <Table.Column
          key="actions"
          align="right"
          render={(_, record: UserActivity) => (
            <div className="list-button-actions">
             
              <Button
                danger
                onClick={() => {
                  onDelete(record);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
  
            </div>
          )}
        ></Table.Column>
      </Table>
      </div>
    )
}

export default UserActivityList