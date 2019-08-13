import constants from '../constants';

const initialState = {
    team1: null,
    team2: null,
    selectedTeamMembers: [],

    //requests
    addingTeam: false,
    teamLoading: false,
    memberLoading: false,

    //failures
    teamError: false,
    memberError: false,
};

export default function Team(state = initialState, action) {
    const team = constants.team;
    const teamObj = action.payload && action.payload.team_number ? 'team'+action.payload.team_number : 'team1';
    switch(action.type) {
        //TEAM
        case team.ADD_TEAM_REQUEST:
            return {
                ...state,
                addingTeam: true,
            }
        case team.ADD_TEAM_SUCCESS:
            return {
                ...state,
                addingTeam: false,
                [teamObj]: action.payload,
                teamError: false,
            }
        case team.ADD_TEAM_FAILURE:
            return {
                ...state,
                addingTeam: false,
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
                [teamObj]: action.payload,
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
                [teamObj]: action.payload,
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
                [teamObj]: action.payload,
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
                [teamObj]: action.payload,
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