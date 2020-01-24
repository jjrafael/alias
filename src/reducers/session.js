import constants from '../constants';

const initialState = {
    deviceDetails: {
        platform: null,
        device: null,
        browser: null,
    },
    gameKey: null,
    settings: {
        timer: 3, //3mins default timer for team members
        leader_timer: 0, //0 means no timer for leaders
        violation_limit: 5, //min of 5 violations to lose the game
        include_jinx_cards: false,
        include_death_card: true,
        show_death_on_leader: false,
        add_mod: false,
        soundFx: false,
        music: false,
        winning_score: 3,
        cards_per_team: 8,
        cards_per_round: 25,
    },
    sessionDetails: null,
    user: null,
    userType: 'player',
    selectedDecks: [],
    decks: [],
    loading: {
        show: false,
        title: 'Loading...'
    },
    warningModal: {
        show: false,
        message: 'Encountered an issue, please try again later.',
        title: 'Warning!',
        type: 'warning',
    },

    //requests
    sessionInitializing: false,
    decksLoading: false,
    settingsLoading: false,
    addingUser: false,
    userLoading: false,
    sessionLoading: false,

    //failures
    decksError: false,
    initializeError: false,
    settingsError: false,
    userError: false,
    sessionError: false,

    //modals
    showModalSignout: false,
    showModalResetGame: false,
    showModalRestartGame: false,
    showModalResetTeam: false,
    showModalEnterCode: false,
    showModalRoundWinner: false,
    showModalQuitGame: false,
    showModalReportAlias: false,
    showModalAliasHistory: false,
    showModalSettings: false,
    showModalAboutDev: false,
};

