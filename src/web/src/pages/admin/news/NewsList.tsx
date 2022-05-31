import React from 'react'
import { useNewsSelector } from '../../../context/news/newsContext';

const NewsList = () => {
  const newList = useNewsSelector(o=>o.newsList);
  console.log({newList});
  return (
    <div>NewsList</div>
  )
}

export default NewsList