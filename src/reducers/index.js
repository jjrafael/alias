import { combineReducers } from 'redux';

//Reducers
import app from './app';
import cards from './cards';
import game from './game';
import team from './team';

const appReducer = combineReducers({
	app,
	cards,
	game,
	team,
});

const reducers = (state, action) => {
	return appReducer(state, action);
}

export default reducers;