import constants from '../constants';
import { mergeArray } from '../utils/data';

const initialState = {
    rounds: [],
    turnOf: '',
    hasMod: false,
    modDetails: null,
    gameWinner: null,
    gameLoser: null,
    gameEnded: false,
    isPause: false,
    timesUp: false,
    gameDetails: null,

    //requests
    endingGame: false,
    resettingGame: false,
    restartingGame: false,
    roundLoading: false,
    modLoading: false,
    gameLoading: false,
    gameStarting: false,

    //failures
    endingError: false,
    resetError: false,
    restartError: false,
    roundError: false,
    modError: false,
    gameError: false,
};

export default function Game(state = initialState, action) {
    const { game } = constants;
    switch(action.type) {
        //ADD GAME
        case game.ADD_GAME_REQUEST:
            return {
                ...state,
                gameStarting: true,
            }
        case game.ADD_GAME_SUCCESS:
            return {
                ...state,
                gameStarting: false,
                gameDetails: {
                    ...action.payload,
                    id: action.response.id
                },
                gameError: false,
            }
        case game.ADD_GAME_FAILURE:
            return {
                ...state,
                gameStarting: false,
                gameError: true,
            }

        //END GAME
        case game.END_GAME_REQUEST:
            return {
                ...state,
                endingGame: true,
            }
        case game.END_GAME_SUCCESS:
            return {
                ...state,
                endingGame: false,
                gameKey: action.response.data,
                endingError: false,
            }
        case game.END_GAME_FAILURE:
            return {
                ...state,
                endingGame: false,
                endingError: true,
            }

        //RESET GAME
        case game.RESET_GAME_REQUEST:
            return {
                ...state,
                resettingGame: true,
            }
        case game.RESET_GAME_SUCCESS:
            return {
                ...state,
                resettingGame: false,
                resetError: false,
            }
        case game.RESET_GAME_FAILURE:
            return {
                ...state,
                resettingGame: false,
                resetError: true,
            }

        //RESET GAME
        case game.RESTART_GAME_REQUEST:
            return {
                ...state,
                restartingGame: true,
            }
        case game.RESTART_GAME_SUCCESS:
            return {
                ...state,
                restartingGame: false,
                restartError: false,
            }
        case game.RESTART_GAME_FAILURE:
            return {
                ...state,
                restartingGame: false,
                restartError: true,
            }

        //READ GAME
        case game.READ_GAME_REQUEST:
            return {
                ...state,
                gameLoading: true,
            }
        case game.READ_GAME_SUCCESS:
            return {
                ...state,
                gameLoading: false,
                gameDetails: {
                    ...action.response.data(),
                    id: action.response.id
                },
                gameError: false,
            }
        case game.READ_GAME_FAILURE:
            return {
                ...state,
                gameLoading: false,
                gameError: true,
            }

        case game.EDIT_GAME_REQUEST:
            return {
                ...state,
                gameLoading: true,
            }
        case game.EDIT_GAME_SUCCESS:
            const isStopped = action.payload.status === 'stopped';
            return {
                ...state,
                gameDetails: isStopped ? null : action.payload,
                gameLoading: false,
                gameError: false,
            }
        case game.EDIT_GAME_FAILURE:
            return {
                ...state,
                gameLoading: false,
                gameError: true,
            }
        case game.DELETE_GAME_REQUEST:
            return {
                ...state,
                gameLoading: true,
            }
        case game.DELETE_GAME_SUCCESS:
            return {
                ...state,
                gameLoading: false,
                gameDetails: null,
                gameError: false,
            }
        case game.DELETE_GAME_FAILURE:
            return {
                ...state,
                gameLoading: false,
                gameError: true,
            }

        //LISTEN
        case game.LISTEN_GAME_REQUEST:
            return {
                ...state,
                gameLoading: true,
            }
        case game.LISTEN_GAME_SUCCESS:
            const LISTEN_GAME_val = action.response.data();
            const isPause = LISTEN_GAME_val ? LISTEN_GAME_val.is_pause : state.isPause;
            return {
                ...state,
                gameLoading: false,
                gameError: false,
                isPause: isPause,
                gameDetails: {
                    ...action.response.data(),
                    id: action.response.id
                }
            }
        case game.LISTEN_GAME_FAILURE:
            return {
                ...state,
                gameLoading: false,
                gameError: true,
            }


        //ROUNDS
        case game.ADD_ROUND_REQUEST:
            return {
                ...state,
                roundLoading: true,
            }
        case game.ADD_ROUND_SUCCESS:
            let ADD_ROUND_val = mergeArray(state.rounds, action.payload, true);
            return {
                ...state,
                roundLoading: false,
                rounds: ADD_ROUND_val,
                roundError: false,
            }
        case game.ADD_ROUND_FAILURE:
            return {
                ...state,
                roundLoading: false,
                roundError: action.error,
            }
        case game.EDIT_ROUND_REQUEST:
            return {
                ...state,
                roundLoading: true,
            }
        case game.EDIT_ROUND_SUCCESS:
            return {
                ...state,
                roundLoading: false,
                rounds: action.payload,
                roundError: false,
            }
        case game.EDIT_ROUND_FAILURE:
            return {
                ...state,
                roundLoading: false,
                roundError: true,
            }

        case game.DELETE_ROUNDS_REQUEST:
            return {
                ...state,
                roundLoading: true,
            }
        case game.DELETE_ROUNDS_SUCCESS:
            return {
                ...state,
                roundLoading: false,
                roundError: false,
                rounds: []
            }
        case game.DELETE_ROUNDS_FAILURE:
            return {
                ...state,
                roundLoading: false,
                roundError: true,
            }

        case game.LISTEN_ROUNDS_REQUEST:
            return {
                ...state,
                roundLoading: true,
            }
        case game.LISTEN_ROUNDS_SUCCESS:
            let LISTEN_ROUNDS_val = mergeArray(state.rounds, action.response, true);
            return {
                ...state,
                roundLoading: false,
                roundError: false,
                rounds: LISTEN_ROUNDS_val
            }
        case game.LISTEN_ROUNDS_FAILURE:
            return {
                ...state,
                roundLoading: false,
                roundError: true,
            }


        //MOD
        case game.ADD_MOD_REQUEST:
            return {
                ...state,
                modLoading: true,
            }
        case game.ADD_MOD_SUCCESS:
            return {
                ...state,
                modLoading: false,
                modDetails: action.response.data,
                modError: false,
            }
        case game.ADD_MOD_FAILURE:
            return {
                ...state,
                modLoading: false,
                modError: true,
            }
        case game.DELETE_MOD_REQUEST:
            return {
                ...state,
                modLoading: true,
            }
        case game.DELETE_MOD_SUCCESS:
            return {
                ...state,
                modLoading: false,
                modDetails: null,
                modError: false,
            }
        case game.DELETE_MOD_FAILURE:
            return {
                ...state,
                modLoading: false,
                modError: true,
            }

        //CONCLUSION
        case game.EDIT_CONCLUSION_REQUEST:
            return {
                ...state,
                gameLoading: true,
            }
        case game.EDIT_CONCLUSION_SUCCESS:
            return {
                ...state,
                gameLoading: false,
                gameError: false,
            }
        case game.EDIT_CONCLUSION_FAILURE:
            return {
                ...state,
                gameLoading: false,
                gameError: true,
            }

        //NON-API
        case game.SET_GAME:
            return {
                ...state,
                gameDetails: action.data,
            }
        case game.SHIFT_TURN:
            const SHIFT_TURN_val = action.data ||
                (state.turnOf === '1' ? '2' : '1')
            return {
                ...state,
                gameDetails: state.gameDetails ?
                    {  
                        ...state.gameDetails,
                        turnOf: SHIFT_TURN_val
                    } : null,
                turnOf: SHIFT_TURN_val,
            }
        case game.CLEAR_ROUNDS:
            return {
                ...state,
                rounds: [],
            }
        case game.PAUSE_GAME:
            return {
                ...state,
                isPause: true
            }
        case game.RESUME_GAME:
            return {
                ...state,
                isPause: false
            }
        case game.SET_TIMES_UP:
            return {
                ...state,
                timesUp: action.data
            }

        //SIGNOUT
        case game.CLEAR_STATES:
            return {
                ...state,
                rounds: null,
                turnOf: '',
                hasMod: false,
                modDetails: null,
                gameWinner: null,
                gameLoser: null,
                gameEnded: false,
                isPause: false,
                gameDetails: null,
            }

        default: 
            return state;
    }
}