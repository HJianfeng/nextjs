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

const mapDispatch = (dispatch) => {
  return {
    changeHome() {
      const data = '我改变了'
      dispatch(actionCreators.changeHomeData(data));
    },
  }
}

export default connect(mapState, mapDispatch)(Home)
