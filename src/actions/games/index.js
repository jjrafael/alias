import constants from '../../constants/game';
import { baseURL } from '../../Firebase';

export function startGame(data) {
    const ref = baseURL.games;
    return {
        types: [
            constants.ADD_GAME_REQUEST,
            constants.ADD_GAME_SUCCESS,
            constants.ADD_GAME_FAILURE
        ],
        method: 'add',
        data,
        callRef: ref,
    }
}

export function readGame(id) {
    const ref = baseURL.games.doc(id);
    return {
        types: [
            constants.READ_GAME_REQUEST,
            constants.READ_GAME_SUCCESS,
            constants.READ_GAME_FAILURE
        ],
        method: 'get',
        callRef: ref,
    }
}

export function editGame(id, data) {
    const ref = baseURL.games.doc(id);
    return {
        types: [
            constants.EDIT_GAME_REQUEST,
            constants.EDIT_GAME_SUCCESS,
            constants.EDIT_GAME_FAILURE
        ],
        method: 'set',
        data,
        callRef: ref,
    }
}

export function deleteGame(id) {
    const ref = baseURL.games.doc(id);
    return {
        types: [
            constants.DELETE_GAME_REQUEST,
            constants.DELETE_GAME_SUCCESS,
            constants.DELETE_GAME_FAILURE
        ],
        method: 'delete',
        callRef: ref,
    }
}

export function listenGame(id) {
    const ref = baseURL.games.doc(id);
    const listenData = {
        returnData: true
    }
    return {
        types: [
            constants.LISTEN_GAME_REQUEST,
            constants.LISTEN_GAME_SUCCESS,
            constants.LISTEN_GAME_FAILURE
        ],
        method: 'listen',
        callRef: ref,
        listenData,
    }
}

export function pauseGame(id, data) {
    const ref = baseURL.games.doc(id);
    return {
        types: [
            constants.PAUSE_GAME_REQUEST,
            constants.PAUSE_GAME_SUCCESS,
            constants.PAUSE_GAME_FAILURE
        ],
        method: 'set',
        data,
        callRef: ref,
    }
}

export function resumeGame(id, data) {
    const ref = baseURL.games.doc(id);
    return {
        types: [
            constants.RESUME_GAME_REQUEST,
            constants.RESUME_GAME_SUCCESS,
            constants.RESUME_GAME_FAILURE
        ],
        method: 'set',
        data,
        callRef: ref,
    }
}

// ROUNDS
export function addRound(id, roundId, data) {
    const ref = baseURL.games.doc(id).collection('rounds').doc(roundId);
    return {
        types: [
            constants.ADD_ROUND_REQUEST,
            constants.ADD_ROUND_SUCCESS,
            constants.ADD_ROUND_FAILURE
        ],
        method: 'set',
        data,
        callRef: ref,
    }
}

export function editRound(id, roundId, data, rounds) {
    const ref = baseURL.games.doc(id).collection('rounds').doc(roundId);
    return {
        types: [
            constants.EDIT_ROUND_REQUEST,
            constants.EDIT_ROUND_SUCCESS,
            constants.EDIT_ROUND_FAILURE
        ],
        method: 'set',
        data,
        overPayload: rounds,
        callRef: ref,
    }
}

export function deleteRounds(id) {
    const ref = `/games/${id}/rounds`;
    return {
        types: [
            constants.DELETE_ROUNDS_REQUEST,
            constants.DELETE_ROUNDS_SUCCESS,
            constants.DELETE_ROUNDS_FAILURE
        ],
        method: 'deleteAll',
        callRef: ref,
    }
}

export function listenRounds(id) {
    const ref = baseURL.games.doc(id).collection('rounds');
    const listenData = {
        returnData: true,
        isColl: true,
    }
    return {
        types: [
            constants.LISTEN_ROUNDS_REQUEST,
            constants.LISTEN_ROUNDS_SUCCESS,
            constants.LISTEN_ROUNDS_FAILURE
        ],
        method: 'listenBrowse',
        callRef: ref,
        listenData,
    }
}

//NON-API
export function setGame(data) {
    return {
        type: constants.SET_GAME,
        data,
    }
}

export function shiftTurn(data) {
    return {
        type: constants.SHIFT_TURN,
        data,
    }
}

export function clearRdxGame() {
    return {
        type: constants.CLEAR_STATES,
    }
}

export function setIsCustom() {
    return {
        type: constants.SET_IS_CUSTOM,
    }
}

export function clearRounds() {
    return {
        type: constants.CLEAR_ROUNDS,
    }
}