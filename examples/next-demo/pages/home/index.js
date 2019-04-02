import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './style.less'
import { actionCreators } from './store'
import TopicList from './components/TopicList'

class Home extends Component {
  static async getInitialProps({ store }) {
    await store.dispatch(actionCreators.getHomeData());
    return { }
  }

  render() {
    const { homeData } = this.props
    return (
      <div className={`${style.main} flex`}>
        <div className={`${style.content} flex-item`}>
          <div className={style.contentHeader}>
            <a className={`${style.topicTab} ${style.currentTab}`}>全部</a>
            <a className={style.topicTab}>精华</a>
            <a className={style.topicTab}>分享</a>
            <a className={style.topicTab}>问答</a>
          </div>
          <div className={style.innerContent}>
            <div className={style.topicList}>
              {/* 避免接口出错后页面显示不出，这里做个判断，有兴趣的可以把 empty页面做得好看点 */}
              { (homeData && homeData.data)
                ? (
                  <TopicList homeData={homeData} />
                ) : (
                  <div className="empty">没有内容</div>
                )
              }
            </div>
          </div>
        </div>
        <div className={style.sideBar}>
          sideBar
        </div>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    homeData: state.home.homeData,
  }
}

const mapDispatch = () => {
  return {
  }
}

export default connect(mapState, mapDispatch)(Home)
