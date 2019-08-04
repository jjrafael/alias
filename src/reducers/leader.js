import constants from '../constants';

const initialState = {
    leaders: [],
    selectedLeader: null,
    selectedLeaderClues: [],
    aliasTimer: null,

    //requests
    leaderLoading: false,
    aliasLoading: false,
    reportingClue: false,

    //failures
    leaderError: false,
    aliasError: false,
    reportError: false,
};

export default function Leader(state = initialState, action) {
    const leader = constants.leader;
    switch(action.type) {
        //LEADER
        case leader.ADD_LEADER_REQUEST:
            return {
                ...state,
                leaderLoading: true,
            }
        case leader.ADD_LEADER_SUCCESS:
            return {
                ...state,
                leaderLoading: false,
                leaders: action.response.data,
                leaderError: false,
            }
        case leader.ADD_LEADER_FAILURE:
            return {
                ...state,
                leaderLoading: false,
                leaderError: true,
            }

        case leader.EDIT_LEADER_REQUEST:
            return {
                ...state,
                leaderLoading: true,
            }
        case leader.EDIT_LEADER_SUCCESS:
            return {
                ...state,
                leaderLoading: false,
                leaders: action.response.data,
                leaderError: false,
            }
        case leader.EDIT_LEADER_FAILURE:
            return {
                ...state,
                leaderLoading: false,
                leaderError: true,
            }

        case leader.READ_LEADER_REQUEST:
            return {
                ...state,
                leaderLoading: true,
            }
        case leader.READ_LEADER_SUCCESS:
            return {
                ...state,
                leaderLoading: false,
                selectedLeader: action.response.data,
                leaderError: false,
            }
        case leader.READ_LEADER_FAILURE:
            return {
                ...state,
                leaderLoading: false,
                leaderError: true,
            }

        //ALIAS
        case leader.ADD_ALIAS_REQUEST:
            return {
                ...state,
                aliasLoading: true,
            }
        case leader.ADD_ALIAS_SUCCESS:
            return {
                ...state,
                aliasLoading: false,
                leaders: action.response.data,
                aliasError: false,
            }
        case leader.ADD_ALIAS_FAILURE:
            return {
                ...state,
                aliasLoading: false,
                aliasError: true,
            }

        case leader.EDIT_ALIAS_REQUEST:
            return {
                ...state,
                aliasLoading: true,
            }
        case leader.EDIT_ALIAS_SUCCESS:
            return {
                ...state,
                aliasLoading: false,
                leaders: action.response.data,
                aliasError: false,
            }
        case leader.EDIT_ALIAS_FAILURE:
            return {
                ...state,
                aliasLoading: false,
                aliasError: true,
            }

        case leader.BROWSE_ALIAS_REQUEST:
            return {
                ...state,
                aliasLoading: true,
            }
        case leader.BROWSE_ALIAS_SUCCESS:
            return {
                ...state,
                aliasLoading: false,
                selectedLeaderClues: action.response.data,
                aliasError: false,
            }
        case leader.BROWSE_ALIAS_FAILURE:
            return {
                ...state,
                aliasLoading: false,
                aliasError: true,
            }

        case leader.REPORT_ALIAS_REQUEST:
            return {
                ...state,
                reportingClue: true,
            }
        case leader.REPORT_ALIAS_SUCCESS:
            return {
                ...state,
                reportingClue: false,
                leaders: action.response.data,
                reportError: false,
            }
        case leader.REPORT_ALIAS_FAILURE:
            return {
                ...state,
                reportingClue: false,
                reportError: true,
            }

        default: 
            return state;
    }
}