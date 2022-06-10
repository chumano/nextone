import React from 'react'
import  sampleImgUrl from '../../assets/images/call/bg_sample.png';
import { News } from '../../models/news/News';
interface NewsItemProps{
    news: News
}
const NewsItem : React.FC<NewsItemProps>= ({news}) => {
  return (
    <div className='news-item'>
        <div className='news-item-image'>
           {news.imageUrl && <img src={news.imageUrl} />}
        </div>

        <div className='news-item-body'>
            <div className='news-item-title'>
                <h4  >
                    <a href={`/news/${news.id}/tin-tuc`} >{news.title}</a>
                </h4>
            </div>
            <div className='news-item-date'>
                {news.publishedDate}
            </div>
            <div className='news-item-user'>
                {news.publishedUserName}
            </div>
            <div className='news-item-description'>
                {news.description}
            </div>

        </div>

    </div>
  )
}

export default NewsItem