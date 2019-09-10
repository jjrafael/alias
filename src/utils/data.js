// Utility for reducers/database/firebase functionalities
import { find } from 'lodash';

// Firebase
export function parseFireResponse(response) {
	return {
		id: response.id,
		...response.data,
	}
}

export function checkQuerySize(data, returnArray) {
	let result = null;

	if(data && data.response && data.response.length){
		result = returnArray ? data.response : true;
	}else{
		result = returnArray ? [] : false;
	}

	return result;
}

//Data modifications
export function mergeArray(_arr1, _arr2, keepNonExist, _prop){
	const arr1 = Array.isArray(_arr1) ? _arr1 : (_arr1 ? [_arr1] : []); //previous array
	const arr2 = Array.isArray(_arr2) ? _arr2 : (_arr2 ? [_arr2] : []);	//new array
	const prop = _prop || 'id';
	let arr = [];
	arr1.forEach(d => {
		const next = find(arr2, [prop, d[prop]])
		if(next){
			arr.push(next);
		}else if(keepNonExist){
			arr.push(d);
		}
	})

	arr2.forEach(d => {
		const exists = find(arr, [prop, d[prop]]);
		if(!exists){
			arr.push(d);
		}
	})

	return arr;
}