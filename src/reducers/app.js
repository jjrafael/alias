import constants from '../constants';

const initialState = {
    appInitialized: false,
    gameKey: null,
    settings: {
        timer: 180000, //3mins default timer for team members
        leaderTimer: 0, //0 means no timer for leaders
        violationLimit: 5, //min of 5 violations to lose the game
        includeJinxCards: false,
        includeDeathCard: true,
        addMod: false,
        soundFx: false,
        music: false,
    },
    isAdmin: false,
    isCustom: false,
    selectedDecks: [],
    decks: [],
    loadingOverlay: false,

    //requests
    appInitializing: false,
    decksLoading: false,
    settingsLoading: false,

    //failures
    decksError: false,
    initializeError: false,
    settingsError: false,
};

export default function App(state = initialState, action) {
    const app = constants.app;
    switch(action.type) {
        //INITIALIZE_APP
        case app.INITIALIZE_APP_REQUEST:
            return {
                ...state,
                appInitializing: true,
            }
        case app.INITIALIZE_APP_SUCCESS:
            return {
                ...state,
                appInitializing: false,
                appInitialized: true,
                gameKey: action.response.data,
                initializeError: false,
            }
        case app.INITIALIZE_APP_FAILURE:
            return {
                ...state,
                appInitializing: false,
                initializeError: true,
            }

        //SETTINGS
        case app.EDIT_SETTINGS_REQUEST:
            return {
                ...state,
                settingsLoading: true,
            }
        case app.EDIT_SETTINGS_SUCCESS:
            return {
                ...state,
                settingsLoading: false,
                settings: action.response.data,
                settingsError: false,
            }
        case app.EDIT_SETTINGS_FAILURE:
            return {
                ...state,
                settingsLoading: false,
                settingsError: true,
            }

        //CUSTOM GAME
        case app.BROWSE_DECKS_REQUEST:
            return {
                ...state,
                decksLoading: true,
            }
        case app.BROWSE_DECKS_SUCCESS:
            return {
                ...state,
                decksLoading: false,
                decks: action.response.data,
                decksError: false,
            }
        case app.BROWSE_DECKS_FAILURE:
            return {
                ...state,
                decksLoading: false,
                decksError: true,
            }

        //NON-API
        case app.TOGGLE_LOADING_OVERLAY:
            return {
                ...state,
                loadingOverlay: !state.loadingOverlay,
            }

        default: 
            return state;
    }
}