export default function Session(state = initialState, action) {
    const { session } = constants;
    switch(action.type) {
        //INITIALIZE_SESSION
        case session.INITIALIZE_SESSION_REQUEST:
            return {
                ...state,
                sessionInitializing: true,
            }
        case session.INITIALIZE_SESSION_SUCCESS:
            return {
                ...state,
                sessionInitializing: false,
                sessionDetails: {
                    ...action.payload,
                    id: action.response.id,
                },
                gameKey: action.response.data,
                initializeError: false,
            }
        case session.INITIALIZE_SESSION_FAILURE:
            return {
                ...state,
                sessionInitializing: false,
                initializeError: action.error,
            }

        //READ session
        case session.READ_SESSION_REQUEST:
            return {
                ...state,
                readingSession: true,
            }
        case session.READ_SESSION_SUCCESS:
            const data_read = action.notStateSave
                ?   state.sessionDetails
                : { ...action.response.data(),
                    id: action.response.id }
            return {
                ...state,
                readingSession: false,
                sessionDetails: data_read,
                initializeError: false,
            }
        case session.READ_SESSION_FAILURE:
            return {
                ...state,
                readingSession: false,
                initializeError: true,
            }

        case session.EDIT_SESSION_REQUEST:
            return {
                ...state,
                sessionLoading: true,
            }
        case session.EDIT_SESSION_SUCCESS:
            const isEnd = action.payload.status === 'inactive';
            let data_edit = state.sessionDetails;

            if(!action.notStateSave){
                data_edit = isEnd ? null : action.payload
            }

            return {
                ...state,
                sessionLoading: false,
                sessionError: false,
                sessionDetails: data_edit
            }
        case session.EDIT_SESSION_FAILURE:
            return {
                ...state,
                sessionLoading: false,
                sessionError: true,
            }
         case session.LISTEN_SESSION_REQUEST:
            return {
                ...state,
                teamLoading: true,
            }
        case session.LISTEN_SESSION_SUCCESS:
            const LISTEN_SESSION = {
                ...action.response.data(),
                id: action.response.id
            };
            return {
                ...state,
                teamLoading: false,
                teamError: false,
                sessionDetails: LISTEN_SESSION
            }
        case session.LISTEN_SESSION_FAILURE:
            return {
                ...state,
                teamLoading: false,
                teamError: true,
            }

        //USER
        case session.ADD_USER_REQUEST:
            return {
                ...state,
                addingUser: true,
            }
        case session.ADD_USER_SUCCESS:
            return {
                ...state,
                addingUser: false,
                user: {
                    ...action.payload,
                    id: action.response.id
                },
                userError: false,
            }
        case session.ADD_USER_FAILURE:
            return {
                ...state,
                addingUser: false,
                userError: action.error,
            }
        
        case session.READ_USER_REQUEST:
            return {
                ...state,
                readingSession: true,
            }
        case session.READ_USER_SUCCESS:
            return {
                ...state,
                readingSession: false,
                user: {
                    ...action.response.data(),
                    id: action.response.id,
                    isCache: action.isCache
                },
                initializeError: false,
            }
        case session.READ_USER_FAILURE:
            return {
                ...state,
                readingSession: false,
                initializeError: action.error,
            }

        case session.EDIT_USER_REQUEST:
            return {
                ...state,
                userLoading: true,
            }
        case session.EDIT_USER_SUCCESS:
            const isSignedOut = action.payload.status === 'signed_out';
            return {
                ...state,
                userLoading: false,
                userError: false,
                user: isSignedOut ? null : action.payload
            }
        case session.EDIT_USER_FAILURE:
            return {
                ...state,
                userLoading: false,
                userError: true,
            }

        //SETTINGS
        case session.EDIT_SETTINGS_REQUEST:
            return {
                ...state,
                settingsLoading: true,
            }
        case session.EDIT_SETTINGS_SUCCESS:
            return {
                ...state,
                settingsLoading: false,
                settings: action.response.data,
                settingsError: false,
            }
        case session.EDIT_SETTINGS_FAILURE:
            return {
                ...state,
                settingsLoading: false,
                settingsError: true,
            }

        //CUSTOM GAME
        case session.BROWSE_DECKS_REQUEST:
            return {
                ...state,
                decksLoading: true,
            }
        case session.BROWSE_DECKS_SUCCESS:
            return {
                ...state,
                decksLoading: false,
                decks: action.response.data,
                decksError: false,
            }
        case session.BROWSE_DECKS_FAILURE:
            return {
                ...state,
                decksLoading: false,
                decksError: true,
            }

        //NON-API
        case session.TOGGLE_LOADING_OVERLAY:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    ...action.data,
                },
            }

        case session.TOGGLE_WARNING_MODAL:
            return {
                ...state,
                warningModal: {
                    ...state.warningModal,
                    ...action.data,
                },
            }
        
        case session.SET_DEVICE_DETAILS:
            return {
                ...state,
                deviceDetails: action.data,
            }

        case session.SET_SESSION:
            return {
                ...state,
                sessionDetails: action.data,
            }

        case session.SET_SETTINGS:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    ...action.data
                },
            }

        case session.MODAL_TOGGLE_SIGNOUT:
            return {
                ...state,
                showModalSignout: action.data,
            }

        case session.MODAL_TOGGLE_RESET_GAME:
            return {
                ...state,
                showModalResetGame: action.data,
            }

        case session.MODAL_TOGGLE_RESET_TEAM:
            return {
                ...state,
                showModalResetTeam: action.data,
            }

        case session.MODAL_TOGGLE_RESTART_GAME:
            return {
                ...state,
                showModalRestartGame: action.data,
            }
        case session.MODAL_TOGGLE_ENTER_CODE:
            return {
                ...state,
                showModalEnterCode: action.data,
            }
        case session.MODAL_TOGGLE_ROUND_WINNER:
            return {
                ...state,
                showModalRoundWinner: action.data,
            }
        case session.MODAL_TOGGLE_QUIT_GAME:
            return {
                ...state,
                showModalQuitGame: action.data,
            }
        case session.MODAL_TOGGLE_REPORT_ALIAS:
            return {
                ...state,
                showModalReportAlias: action.data,
            }
        case session.MODAL_TOGGLE_ALIAS_HISTORY:
            return {
                ...state,
                showModalAliasHistory: action.data,
            }
        case session.MODAL_TOGGLE_SETTINGS:
            return {
                ...state,
                showModalSettings: action.data,
            }
        case session.MODAL_TOGGLE_HOW_PLAY:
            return {
                ...state,
                showModalHowToPlay: action.data,
            }
        case session.MODAL_TOGGLE_ABOUT_DEV:
            return {
                ...state,
                showModalAboutDev: action.data,
            }


        //SIGNOUT
        case session.CLEAR_STATES:
            return {
                ...state,
                gameKey: null,
                sessionDetails: null,
                user: null,
                userType: 'player',
                selectedDecks: [],
                decks: [],
                showModalSignout: false,
                showModalResetGame: false,
                showModalRestartGame: false,
                showModalResetTeam: false,
                showModalEnterCode: false,
                showModalRoundWinner: false,
                showModalQuitGame: false,
                showModalReportAlias: false,
                showModalAliasHistory: false,
                showModalSettings: false,
                showModalAboutDev: false,
            }

        default: 
            return state;
    }
}