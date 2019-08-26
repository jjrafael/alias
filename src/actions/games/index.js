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
    const ref = baseURL.users.doc(id);
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

export function clearRounds(id) {
    const ref = baseURL.games.doc(id).collection('rounds');
    return {
        types: [
            constants.ADD_ROUND_REQUEST,
            constants.ADD_ROUND_SUCCESS,
            constants.ADD_ROUND_FAILURE
        ],
        method: 'delete',
        data: [],
        callRef: ref,
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