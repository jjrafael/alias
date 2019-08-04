import constants from '../constants';

const initialState = {
    rounds: [],
    hasMod: false,
    ModDetails: null,
    gameWinner: null,
    gameLoser: null,
    gameEnded: false,
    isPause: false,

    //requests
    endingGame: false,
    resettingGame: false,
    restartingGame: false,
    roundLoading: false,
    modLoading: false,
    gameLoading: false,

    //failures
    endingError: false,
    resetError: false,
    restartError: false,
    roundError: false,
    modError: false,
    gameError: false,
};

export default function Game(state = initialState, action) {
    const game = constants.game;
    switch(action.type) {
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
                appInitialized: true,
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

        //PAUSE GAME
        case game.PAUSE_GAME_REQUEST:
            return {
                ...state,
                gameLoading: true,
            }
        case game.PAUSE_GAME_SUCCESS:
            return {
                ...state,
                gameLoading: false,
                isPause: true,
                gameError: false,
            }
        case game.PAUSE_GAME_FAILURE:
            return {
                ...state,
                gameLoading: false,
                gameError: true,
            }

        //RESUME GAME
        case game.RESUME_GAME_REQUEST:
            return {
                ...state,
                gameLoading: true,
            }
        case game.RESUME_GAME_SUCCESS:
            return {
                ...state,
                gameLoading: false,
                isPause: false,
                gameError: false,
            }
        case game.RESUME_GAME_FAILURE:
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
            return {
                ...state,
                roundLoading: false,
                rounds: action.response.data,
                roundError: false,
            }
        case game.ADD_ROUND_FAILURE:
            return {
                ...state,
                roundLoading: false,
                roundError: true,
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
                rounds: action.response.data,
                roundError: false,
            }
        case game.EDIT_ROUND_FAILURE:
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
                hasMod: true,
                ModDetails: action.response.data,
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
                hasMod: false,
                ModDetails: null,
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

        default: 
            return state;
    }
}