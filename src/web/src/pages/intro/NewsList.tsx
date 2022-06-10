import NewsItem from './NewsItem';
import './news-list.scss';
import { Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { newsApi } from '../../apis/newsApi';
import { News } from '../../models/news/News';

const NewsList : React.FC = () => {
    const [news,setNews] = useState<News[]>([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    useEffect(()=>{
        const fecthData = async () => {
            const pageSize = 5;
            const countResponse = await newsApi.publiccount( '');
            const listResponse = await newsApi.publiclist('', 0,
              {
                offset: (page - 1) * pageSize,
                pageSize: pageSize
              }
            );
            if (countResponse.isSuccess) {
                setCount(countResponse.data)
            }
            if (listResponse.isSuccess) {
                setNews(listResponse.data)
            }
          }
      
          fecthData();
    },[page])
    return (
        <div className="news">
            <div className='news__header'>
                <h3>Tin tức</h3>
            </div>
            <div className='news__body'>
                <div className='news-list'>
                    {news.map(o => 
                        <NewsItem key={o.id} news={o}/>
                    )}
                </div>
                <div className='news-pagination'>
                    <Pagination defaultCurrent={1} total={count} pageSize={5} onChange={(page,pageSize)=>{
                        setPage(page)
                    }}/>
                </div>
               
            </div>
        </div>
    )
}

export default NewsList