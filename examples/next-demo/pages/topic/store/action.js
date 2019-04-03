import axios from '../../../utils/axios'
import * as constants from './constants'

export const changeTopicData = (data) => {
  return {
    type: constants.CHANGE_TOPIC_DATA,
    data,
  }
}

export const getTopic = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/topic/${id}`)
    dispatch(changeTopicData(data))
    return data;
  }
}
