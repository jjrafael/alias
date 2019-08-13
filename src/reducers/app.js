import constants from '../constants';

const initialState = {
    deviceDetails: {
        platform: null,
        device: null,
        browser: null,
    },
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
    appDetails: null,
    user: null,
    isCustom: false,
    selectedDecks: [],
    decks: [],
    loading: {
        show: false,
        title: 'Loading...'
    },

    //requests
    appInitializing: false,
    decksLoading: false,
    settingsLoading: false,
    addingUser: false,

    //failures
    decksError: false,
    initializeError: false,
    settingsError: false,
    userError: false,
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
                appDetails: {
                    ...action.payload,
                    id: action.response.id,
                },
                gameKey: action.response.data,
                initializeError: false,
            }
        case app.INITIALIZE_APP_FAILURE:
            return {
                ...state,
                appInitializing: false,
                initializeError: true,
            }

        //READ APP
        case app.READ_APP_REQUEST:
            return {
                ...state,
                readingApp: true,
            }
        case app.READ_APP_SUCCESS:
            return {
                ...state,
                readingApp: false,
                appDetails: {
                    ...action.response.data(),
                    id: action.response.id,
                },
                initializeError: false,
            }
        case app.READ_APP_FAILURE:
            return {
                ...state,
                readingApp: false,
                initializeError: true,
            }

        //INITIALIZE USER
        case app.ADD_USER_REQUEST:
            return {
                ...state,
                addingUser: true,
            }
        case app.ADD_USER_SUCCESS:
            return {
                ...state,
                addingUser: false,
                user: {
                    ...action.payload,
                    id: action.response.id
                },
                userError: false,
            }
        case app.ADD_USER_FAILURE:
            return {
                ...state,
                addingUser: false,
                userError: true,
            }
        //READ APP
        case app.READ_USER_REQUEST:
            return {
                ...state,
                readingApp: true,
            }
        case app.READ_USER_SUCCESS:
            return {
                ...state,
                readingApp: false,
                user: {
                    ...action.response.data(),
                    id: action.response.id,
                    isCache: action.isCache
                },
                initializeError: false,
            }
        case app.READ_USER_FAILURE:
            return {
                ...state,
                readingApp: false,
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
                loading: {
                    ...state.loading,
                    ...action.data,
                },
            }
        
        case app.SET_DEVICE_DETAILS:
            return {
                ...state,
                deviceDetails: action.data,
            }

        case app.SET_APP:
            return {
                ...state,
                appDetails: action.data,
            }

        default: 
            return state;
    }
}