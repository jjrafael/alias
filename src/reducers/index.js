import { combineReducers } from 'redux';

//Reducers
import app from './app';
import cards from './cards';
import game from './game';
import team from './team';
import leader from './leader';

const appReducer = combineReducers({
	app,
	cards,
	game,
	team,
	leader,
});

const reducers = (state, action) => {
	return appReducer(state, action);
}

export default reducers;