## 写在前面
next.js是react的同构库，用它可以快速搭建一个react服务端渲染的框架，相比于直接用react配置服务端渲染简单了不少。对于没写过SSR项目，想要尝试一下的同学是个挺好的选择。[next官方文档](http://nextjs.frontendx.cn/docs/#%E4%BB%A3%E7%A0%81%E8%87%AA%E5%8A%A8%E5%88%86%E5%89%B2)  
[源代码](https://github.com/HJianfeng/nextjs/tree/master/examples/next-demo)  


[react服务端渲染框架Next.js入门（一）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson1.md)  
[react服务端渲染框架Next.js入门（二）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson2.md)  
[react服务端渲染框架Next.js入门（三）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson3.md)  
[react服务端渲染框架Next.js入门（四）](https://github.com/HJianfeng/nextjs/blob/master/lessons/lesson4.md)  

## 一、开工
本次项目基于[cnode社区API](https://cnodejs.org/api)，实现一个完整的SSR项目，主要的技术用到了React 16，react-redux，express和eslint。  
首先```npm init```初始化项目，安装next和React```npm install --save next react react-dom```然后把下面脚本添加到package.json
```
{
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  }
}
```
在根目录创建文件夹pages，components，static
 ，这是next强制要求的目录，pages用来放页面，components用来放公共组件，static用来放静态资源。在next中路由配置文件不需要手动创建，/pages下默认会渲染为页面，文件名自然就是路由名，比如要实现路由```/a```我们只需要在pages中创建文件```/a/index.js```就好了。
 ## 二、配置webpack和eslint
 ESLint 是一个Javascript Linter，他能确保你的代码规范，强烈建议大家在自己的项目中配置上它，特别是在需要团队协作的时候。   
 接下来我们在根目录下创建一个next.config.js文件，这个文件用于自定义配置一些next的功能，我们配置webpack也要在这个文件里配置。  
 安装eslint和相关配置，这里我们采用第三方airbnb的eslint配置，这也是目前比较受欢迎的。
 ```javascript
 // 这里需要安装的依赖比较多，我们分开安装。
 npm install eslint eslint-loader babel-eslint eslint-config-airbnb eslint-loader eslint-config-standard --save-dev
 npm install eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-node eslint-plugin-promise eslint-plugin-react eslint-plugin-standard --save-dev
 ```
 安装完成后在next.config.js配置
 ```javascript
const path = require('path')

module.exports = {
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
  }
}
 ```
 然后在根目录创建 .eslintrc 这个是eslint配置文件，在rules中可以配置一些在airbnb之外的规则
 ```
 {
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "extends": "airbnb",
  "rules": {
    "semi": [0],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "jsx-a11y/anchor-is-valid": [0],
    "react/require-default-props": [0],
    "arrow-body-style": [0],
    "no-param-reassign": [0],
    "react/prop-types": [<enabled>, { ignore: <ignore>, customValidators: <customValidator> }]
  }
}
 ```
 这样eslint就配置完成了，如果代码不规范会在编辑器上直接报错。  
 接下来我们配置一些其他配置，创建.editorconfig 和 .babelrc  
 在工作中我们大家用的代码编辑工具不同，所缩进的空格有也有所不同，提交时就可能会产生diff。我们就可以通过editorconfin来解决这个问题
 ```
root = true
[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
 ```
 .babelrc 是babel配置文件，这里我们需要配置next/babel
```
{
  "presets": ["next/babel"],
  "plugins": []
}
```
至此，基础的配置工作就完成了。
## 三、试一试
接下来我们创建一个页面试一试。  
在pages下创建一个文件index.js
```
import React from 'react'

const Home = () => {
  return (
    <div>hello world</div>
  )
}

export default Home
```
在终端运行```npm run dev```，浏览器打开http://localhost:3000/，页面上就出现hello world了。
## 四、小结
本节我们构建了next应用的基础目录结构，并配置了eslint，在下面章节里，将继续完善我们的next应用。下面附上到现在为止的目录结构
```
|-- next-cnode
    |-- .babelrc
    |-- .editorconfig
    |-- .eslintrc
    |-- next.config.js
    |-- package.json
    |-- components
    |-- pages
    |   |-- index.js
    |-- static
```
