import React from 'react'
import  sampleImgUrl from '../../assets/images/call/bg_sample.png';
const NewsItem = () => {
  return (
    <div className='news-item'>
        <div className='news-item-image'>
            <img src={sampleImgUrl} />
        </div>
        <div className='news-item-body'>
            <div className='news-item-title'>
                <h4  >
                    <a href="/news/1/abc" >NET Conf 2021 Recap – Videos, Slides, Demos, and More</a>
                </h4>
            </div>
            <div className='news-item-date'>
                December 2, 2021
            </div>
            <div className='news-item-user'>
                James Montemagno
            </div>
            <div className='news-item-description'>
                NET Conf 2021 is over, but you can re-live the largest .NET event of the year with full access to video recordings, slides, demos, and more.
            </div>

        </div>

    </div>
  )
}

export default NewsItem