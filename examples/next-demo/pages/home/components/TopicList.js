import React, { Fragment } from 'react'
import Link from 'next/link'
import style from '../style.less'

const getType = (item) => {
  let text = ''
  let classname = style.topiclistTab
  if (item.top) {
    text = '置顶'
    classname = style.putTop
  } else if (item.tab === 'share') {
    text = '分享'
  } else if (item.tab === 'ask') {
    text = '问答'
  }
  if (item.good) {
    text = '精选'
    classname = style.putTop
  }
  return <span className={classname}>{text}</span>
}

const TopicList = ({ homeData }) => {
  return (
    <Fragment>
      {
        homeData.data.map((item) => {
          return (
            <div className={`${style.topicItem} flex flex-align-center`} key={item.id}>
              <a className={style.avatar}>
                <img src={item.author.avatar_url} alt="" />
              </a>
              <span className={style.replayCount}>
                <span className={style.countReplies}>{item.reply_count}</span>
                <span className={style.countSeperator}>/</span>
                <span className={style.countVisit}>{item.visit_count}</span>
              </span>
              {getType(item)}
              <Link href={`/topic/${item.id}`}>
                <a className={`${style.topicTitle} flex-item`}>{item.title}</a>
              </Link>
            </div>
          )
        })
      }
    </Fragment>
  )
}

export default TopicList
