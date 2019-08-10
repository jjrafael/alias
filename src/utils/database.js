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
