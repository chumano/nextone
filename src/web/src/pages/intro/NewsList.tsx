import NewsItem from './NewsItem';
import './news-list.scss';
import { Pagination } from 'antd';

const NewsList : React.FC = () => {
    const news = [1, 2, 3, 4, 5, 6];
    return (
        <div className="news">
            <div className='news__header'>
                <h3>Tin tức</h3>
            </div>
            <div className='news__body'>
                <div className='news-list'>
                    {news.map(o => 
                        <NewsItem key={o} />
                    )}
                </div>
                <div className='news-pagination'>
                    <Pagination defaultCurrent={1} total={50} />
                </div>
               
            </div>
        </div>
    )
}

export default NewsList