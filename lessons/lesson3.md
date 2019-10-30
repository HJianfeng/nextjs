这节课我们来完成头部、首页的代码和使用axios进行数据请求。  

[源码](https://github.com/HJianfeng/nextjs/tree/master/examples/next-demo)  


[react服务端渲染框架Next.js入门（一）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson1.md)  
[react服务端渲染框架Next.js入门（二）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson2.md)  
[react服务端渲染框架Next.js入门（三）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson3.md)  
[react服务端渲染框架Next.js入门（四）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson4.md)  

## 一、页面Header
[CNode社区](https://cnodejs.org/)所有页面的头部都是一样的，所以我们需要把头部代码抽出来当成公用组件 Header。  
我们在components目录下创建文件夹Header，在Header下创建 index.js 和 style.less。  
```javascript
// ～components/Header/index.js
import React from 'react'
import style from './style.less'

const Header = () => (
  <div className={style.header}>
    header
  </div>
)

export default Header
```
```less
// ～components/Header/style.less
.header{
  width: 100%;
}
```
接下来我们需要创建一个 Layout 用来集中管理我们的 Header、Footer还有一些 meta 标签等。在components创建Layout目录，Layout下创建 index.js。  
```javascript
// ~pages/_app.js
import Head from 'next/head'
import React from 'react'
import Header from '../Header'

const Layout = ({
  children,
  title = 'CNode社区',
}) => {
  return (
    <div>
      <Head>
        <title>{ title }</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="renderer" content="webkit" />
        <link rel="icon" href="/static/favicon.ico" mce_href="/static/favicon.ico" type="image/x-icon" />
        <link rel="stylesheet" href="/static/css/reset.css" />
      </Head>
      <Header />
      { children }
    </div>
  )
}

export default Layout
```
我们在这个组件里配置了 header、title、favicon和公用的reset.css。favicon和reset.css都放在static目录。

然后编辑 /pages/_app.js 文件，把 Layout 集成进去。
```javascript
// ~pages/_app.js
import App, { Container } from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import makeStore from '../store'
import Layout from '../components/Layout'

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return { pageProps }
  }

  componentDidMount() {}
  // 在 Layout 传入参数 title，使每个页面可以设置不同的title。
  render() {
    const { Component, pageProps, store } = this.props
    return (
      <Container>
        <Provider store={store}>
          <Layout
            title={pageProps.title}
          >
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </Container>
    )
  }
}

export default withRedux(makeStore)(MyApp);
```
这样我们的header组件就出现在页面上了。  
接下来我们根据[CNode官网](https://cnodejs.org/)来写Header的样式。  
```javascript
// ～components/Header/index.js
import React from 'react'
import Link from 'next/link'
import style from './style.less'

const Header = () => (
  <div className={style.header}>
    <div className={style.headerInner}>
      <div className={`${style.container} clearfloat`}>
        <Link href="/">
          <a className={style.brand}>
            <img src="//static2.cnodejs.org/public/images/cnodejs_light.svg" alt="" />
          </a>
        </Link>
        <div className={`${style.nav} flex flex-align-center`}>
          <Link href="/">
            <a>首页</a>
          </Link>
          <Link href="/">
            <a>新手入门</a>
          </Link>
          <Link href="/">
            <a>关于</a>
          </Link>
          <Link href="/">
            <a>API</a>
          </Link>
        </div>
      </div>
    </div>
  </div>
)

export default Header
```
```less
// ～components/Header/style.less
.header {
  margin-bottom: 0;
  z-index: 9;
  width: 100%;
  position: relative;
  background: #444;
  .headerInner {
    background: 0 0;
    border-radius: 0;
    border: none;
    box-shadow: none;
    width: 90%;
    margin: auto;
    padding: 5px;
    .container{
      width: 100%;
      min-width: 960px;
      margin: 0 auto;
      max-width: 1400px;
    }
  }
  .brand {
    display: block;
    width: 120px;
    float: left;
    padding: 3px 20px;
    height: 34px;
    line-height: 34px;
    color: #ccc;
    font-weight: 700;
  }
  .nav{
    float: right;
    height: 100%;
    a{
      text-shadow: none;
      color: #ccc;
      font-size: 13px;
      float: none;
      padding: 13px 15px;
      text-decoration: none;
      height: 100%;
    }
  }
}
```
完成后的效果  

![](https://user-gold-cdn.xitu.io/2019/4/2/169dbce051c737c5?w=2878&h=196&f=png&s=62472)  

## 二、axios请求数据
我们使用axios来请求数据，因为axios在客户端和服务端都能使用。首先安装axios ```npm install axios --save``` 为了方便管理和使用，我们把axios简单封装一下。在根目录创建文件夹utils，utils下新建 axios.js 文件。
```javascript
// ~utils/axios.js
import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://cnodejs.org/api/v1',
  timeout: 10000,
})

// 拦截器
instance.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})
instance.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

export default instance
```
baseURL 我们填CNode社区的api。  
我们请求数据统一在 action 里请求，现在我们打开首页的 action.js 定义一个方法。
```javascript
// ~pages/home/store/action.js
import axios from '../../../utils/axios'
import * as constants from './constants'

export const changeHomeData = (data) => {
  return {
    type: constants.CHANGE_HOME_DATA,
    data,
  }
}

export const getHomeData = () => {
  return async (dispatch) => {
    const { data } = await axios.get('/topics')
    dispatch(changeHomeData(data))
  }
}
```
在Home里面触发这个action
```javascript
// ~pages/home/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './style.less'
import { actionCreators } from './store'

class Home extends Component {
  static async getInitialProps({ store }) {
    await store.dispatch(actionCreators.getHomeData());
    return { }
  }

  render() {
    const { changeHome } = this.props
    return (
      <div>
        <div className={style.container}>222</div>
        <button type="button" onClick={() => { changeHome() }}>改变homeData</button>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    homeData: state.home.homeData,
  }
}

const mapDispatch = (dispatch) => {
  return {
    changeHome() {
      const data = '我改变了'
      dispatch(actionCreators.changeHomeData(data));
    },
  }
}

export default connect(mapState, mapDispatch)(Home)
```
在next里有个异步方法```getInitialProps```，当页面初始化加载时运行，```getInitialProps```只会加载在服务端。我们需要在这里使用 dispatch 来触发获取数据的action，action获取完数据触发 changeHomeData 来改变 homeData。
这样我们就获取到了首页的数据。
## 三、首页
写样式不是我们这篇的主题，所以具体样式因为太长我就不贴出来了，有兴趣的童鞋去源码自取。  
```jsx
// ~pages/home/index.js
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
```
这里我创建了一个组件 ```<TopicList />``` 用来显示主题列表，在开发过程中建议大家能组件化的就把它做成组件，这样维护起来比较方便。  
在home目录下创建components文件夹，components里新建 TopicList.js 文件。
```javascript
// ~pages/home/components/TopicList.js
import React, { Fragment } from 'react'
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
```
至此CNode简易版的首页就完成了  

![](https://user-gold-cdn.xitu.io/2019/4/2/169dd34ba501af15?w=2866&h=962&f=png&s=498213)  

## 四、总结
这节我们完成了首页和头部，里面的公共样式reset.css和首页的样式太长了所以没有贴出来，大家可以去源码那里查看。下一篇是这个系列最后一篇，我会带大家完成详情页和创建其他几个页面。其实到现在为止 ```next.js``` 的入门基本结束了，下一篇和创建首页也差不多只不过是动态路由需要获取到id参数而已。下面附上到现在为止的目录结构：  
```
|-- examples
    |-- .babelrc
    |-- .editorconfig
    |-- .eslintrc
    |-- .gitignore
    |-- next.config.js
    |-- package-lock.json
    |-- package.json
    |-- server.js
    |-- components
    |   |-- Header
    |   |   |-- index.js
    |   |   |-- style.less
    |   |-- Layout
    |       |-- index.js
    |-- pages
    |   |-- _app.js
    |   |-- home
    |       |-- index.js
    |       |-- style.less
    |       |-- components
    |       |   |-- TopicList.js
    |       |-- store
    |           |-- action.js
    |           |-- constants.js
    |           |-- index.js
    |           |-- reducer.js
    |-- static
    |   |-- favicon.ico
    |   |-- css
    |   |   |-- reset.css
    |   |-- images
    |       |-- cnodejs_light.svg
    |-- store
    |   |-- index.js
    |   |-- reducer.js
    |-- utils
        |-- axios.js

```
