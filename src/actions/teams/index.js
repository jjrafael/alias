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

export function editTeam(id, data) {
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

export function readTeam(id, notStateSave) {
    const ref = baseURL.teams.doc(id);
    return {
        types: [
            constants.READ_TEAM_REQUEST,
            constants.READ_TEAM_SUCCESS,
            constants.READ_TEAM_FAILURE
        ],
        method: 'get',
        payload: { notStateSave },
        callRef: ref,
    }
}

export function listenTeam(id) {
    const ref = baseURL.teams.doc(id);
    const listenData = {
        returnData: true
    }
    return {
        types: [
            constants.LISTEN_TEAM_REQUEST,
            constants.LISTEN_TEAM_SUCCESS,
            constants.LISTEN_TEAM_FAILURE
        ],
        method: 'listen',
        callRef: ref,
        listenData,
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

// TEAM CODE

export function verifyTeamCode(code) {
    const ref = baseURL.teams.where('game_key','==',code);
    return {
        types: [
            constants.VERIFY_TEAM_CODE_REQUEST,
            constants.VERIFY_TEAM_CODE_SUCCESS,
            constants.VERIFY_TEAM_CODE_FAILURE
        ],
        method: 'get',
        callRef: ref,
    }
}

// MEMBERS
export function addMember(id, data, team_number) {
    const ref = baseURL.teams.doc(id).collection('members');
    return {
        types: [
            constants.ADD_MEMBER_REQUEST,
            constants.ADD_MEMBER_SUCCESS,
            constants.ADD_MEMBER_FAILURE
        ],
        method: 'add',
        data,
        payload: { team_number },
        callRef: ref,
    }
}

export function browseMembers(id, team_number) {
    const ref = baseURL.teams.doc(id).collection('members');
    return {
        types: [
            constants.BROWSE_MEMBER_REQUEST,
            constants.BROWSE_MEMBER_SUCCESS,
            constants.BROWSE_MEMBER_FAILURE
        ],
        method: 'get',
        callRef: ref,
        payload: { team_number }
    }
}

export function listenMembers(id, team_number) {
    const ref = baseURL.teams.doc(id).collection('members').orderBy('created_time', 'asc');
    const listenData = {
        returnData: true,
        isColl: true,
    }
    return {
        types: [
            constants.LISTEN_MEMBER_REQUEST,
            constants.LISTEN_MEMBER_SUCCESS,
            constants.LISTEN_MEMBER_FAILURE
        ],
        method: 'listenBrowse',
        payload: { team_number },
        callRef: ref,
        listenData,
    }
}

//NON-API

export function resetTeams(teamNumber) {
    return {
        type: constants.RESET_TEAMS,
        data: teamNumber
    }
}

export function resetMembers(teamNumber) {
    return {
        type: constants.RESET_MEMBERS,
        data: teamNumber
    }
}

export function clearRdxTeam() {
    return {
        type: constants.CLEAR_STATES,
    }
}