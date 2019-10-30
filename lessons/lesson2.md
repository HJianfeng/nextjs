这节课我们一起来完成项目的架构
[源码github](https://github.com/HJianfeng/nextjs/tree/master/examples/next-demo)  


[react服务端渲染框架Next.js入门（一）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson1.md)  
[react服务端渲染框架Next.js入门（二）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson2.md)  
[react服务端渲染框架Next.js入门（三）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson3.md)  
[react服务端渲染框架Next.js入门（四）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson4.md)  

## 一、引入less
为了更方便的处理我们的样式，我们选择使用less来处理样式，并使用css modules。css modules很容易学，因为它的规则少，同时又非常有用，可以保证某个组件的样式，不会影响到其他组件。  
安装less ```npm install less @zeit/next-less --save```，然后更改一下next.config.js，配置css modules很简单，cssModules设置为true就OK了。
```javascript
// next.config.js
const path = require('path')
const withLess = require('@zeit/next-less')

if (typeof require !== 'undefined') {
  require.extensions['.less'] = () => {}
}
module.exports = withLess({
  cssModules: true, // 开启css modules
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },
  webpack(config) {
    const eslintRule = {
      enforce: 'pre',
      test: /.(js|jsx)$/,
      loader: 'eslint-loader',
      exclude: [
        path.resolve(__dirname, '/node_modules'),
      ],
    }
    config.module.rules.push(eslintRule)
    return config
  },
})
```
在pages目录下新建一个style.less文件
```less
.container{
  background-color: red;
}
```
在pages/index.js中引入style.less，cssModules调用样式的时候不需要直接填写class名，直接通过引入的style调用样式 ```className={style.container}```
```javascript
// pages/index.js
import React from 'react'
import style from './style.less'

const Home = () => {
  return (
    <div className={style.container}>hello world</div>
  )
}

export default Home
```
## 二、引入redux
写过react的同学应该对它都不陌生，按照官方教程一顿复制粘贴基本都能用。那如何在next中使用redux呢？next本身集成了项目入口，但是我们需要自定义入口，这样我们才能在这里配置redux和引入公用的header和footer组件。  
在pages目录新建_app.js文件，安装redux```npm install redux react-redux redux-thunk next-redux-wrapper --save```
```javascript
// pages/_app.js
import App, { Container } from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import makeStore from '../store'


class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return { pageProps }
  }

  componentDidMount() {}

  render() {
    const { Component, pageProps, store } = this.props
    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}

export default withRedux(makeStore)(MyApp);
```
然后在根目录下创建store文件夹，store里创建index.js 和 reducer.js。

一个项目里我们会创建很多个页面，如果我们把所有页面的 reducer 全部放在一起的话，很明显不利于我们代码的简洁性，也不利于我们后期维护，所以我们需要分拆各个页面的reducer，为每个页面独立创建自己的 reducer，然后在```/store/reducer.js```里整合。拆分之后的 reducer 都是相同的结构（state, action），并且各自独立管理该页面 state 的更新。  

Redux 提供了 combineReducers 去实现这个模式。
```javascript
// ~/store/reducer.js
import { combineReducers } from 'redux'

const reducer = combineReducers({
});

export default reducer;
```
以后我们每创建一个reducer的时候，只需要在这里引入，并且添加到 combineReducers 里就可以使用他了。
```javascript
// ~/store/index.js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import reducer from './reducer'

const exampleInitialState = { }
const makeStore = (initialState = exampleInitialState) => {
  return createStore(reducer, initialState, applyMiddleware(thunk));
};

export default makeStore;
```
基本redux结构配置好了，后面我们在写页面的时候再慢慢完善。
##  三、自定义服务端路由server.js
在next.js中是根据文件夹名来确定路由，但是出现动态路由也就是后面带参数比如```/a/:id```的时候就会出现问题了，虽然我们可以在 ```getInitialProps``` 方法中获取到 id 参数，但是这样会和 ```/a``` 路由冲突，并且很不优雅。所以我们需要自定义服务端路由。  
在根目录创建server.js文件，安装express ```npm install express --save```
```javascript
// ~server.js
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

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
```
当然我们的启动文件也要改，package.json 里的 scripts 改成
```
"scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
}
```
这样路由 ```/``` 就会指向到 pages文件夹下的home目录。  
我们在pages目录下创建home文件夹，并且把pages下的 index.js 和 style.less移动到home下，这个以后就是我们的首页了。移完后我们pages的目录结构如下。
```
|-- pages
    |-- home
        |-- index.js
        |-- style.less
    |-- _app.js
```
在命令行运行 ```npm run dev``` 程序，浏览器打开http://localhost:3000  
## 四、配置页面的redux
home文件夹创建好了，我们来为首页添加redux。在home目录下创建store文件夹，store创建 index.js、reducer.js、action.js和constants.js。index.js是用来暴露出reducer和action，方便我们的调用。constants.js是用来存放 action 的type常量，以后我们就可以直接在这里维护 action 的type常量，避免出现写错type的低级错误。  
首先是reducer
```javascript
// ~pages/home/store/reducer.js
import * as constants from './constants'

const defaultState = {
  homeData: '我是首页',
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.CHANGE_HOME_DATA:
      return Object.assign({}, state, {
        homeData: action.data,
      })
    default:
      return state;
  }
}
```
我们定义一个改变 homeData 的reducer，如果```action.type``` 等于 ```constants.CHANGE_HOME_DATA``` 常量我们就改变 state 里 homeData 的值。  
用过redux的同学都知道，在 reducer 里原先的 state 是不允许被改变的，所以我们这里使用 ```Object.assign``` 进行深拷贝。
```javascript
// ~pages/home/store/action.js
import * as constants from './constants'

/* eslint-disable import/prefer-default-export */
export const changeHomeData = (data) => {
  return {
    type: constants.CHANGE_HOME_DATA,
    data,
  }
}
```
定义一个 action 来管理reducer，传入 type 和 data 给reducer。  

当然别忘记创建type常量 ```constants.CHANGE_HOME_DATA```
```javascript
// ~pages/home/store/constants.js

/* eslint-disable import/prefer-default-export */
export const CHANGE_HOME_DATA = 'home/CHANGE_HOME_DATA'
```
```javascript
// ~pages/home/store/index.js
import reducer from './reducer'
import * as actionCreators from './action'
import * as constants from './constants'

export { reducer, actionCreators, constants }
```
把reducer，actionCreators和constants暴露出来，方便其他页面引用。  

接下来需要在根目录的reducer进行耦合
```javascript
// ~store/reducer
import { combineReducers } from 'redux'
import { reducer as homeReducer } from '../pages/home/store'

const reducer = combineReducers({
  home: homeReducer,
});

export default reducer;
```
这样我们就创建好了 home 页面的 store，我们只需要 ```state.home.homeData``` 就可以引用 homeData 数据。  
既然创建好了，那我们怎么在home是用呢？编辑```~pages/home/index.js```
```javascript
// ~pages/home/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './style.less'
import { actionCreators } from './store'

class Home extends Component {
  static async getInitialProps() {
    return { }
  }

  render() {
    const { homeData, changeHome } = this.props
    return (
      <div>
        <div className={style.container}>{homeData}</div>
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

const mapDispatch = (dispatch, props) => {
  return {
    changeHome() {
      const data = '我改变了'
      dispatch(actionCreators.changeHomeData(data));
    },
  }
}

export default connect(mapState, mapDispatch)(Home)
```
next.js的redux使用和 react的redux使用一模一样，通过 mapState 获得state, mapDispatch来定义方法，在mapDispatch可以通过dispatch触发action，然后action传给reducer参数，使其进行相关操作。
重启服务后，页面就会出现

![](https://user-gold-cdn.xitu.io/2019/4/1/169d80914f797df9?w=798&h=152&f=png&s=25953)  
点击按钮后变成  
![](https://user-gold-cdn.xitu.io/2019/4/1/169d8099730dfbc1?w=498&h=140&f=png&s=30786)
## 四、优化
上面我们自定义了服务端路由server.js，这里有一个问题，我们访问 ```http://localhost:3000/``` 时候会出现首页，但是如果我们访问 ```http://localhost:3000/home``` 也是会访问到同一个页面，因为next的文件路由我们并没有禁止掉，所以我们需要修改一下 next.config.js，新增一个字段 ```useFileSystemPublicRoutes: false```
```javascript
// next.config.js
const path = require('path')
const withLess = require('@zeit/next-less')

if (typeof require !== 'undefined') {
  require.extensions['.less'] = () => {}
}
module.exports = withLess({
  useFileSystemPublicRoutes: false,
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },
  webpack(config) {
    const eslintRule = {
      enforce: 'pre',
      test: /.(js|jsx)$/,
      loader: 'eslint-loader',
      exclude: [
        path.resolve(__dirname, '/node_modules'),
      ],
    }
    config.module.rules.push(eslintRule)
    return config
  },
})
```
重启后再访问 ```http://localhost:3000/home``` 就无法访问到页面了。
## 五、总结
至此我们完成了项目的基本架构，在接下去的章节我们开始学习写具体的页面。当前的目录结构
```
|-- next-cnode
    |-- .babelrc
    |-- .editorconfig
    |-- .eslintrc
    |-- next.config.js
    |-- package.json
    |-- server.js
    |-- components
    |-- store
    |   |-- index.js
    |   |-- reducer.js
    |-- pages
    |   |-- home
    |       |-- store
    |           |-- index.js
    |           |-- reducer.js
    |           |-- action.js
    |           |-- constants.js
    |       |-- index.js
    |       |-- style.less
    |   |-- _app.js
    |-- static
```
