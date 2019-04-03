import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './style.less'
import { actionCreators } from './store'

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

class Topic extends Component {
  static async getInitialProps({ store, req, res }) {
    if (req && res) {
      const { id } = req.params;
      // 判断id是否存在，不存在则跳转到首页
      if (!id || id === '') res.redirect('/');
      const topic = await store.dispatch(actionCreators.getTopic(id));
      if (!topic.success) res.redirect('/');
      // 设置标题
      return { title: topic.data.title }
    }
    return { }
  }

  render() {
    const { topic } = this.props;
    return (
      <div className={`${style.topicContainer} flex`}>
        <div className={`${style.content} flex-item`}>
          <div className={style.topicHeader}>
            <div className={style.topicTitle}>
              {getType(topic.data)}
              {topic.data.title}
            </div>
            <div className={style.topicTitleBottom}>
              <span className={style.word}>{topic.data.create_at}</span>
              <span className={style.author}>{`作者 ${topic.data.author.loginname}`}</span>
              <span className={style.author}>{`${topic.data.visit_count} 浏览`}</span>
            </div>
          </div>
          {/* eslint-disable react/no-danger */}
          <div
            className={style.topicContent}
            dangerouslySetInnerHTML={{ __html: topic.data.content }}
          />
        </div>
        <div className={style.sideBar}>
          <div className={style.sideBarTitle}>作者</div>
          <div className={style.authorInfo}>
            <div className="flex flex-align-center">
              <img className={style.avatar} src={topic.data.author.avatar_url} alt="" />
              <span className={style.name}>{topic.data.author.loginname}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


const mapState = (state) => {
  return {
    topic: state.topic.topic,
  }
}

const mapDispatch = () => {
  return {
  }
}

export default connect(mapState, mapDispatch)(Topic)
