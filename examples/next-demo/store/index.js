import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import reducer from './reducer'

const exampleInitialState = { }
const makeStore = (initialState = exampleInitialState) => {
  return createStore(reducer, initialState, applyMiddleware(thunk));
};

export default makeStore;
