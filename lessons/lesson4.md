这节我们来搭建详情页  
[源码](https://github.com/HJianfeng/nextjs/tree/master/examples/next-demo)  


[react服务端渲染框架Next.js入门（一）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson1.md)  
[react服务端渲染框架Next.js入门（二）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson2.md)  
[react服务端渲染框架Next.js入门（三）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson3.md)  
[react服务端渲染框架Next.js入门（四）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson4.md)  

## 一、详情页
和之前一样，我们在 pages 创建topic目录，topic目录创建index.js和style.less  
```javascript
// ~pages/topic/index.js
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
      // 设置页面标题
      return { title: topic.data.title }
    }
    return { }
  }

  render() {
    const { topic } = this.props;
    console.log(topic)
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
```
接下来创建topic的store目录，和Home组件的套路一样  
```javascript
// ~pages/topic/store/index.js
import reducer from './reducer'
import * as actionCreators from './action'
import * as constants from './constants'

export { reducer, actionCreators, constants }
```
```javascript
// ~pages/topic/store/constants.js
/* eslint-disable import/prefer-default-export */
export const CHANGE_TOPIC_DATA = 'topic/CHANGE_TOPIC_DATA'
```
```javascript
// ~pages/topic/store/action.js
import axios from '../../../utils/axios'
import * as constants from './constants'

export const changeTopicData = (data) => {
  return {
    type: constants.CHANGE_TOPIC_DATA,
    data,
  }
}

export const getTopic = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/topic/${id}`)
    dispatch(changeTopicData(data))
    // 把获取到的数据 返回给页面 getInitialProps
    return data;
  }
}
```
```javascript
// ~pages/topic/store/reducer.js
import * as constants from './constants'

const defaultState = {
  topic: {},
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.CHANGE_TOPIC_DATA:
      return Object.assign({}, state, {
        topic: action.data,
      })
    default:
      return state;
  }
}
```
代码写好别忘记，在server.js配置路由
```javascript
const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express()
    // 页面
    server.get('/', (req, res) => {
      return app.render(req, res, '/home', req.query)
    })
    // 参数 id
    server.get('/topic/:id', (req, res) => {
      return app.render(req, res, '/topic', req.query)
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
```
还有把topic的reducer集成到根目录的reducer
```javascript
import { combineReducers } from 'redux'
import { reducer as homeReducer } from '../pages/home/store'
import { reducer as topicReducer } from '../pages/topic/store'

const reducer = combineReducers({
  home: homeReducer,
  topic: topicReducer,
});

export default reducer;
```
重启我们的服务就Ok啦。  
## 二、总结
这节内容很少，本来还想写几个其他页面，但其实都没什么难度，所以就不再讲废话了。总的来说 next.js 很简单，想要快速搭建一个react服务端渲染的同学，使用它直接开箱即用就可以，当然也可以使用原生react配置，会稍微复杂一点。
