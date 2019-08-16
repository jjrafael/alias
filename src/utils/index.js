//Utility for common functionalities throughtout the project
import moment from 'moment';
import { variables } from '../config';
import colors from '../config/colorPalette';

export function getNow() {
    return moment().format(variables.timeFormat);
}

export function getResponse(doc, cond) {
	let value = null;
	if(doc && doc.response && !doc.error){
		const data = doc.response.data();
		const id = doc.response.id;
		const condition = cond && data ? (data[cond.key] === cond.value) : true;
		if(data && condition){
			value = id ? {...data, id} : data;
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

export function isResType(res, type = 'success') {
	const suffix = '_'+type.toUpperCase();
	return res && res.type.indexOf(suffix) !== -1;
}

export function checkElExists(className) {
	let count = 0;
	if(Array.isArray(className)){
		className.forEach(d => {
			count = count + document.getElementsByClassName(className).length;
		})
	}else{
		count = document.getElementsByClassName(className).length;
	}
	return count;
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

export function randomNumber(length=100) {
   return Math.floor(Math.random() * length);
}

// local storage
export function getAllLocalStorage() {
    return {
    	appId: localStorage.getItem('alias_appId'),
	    userId: localStorage.getItem('alias_userId'),
	    gameId: localStorage.getItem('alias_gameId'),
	    team1Id: localStorage.getItem('alias_team1Id'),
	    team2Id: localStorage.getItem('alias_team2Id'),
	    leaderId: localStorage.getItem('alias_leaderId'),
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
	if(Array.isArray(key)){
		key.forEach(d => {
			localStorage.removeItem(d);
		})
	}else{
		localStorage.removeItem(key);
	}
}

export function clearLocalStorage(key) {
    localStorage.removeItem('alias_appId');
    localStorage.removeItem('alias_userId');
    localStorage.removeItem('alias_gameId');
    localStorage.removeItem('alias_app');
    localStorage.removeItem('alias_user');
    localStorage.removeItem('alias_game');
    localStorage.removeItem('alias_team1Id');
    localStorage.removeItem('alias_team2Id');
    localStorage.removeItem('alias_leaderId');
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

// colors
export function generateColor(count, index, returnArr) {
	const i = index && index > -1 ? index : 0;
	const colorLen = colors.length;
    let light = null;
    let color = null;

    if(i < colorLen){
            let _split = colors[i].split(',');
            color = 'hsl('+_split[0]+', '+_split[1]+'%, '+_split[2]+'%)';
        } else {
            let quotient = parseFloat(count / colorLen);
            let remainder = parseFloat(i % colorLen);
            let _split = colors[remainder].split(',');
            if(parseFloat(_split[2]) > 60){
                light = parseFloat(_split[2]) - ((_split[2]) / quotient);
            } else {
                light = parseFloat(_split[2]) + ((100 - _split[2]) / quotient);
            }
            color = 'hsl('+_split[0]+', '+_split[1]+'%, '+light+'%)';
        }

    if(returnArr){
      color = color
        .replace('hsl','')
        .replace('rgb','')
        .replace('(','')
        .replace(')','')
        .split(',');
    }

    return color;
}