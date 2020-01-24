import { combineReducers } from 'redux';

//Reducers
import session from './session';

const appReducer = combineReducers({
	session
});

const reducers = (state, action) => {
	return appReducer(state, action);
}

export default reducers;