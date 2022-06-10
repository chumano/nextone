import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { newsApi } from '../../apis/newsApi';
import Loading from '../../components/controls/loading/Loading';
import { News } from '../../models/news/News';
import './news-page.scss'
const NewsPage = () => {
    const params = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState<News>();
    useEffect(() => {
        const newsid = params.id;
        if (!newsid) {
            setLoading(false);
            return;
        }

        newsApi.getNews(newsid).then(response => {
            setLoading(false);
            if (!response.isSuccess) {
                return;
            }

            setNews(response.data);
        });


    }, [params])
    return <>
        {loading &&
            <Loading />
        }
        {!loading && !news &&
            <div>
                <h4>Không tìn thấy tin tức</h4>
            </div>
        }
        {!loading && news &&
            <div className='news-page'>
                <div className='news_page__title'>
                    <h4>{news.title}</h4>
                </div>
                <div className='news-page__info'>

                    <div className='news-page-user'>
                        {news.publishedUserName}
                    </div>
                    <div className='news-page-date'>
                        {news.publishedDate}
                    </div>
                </div>
                <div className='news-page__image'>
                    {news.imageUrl && <>
                        <div>
                            <img src={news.imageUrl}  style={{width:'100%'}}/>
                        </div>
                        <div style={{fontStyle:'italic', textAlign:'center'}}>
                            {news.imageDescription}
                        </div>
                    </>
                    }
                </div>
                <div className='news-page__content' dangerouslySetInnerHTML={{__html: news.content}}>
                </div>

            </div>
        }
    </>
}

export default NewsPage