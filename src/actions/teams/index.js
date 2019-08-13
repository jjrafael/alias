import constants from '../../constants/team';
import { baseURL } from '../../Firebase';

//APP
export function addTeam(data) {
	const ref = baseURL.teams;
    return {
    	types: [
    		constants.ADD_TEAM_REQUEST,
    		constants.ADD_TEAM_SUCCESS,
    		constants.ADD_TEAM_FAILURE
    	],
    	method: 'add',
    	data: data,
    	callRef: ref,
    }
}

export function updateTeam(id, data) {
	const ref = baseURL.teams.doc(id);
    return {
    	types: [
    		constants.EDIT_TEAM_REQUEST,
    		constants.EDIT_TEAM_SUCCESS,
    		constants.EDIT_TEAM_FAILURE
    	],
    	method: 'set',
        data: data,
    	callRef: ref,
    }
}

export function readTeam(id) {
    const ref = baseURL.teams.doc(id);
    return {
        types: [
            constants.READ_TEAM_REQUEST,
            constants.READ_TEAM_SUCCESS,
            constants.READ_TEAM_FAILURE
        ],
        method: 'get',
        callRef: ref,
    }
}

export function browseTeams(id) {
    const ref = baseURL.teams.doc(id);
    return {
        types: [
            constants.BROWSE_TEAM_REQUEST,
            constants.BROWSE_TEAM_SUCCESS,
            constants.BROWSE_TEAM_FAILURE
        ],
        method: 'get',
        callRef: ref,
    }
}
