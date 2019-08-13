import constants from '../../constants/app';
import { baseURL } from '../../Firebase';

//APP
export function initializeApp(data) {
	const ref = baseURL.app;
    return {
    	types: [
    		constants.INITIALIZE_APP_REQUEST,
    		constants.INITIALIZE_APP_SUCCESS,
    		constants.INITIALIZE_APP_FAILURE
    	],
    	method: 'add',
    	data: data,
    	callRef: ref,
    }
}

export function readApp(id) {
	const ref = baseURL.app.doc(id);
    return {
    	types: [
    		constants.READ_APP_REQUEST,
    		constants.READ_APP_SUCCESS,
    		constants.READ_APP_FAILURE
    	],
    	method: 'get',
    	callRef: ref,
    }
}

//USER
export function addUser(data) {
	const ref = baseURL.users;
    return {
    	types: [
    		constants.ADD_USER_REQUEST,
    		constants.ADD_USER_SUCCESS,
    		constants.ADD_USER_FAILURE
    	],
    	method: 'add',
    	data: data,
    	callRef: ref,
    }
}

export function readUser(id, isCache) {
	const ref = baseURL.users.doc(id);
    return {
    	types: [
    		constants.READ_USER_REQUEST,
    		constants.READ_USER_SUCCESS,
    		constants.READ_USER_FAILURE
    	],
    	method: 'get',
    	callRef: ref,
    	payload: { isCache }
    }
}

//NON-API
export function toggleLoadingOverlay(show, title, extra) {
    return {
        type: constants.TOGGLE_LOADING_OVERLAY,
        data: { show, title, ...extra },
    }
}

export function setDeviceDetails(data) {
    return {
        type: constants.SET_DEVICE_DETAILS,
        data,
    }
}

export function setApp(data) {
    return {
    	type: constants.SET_APP,
        data,
    }
}