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
