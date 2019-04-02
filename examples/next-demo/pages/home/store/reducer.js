import * as constants from './constants'

const defaultState = {
  homeData: {},
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
