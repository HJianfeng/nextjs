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
