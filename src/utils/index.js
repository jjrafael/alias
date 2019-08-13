//Utility for common functionalities throughtout the project
import moment from 'moment';
import { variables } from '../config';

export function getNow() {
    return moment().format(variables.timeFormat);
}

export function getResponse(doc, cond) {
	let value = null;

	if(doc && doc.response && !doc.error){
		const data = doc.response.data();
		const condition = cond ? (data[cond.key] === cond.value) : true;
		if(data && condition){
			value = data;
		}
	}

	return value;
}

export function isResponseExists(doc) {
	let bool = false;

	if(doc && doc.response && !doc.error){
		bool = !!doc.response.data();
	}

	return bool;
}

export function makeId(length=6) {
   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const charsLen = chars.length;
   let result = '';

   for ( var i = 0; i < length; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * charsLen));
   }

   return result;
}

// local storage
export function getAllLocalStorage() {
    return {
    	appId: localStorage.getItem('alias_appId'),
	    userId: localStorage.getItem('alias_userId'),
	    gameId: localStorage.getItem('alias_gameId'),
	    app: JSON.parse(localStorage.getItem('alias_app')),
	   	user: JSON.parse(localStorage.getItem('alias_user')),
	    game: JSON.parse(localStorage.getItem('alias_game')),
    }
}

export function getLocalStorage(key) {
	let value = localStorage.getItem(key);

	if(key.indexOf('Id') === -1){
		value = JSON.parse(value);
	}

    return value;
}

export function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

export function deleteLocalStorage(key) {
    localStorage.deleteItem(key);
}

export function clearLocalStorage(key) {
    localStorage.deleteItem('alias_appId');
    localStorage.deleteItem('alias_userId');
    localStorage.deleteItem('alias_gameId');
    localStorage.deleteItem('alias_app');
    localStorage.deleteItem('alias_user');
    localStorage.deleteItem('alias_game');
}

export function hasCachedActiveGame() {
	const localStored = getAllLocalStorage;
	const game = localStored && localStored.game ? JSON.parse(localStored.game) : null;
	return (localStored && localStored.gameId
			&& game &&  game.status === 'active')
		? localStored.gameId : null;
}

export function hasCachedActiveApp() {
	const localStored = getAllLocalStorage();
	const app = localStored && localStored.app ? JSON.parse(localStored.app) : null;
	return (localStored && localStored.appId
			&& app &&  app.status === 'active')
		? localStored.appId : null;
}