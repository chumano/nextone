import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Checkbox, Image, Modal, Table } from 'antd';
import React, { useCallback } from 'react'
import { newsApi } from '../../../apis/newsApi';
import { useNewsDispatch, useNewsSelector } from '../../../context/news/newsContext';
import { newsActions } from '../../../context/news/newsStore';
import { ApiResult } from '../../../models/apis/ApiResult.model';
import { News } from '../../../models/news/News';

const NewsList = () => {
  const dispatch = useNewsDispatch();
  const { newsList, count } = useNewsSelector(o => o);
  const onPaginationChange = (page: number, pageSize: number) => {
    dispatch(newsActions.setPagination({
      page,
      pageSize
    }))
  };

  const publishNews = async (id: string, isPublished: boolean) => {
    let response: ApiResult<null>;
    if (isPublished) {
      response = await newsApi.publishNews(id);
    } else {
      response = await newsApi.unpublishNews(id);
    }
    const { isSuccess, errorMessage } = response;
    if (!isSuccess) {
      Modal.error({
        title: 'Có lỗi bất thường xảy ra!',
        content: errorMessage
      });
      return;
    }

    dispatch(newsActions.setPublished({ id, isPublished }));

  };

  const onDelete = useCallback((news:News)=>{
    Modal.confirm({
        title: `Bạn có muốn xóa "${news.title}" không?`,
        onOk: async() => {
           const response = await newsApi.deleteNews(news.id);
           const { isSuccess, errorMessage } = response;
           if (!isSuccess) {
             Modal.error({
               title: 'Có lỗi bất thường xảy ra!',
               content: errorMessage
             });
             return;
           }

           dispatch(newsActions.deleteNews(news.id));

        },
        onCancel() {
        },
    });
  },[dispatch]);

  return (
    <div>	<Table
      className="user-list-table-container"
      dataSource={newsList}
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
        title="Tiêu đề"
        dataIndex="title"
        key="title"
      ></Table.Column>
       <Table.Column
        align="center"
        title="Hình ảnh"
        key="imageUrl"
        render={(_, value, _1) => {
          const { id, imageUrl } = value as News;
          return <>
            { imageUrl &&
              <Image width={200} src={imageUrl} /> 
            }
          </>
        }}
      ></Table.Column>
      <Table.Column
        align="center"
        title="Hiển thị bài?"
        dataIndex="isActive"
        key="isActive"
        render={(_, value, _1) => {
          const { id, isPublished } = value as News;
          return (
            <Checkbox
              checked={isPublished}
              onChange={(e) =>
                publishNews(id, e.target.checked)
              }
            />
          );
        }}
      ></Table.Column>
      <Table.Column
        title="Ngày đăng"
        dataIndex="publishedDate"
        key="publishedDate"
      ></Table.Column>
      <Table.Column
        title="Người đăng"
        dataIndex="publishedUserName"
        key="publishedUserName"
      ></Table.Column>
      <Table.Column
        key="actions"
        align="right"
        render={(_, record: News) => (
          <div className="list-button-actions">
            <Button
              type="default"
              onClick={() => {
                dispatch(newsActions.viewNews(record.id));
                dispatch(newsActions.setView('update'))
              }}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </Button>
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

export default NewsList