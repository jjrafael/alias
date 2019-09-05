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

export function readApp(id, notStateSave) {
	const ref = baseURL.app.doc(id);
  return {
  	types: [
  		constants.READ_APP_REQUEST,
  		constants.READ_APP_SUCCESS,
  		constants.READ_APP_FAILURE
  	],
  	method: 'get',
  	payload: { notStateSave },
  	callRef: ref,
  }
}

export function editApp(id, data, notStateSave) {
	const ref = baseURL.app.doc(id);
  return {
  	types: [
  		constants.EDIT_APP_REQUEST,
  		constants.EDIT_APP_SUCCESS,
  		constants.EDIT_APP_FAILURE
  	],
  	method: 'set',
  	data,
  	payload: { notStateSave },
  	callRef: ref,
  }
}

export function listenApp(id) {
  const ref = baseURL.app.doc(id);
  const listenData = {
    returnData: true
  }
  return {
    types: [
      constants.LISTEN_APP_REQUEST,
      constants.LISTEN_APP_SUCCESS,
      constants.LISTEN_APP_FAILURE
    ],
    method: 'listen',
    callRef: ref,
    listenData,
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

export function editUser(id, data) {
	const ref = baseURL.users.doc(id);
  return {
  	types: [
  		constants.EDIT_USER_REQUEST,
  		constants.EDIT_USER_SUCCESS,
  		constants.EDIT_USER_FAILURE
  	],
  	method: 'set',
  	data,
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

export function toggleWarningModal(show, data) {
  return {
    type: constants.TOGGLE_WARNING_MODAL,
    data: { show, ...data },
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

export function setSettings(data) {
  return {
  	type: constants.SET_SETTINGS,
    data,
  }
}

export function toggleSignOutModal(show) {
  return {
  	type: constants.MODAL_TOGGLE_SIGNOUT,
    data: show,
  }
}

export function toggleResetGameModal(show) {
  return {
  	type: constants.MODAL_TOGGLE_RESET_GAME,
    data: show,
  }
}

export function toggleResetTeamModal(show) {
  return {
  	type: constants.MODAL_TOGGLE_RESET_TEAM,
    data: show,
  }
}

export function toggleRestartGameModal(show) {
  return {
  	type: constants.MODAL_TOGGLE_RESTART_GAME,
    data: show,
  }
}

export function toggleEnterCodeModal(show) {
  return {
  	type: constants.MODAL_TOGGLE_ENTER_CODE,
    data: show,
  }
}

export function toggleRoundWinnerModal(show) {
  return {
  	type: constants.MODAL_TOGGLE_ROUND_WINNER,
    data: show,
  }
}

export function toggleQuitGameModal(show) {
  return {
  	type: constants.MODAL_TOGGLE_QUIT_GAME,
    data: show,
  }
}

export function toggleReportAliasModal(show) {
  return {
  	type: constants.MODAL_TOGGLE_REPORT_ALIAS,
    data: show,
  }
}

export function toggleAliasHistoryModal(show) {
  return {
  	type: constants.MODAL_TOGGLE_ALIAS_HISTORY,
    data: show,
  }
}

export function clearRdxApp() {
  return {
  	type: constants.CLEAR_STATES,
  }
}