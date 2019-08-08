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

//NON-API
export function toggleLoadingOverlay() {
    return {
        type: constants.TOGGLE_LOADING_OVERLAY,
    }
}

export function setDeviceDetails(data) {
    return {
        type: constants.SET_DEVICE_DETAILS,
        data,
    }
}