import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input, Select } from 'antd';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { newsApi } from '../../../apis/newsApi';
import NoPermission from '../../../components/auth/NoPermission';
import { NewsProvider, useNewsDispatch, useNewsSelector, useNewsStore } from '../../../context/news/newsContext';
import { getNewsList, newsActions } from '../../../context/news/newsStore';
import { IAppStore } from '../../../store';
import '../../../styles/pages/admin-news/news-page.scss';
import NewsCreateForm from './NewsCreateForm';
import NewsList from './NewsList';
import NewsUpdateForm from './NewsUpdateForm';
const { Option } = Select;
const AdminNewsPageInternal = () => {
  const dispatch = useNewsDispatch();
  const { view, filters } = useNewsSelector(o => o);
  useEffect(() => {
    dispatch(newsActions.setView('main'));
  }, []);

  useEffect(() => {
    if (view !== 'main') return;

    const fecthData = async () => {
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 10;
      const countResponse = await newsApi.count(filters?.textSearch || '', filters?.publishState || 0);
      const listResponse = await newsApi.list(filters?.textSearch || '',
        filters?.publishState || 0,
        {
          offset: (page - 1) * pageSize,
          pageSize: pageSize
        }
      );
      if (countResponse.isSuccess) {
        dispatch(newsActions.setNewsCount(countResponse.data))
      }
      if (listResponse.isSuccess) {
        dispatch(newsActions.setNewsList(listResponse.data))
      }
    }

    fecthData();
  }, [view, filters])

  return <div className='admin-news-page'>
    {view === 'main' &&
      <>
        <div className='admin-news-page__head'>
          <div className="admin-news-page__head--left">
            <span className="page-title">Tin tức</span>
            <span className="page-subtitle">
              Quản lý tin tức
            </span>
          </div>
          <div className="flex-spacer"></div>
          <div className="admin-news-page__head--right">
            <button onClick={() => {
              dispatch(newsActions.setView('new'))
            }}
              className="button button-primary button--icon-label add-btn"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span className="button-label"> Thêm mới </span>
            </button>
          </div>
        </div>

        <div className='admin-news-page__filter'>
          <div className="input-label-group">
            <Input.Search
              placeholder="Tìm kiếm"
              allowClear
              onSearch={(value) => {
                const newFilter= {
                  ...filters,
                  textSearch: value
                };
                dispatch(newsActions.setFilter(newFilter))
              }}
              enterButton
            />
          </div>
          <div style={{marginLeft:'10px'}}>
            <Select defaultValue={0} style={{ width: 120 }} onChange={(value) => {
              const newFilter= {
                ...filters,
                publishState: value as any
              };
              dispatch(newsActions.setFilter(newFilter))
            }}>
              <Option value={0}>Tất cả</Option> 
              <Option value={1}>Đã đăng</Option>
              <Option value={2}>Chưa đăng</Option>
            </Select>
          </div>


        </div>

        <div className='admin-news-page__body'>
          <NewsList />
        </div>
      </>
    }
    {view === 'new' &&
      <NewsCreateForm />
    }
    {view === 'update' &&
      <NewsUpdateForm />
    }
  </div>
}

const AdminNewsPage = () => {
  const user = useSelector((store: IAppStore) => store.auth.user);
  const systemUserRole = user?.profile.role;
  if(systemUserRole !== 'admin' && systemUserRole !== 'manager' ){
      return <NoPermission/>
  }

  return <NewsProvider>
    <AdminNewsPageInternal />
  </NewsProvider>

}

export default AdminNewsPage