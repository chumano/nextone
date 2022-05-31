import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { NewsProvider, useNewsDispatch, useNewsSelector, useNewsStore } from '../../../context/news/newsContext';
import { getNewsList, newsActions } from '../../../context/news/newsStore';
import '../../../styles/pages/admin-news/news-page.scss';
import NewsCreateForm from './NewsCreateForm';
import NewsList from './NewsList';
import NewsUpdateForm from './NewsUpdateForm';

const AdminNewsPageInternal = () => {
  const dispatch = useNewsDispatch();
  const { view } = useNewsSelector(o => o);
  const [filters, setFilters] = useState({})
  useEffect(() => {
    dispatch(newsActions.setNewsList(['123', '999']))
  }, [])

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

        </div>

        <div className='admin-news-page__body'>
          <NewsList />
        </div>
      </>
    }
    {view==='new' &&
      <NewsCreateForm/>
    }
    {view==='update' &&
      <NewsUpdateForm/>
    }
  </div>
}

const AdminNewsPage = () => {
  return <NewsProvider>
    <AdminNewsPageInternal />
  </NewsProvider>

}

export default AdminNewsPage