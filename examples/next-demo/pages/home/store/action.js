import * as constants from './constants'

/* eslint-disable import/prefer-default-export */
export const changeHomeData = (data) => {
  return {
    type: constants.CHANGE_HOME_DATA,
    data,
  }
}
