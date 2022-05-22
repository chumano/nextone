import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../../components/controls/loading/Loading';
import './news-page.scss'
const NewsPage = () => {
    const params = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {

        const newsid = params.id;
        if (newsid) {
            setLoading(false);
        }

    }, [params])
    return <>
        {loading &&
            <Loading />
        }
        {!loading &&
            <div className='news-page'>
                <div className='news_page__title'>
                    <h4>NET Conf 2021 Recap – Videos, Slides, Demos, and More</h4>
                </div>
                <div className='news-page__info'>

                    <div className='news-page-user'>
                        James Montemagno
                    </div>
                    <div className='news-page-date'>
                        December 2, 2021
                    </div>
                </div>

                <div className='news-page__content'>
                    <p>
                        .NET Conf 2021 was the largest .NET Conf ever with over 80 sessions from speakers around the globe! We want to give a huge THANK YOU to all who tuned in live, asked questions in our Twitter feed, and participated in our fun and games. The learning continues with community-run events happening thru the end of January so make sure to check those out. Also, watch the session replays and keep an eye on our conference GitHub repo where we are collecting all the slides and demos from our presenters.

                    </p>

                    <p>
                        If you participated in .NET Conf 2021, please give us your feedback about the event so we can improve in 2022.

                    </p>

                    <h6>
                        On-Demand Recordings</h6>
                    <p>
                        We had a lot of awesome sessions from various teams and community experts that showed us all sorts of cool things we can build with .NET across platforms and devices. You can watch all of the sessions right now on the .NET YouTube or the new Microsoft Docs events hub.
                    </p>

                    <p>
                        What were your favorite sessions? Leave them in the comments below! I have so many favorites, but I loved the Productivity talk around Roslyn and AI with Mika:
                    </p>

                </div>

            </div>
        }
    </>
}

export default NewsPage