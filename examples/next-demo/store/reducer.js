import { combineReducers } from 'redux'
import { reducer as homeReducer } from '../pages/home/store'
import { reducer as topicReducer } from '../pages/topic/store'

const reducer = combineReducers({
  home: homeReducer,
  topic: topicReducer,
});

export default reducer;
