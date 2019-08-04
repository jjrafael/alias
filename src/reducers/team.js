import constants from '../constants';

const initialState = {
    teams: [],
    selectedTeamMembers: [],

    //requests
    teamLoading: false,
    memberLoading: false,

    //failures
    teamError: false,
    memberError: false,
};

export default function Team(state = initialState, action) {
    const team = constants.team;
    switch(action.type) {
        //TEAM
        case team.ADD_TEAM_REQUEST:
            return {
                ...state,
                teamLoading: true,
            }
        case team.ADD_TEAM_SUCCESS:
            return {
                ...state,
                teamLoading: false,
                teams: action.response.data,
                teamError: false,
            }
        case team.ADD_TEAM_FAILURE:
            return {
                ...state,
                teamLoading: false,
                teamError: true,
            }

        case team.EDIT_TEAM_REQUEST:
            return {
                ...state,
                teamLoading: true,
            }
        case team.EDIT_TEAM_SUCCESS:
            return {
                ...state,
                teamLoading: false,
                teams: action.response.data,
                teamError: false,
            }
        case team.EDIT_TEAM_FAILURE:
            return {
                ...state,
                teamLoading: false,
                teamError: true,
            }

        case team.BROWSE_TEAM_REQUEST:
            return {
                ...state,
                teamLoading: true,
            }
        case team.BROWSE_TEAM_SUCCESS:
            return {
                ...state,
                teamLoading: false,
                teams: action.response.data,
                teamError: false,
            }
        case team.BROWSE_TEAM_FAILURE:
            return {
                ...state,
                teamLoading: false,
                teamError: true,
            }

        //MEMBER
        case team.ADD_MEMBER_REQUEST:
            return {
                ...state,
                memberLoading: true,
            }
        case team.ADD_MEMBER_SUCCESS:
            return {
                ...state,
                memberLoading: false,
                teams: action.response.data,
                clueError: false,
            }
        case team.ADD_MEMBER_FAILURE:
            return {
                ...state,
                clueLoading: false,
                clueError: true,
            }

        case team.EDIT_MEMBER_REQUEST:
            return {
                ...state,
                memberLoading: true,
            }
        case team.EDIT_MEMBER_SUCCESS:
            return {
                ...state,
                memberLoading: false,
                teams: action.response.data,
                clueError: false,
            }
        case team.EDIT_MEMBER_FAILURE:
            return {
                ...state,
                clueLoading: false,
                clueError: true,
            }

        case team.BROWSE_MEMBER_REQUEST:
            return {
                ...state,
                memberLoading: true,
            }
        case team.BROWSE_MEMBER_SUCCESS:
            return {
                ...state,
                memberLoading: false,
                selectedTeamMembers: action.response.data,
                clueError: false,
            }
        case team.BROWSE_MEMBER_FAILURE:
            return {
                ...state,
                clueLoading: false,
                clueError: true,
            }

        default: 
            return state;
    }
}