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
