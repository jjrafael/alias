// Utility for database/firebase functionalities
import { baseURL } from '../Firebase';

// Firebase
export function parseFireResponse(response) {
	return {
		id: response.id,
		...response.data,
	}
}

export function dbRef(collectionKey, ref) {
	return baseURL.db.ref(collectionKey+'/'+ref);
}

export function checkQuerySize(data, returnArray) {
	let result = null;

	if(data && data.response && data.response.docs && !data.error && !data.response.empty){
		result = returnArray
			? data.response.docs.map(d => {
				return {...d.data(), id: d.id}
			})
			: true;
	}else{
		result = returnArray ? [] : false;
	}

	return result;
}
