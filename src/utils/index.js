//Utility for common functionalities throughtout the project
import moment from 'moment';
import * as firebase from 'firebase';
import { isNumber, isEmpty } from 'lodash';
import { variables } from '../config';
import colors from '../config/colorPalette';

export function getNow(isString) {
	let now = null;

	if(isString){
		now = moment().format(variables.timeFormat);
	}else{
		now = firebase.firestore.Timestamp.fromDate(new Date());
	}

    return now;
}

export function bool(data) {
	return isNumber(data) && data === 0 ? true: !isEmpty(data);
}

export function filter(arr, cond, onlyOne) {
	let data = bool(arr) ? arr : [];
	data = Array.isArray(data) ? data : [data];
	data = data.filter(cond);
	data = data.length > 1 ? data
		: (bool(data) ? data[0]
			: (onlyOne ? null : []));
	data = onlyOne && data.length > 1 ? data[0] : data;

	return data;
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

export function makeId(length=6, noSpecial) {
	const special = '?!@';
	const alphaNum = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const chars = noSpecial ? alphaNum : alphaNum+special;
	const charsLen = chars.length;
	let result = '';

	for ( var i = 0; i < length; i++ ) {
	  result += chars.charAt(Math.floor(Math.random() * charsLen));
	}

	return result;
}

export function randomIndexArray(indexLen, length=10, sourceLen) {
 	let result = [];

	if(!sourceLen){
		for ( var i = 0; i < length; i++ ) {
			const random = randomNumber(indexLen);
			if(result.indexOf(random) === -1){
				result.push(random);
			}else{
				result.push(...randomIndexArray(indexLen, 1, result));
			}
		}
	}else{
		const random = randomNumber(indexLen);
		if(sourceLen.indexOf(random) === -1){
			result.push(random);
		}else{
			result.push(...randomIndexArray(indexLen, 1, sourceLen));
		}
	}

   return result;
}

export function makeArrayFromIndexArray(array, indexArray) {
	let arr = [];

	if(bool(array) && bool(indexArray)){
		indexArray.forEach(d => arr.push(array[d]))
	}

	return arr;
}

export function randomNumber(length=100) {
   return Math.floor(Math.random() * length);
}

export function pluralizeString(string, len){
	return len > 1 ? string+'s' : string;
}

export function reduce(data, type, prop) {
	let arr = [];
	if(bool(data) && type){
		if(type === 'accum'){
			arr = data.reduce((accum, d) => {
				const item = prop	? d[prop] : d;
				return Array.isArray(accum) ? [...accum, item] : [item]
			})
		}else if(type === 'sum'){
			arr = data.reduce((sum, d) => {
				const item = prop ? d[prop] : 1;
				return sum + item;
			}, 0)
		}else if(type === 'diff'){
			arr = data.reduce((sum, d) => {
				const item = prop ? d[prop] : 1;
				return sum - item;
			}, 0)
		}
	}

	return arr;
}

export function minToMsec(value, isReverse) {
	return value ? (!isReverse ? (value * 60000) : (value / 60000 )) : 0;
}

export function getPercentage(baseValue, value, method) {
	let perc = 0;
	if(method === 'diffPerc'){
		perc = ((baseValue - value) / baseValue) * 100;
	}else{
		perc = (value / baseValue) * 100;
	}

	return perc;
}

// react method helpers
export function compareUpdate(prev, next, operator, haveValue, extra){
	const child = extra && extra.checkChild ? extra.checkChild : null;
	const condition = extra && extra.condition ? extra.condition : null;
	let result = false;

	switch(operator){
		case '!==':
			result = prev !== next;
		break;
		case '===':
			result = prev === next;
		break;
		default:
			result = prev !== next;
		break;
	}

	if(haveValue === 'both'){
		result = result && bool(prev) && bool(next);
	}else if(haveValue === 'prev'){
		result = result && bool(prev);
	}else if(haveValue === 'next'){
		result = result && bool(next);
	}else if(haveValue === 'either'){
		result = result && (bool(prev) || bool(next));
	}else if(haveValue === 'prev-only'){
		result = result && (bool(prev) && !bool(next));
	}else if(haveValue === 'next-only'){
		result = result && (!bool(prev) && bool(next));
	}else if(haveValue === 'none'){
		result = result && (!bool(prev) && !bool(next));
	}else{
		result = result && (bool(prev) || bool(next));
	}

	if(condition){
		result = result && ([condition.state][condition.prop] === condition.value);
	}

	if(child){
		const isArray = Array.isArray(child.const);
		const aprev = isArray && child.const.length === 3 ? prev[child.const[0]][child.const[1]][child.const[2]] :
			(isArray && child.const.length === 2 ? prev[child.const[0]][child.const[1]] :
			(isArray && child.const.length === 1 ? prev[child.const[0]] : prev[child.const]));
		const anext = isArray && child.const.length === 3 ? next[child.const[0]][child.const[1]][child.const[2]] :
			(isArray && child.const.length === 2 ? next[child.const[0]][child.const[1]] :
			(isArray && child.const.length === 1 ? next[child.const[0]] : next[child.const]));
		compareUpdate(aprev, anext, child.operator, child.haveValue, child.extra);
	}

	return result;
}

// dom manipulation
export function scrollTo(id, type){
	const el = document.getElementById(id);
	if(type === 'top'){
		el.scrollTop = 0;
	}else if(type === 'bottom'){
		el.scrollTop = el.scrollHeight;
	}else{
		el.scrollTop = el.scrollHeight;
	}
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