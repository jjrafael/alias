import constants from '../../constants/game';
import { baseURL } from '../../Firebase';

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

//NON-API
export function setGame(data) {
    return {
        type: constants.SET_GAME,
        data,
    }
}

export function shiftTurn() {
    return {
        type: constants.SHIFT_TURN,
    }
}
