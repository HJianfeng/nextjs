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
