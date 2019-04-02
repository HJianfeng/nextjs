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
