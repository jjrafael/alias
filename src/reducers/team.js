import constants from '../constants';

const initialState = {
    team1: null,
    team2: null,
    selectedTeamMembers: [],

    //requests
    addingTeam: false,
    teamLoading: false,
    memberLoading: false,
    verifyingTeamCode: false,

    //failures
    teamError: false,
    memberError: false,
    teamCodeError: false,
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

        case team.READ_TEAM_REQUEST:
            return {
                ...state,
                teamLoading: true,
            }
        case team.READ_TEAM_SUCCESS:
            const data_read = action.notStateSave
                ?   state.appDetails
                : { ...action.response.data(),
                    id: action.response.id }
            const team_number = data_read && data_read.team_number;
            return {
                ...state,
                teamLoading: false,
                teamError: false,
                ['team'+team_number]: data_read
            }
        case team.READ_TEAM_FAILURE:
            return {
                ...state,
                teamLoading: false,
                teamError: true,
            }
        case team.LISTEN_TEAM_REQUEST:
            return {
                ...state,
                teamLoading: true,
            }
        case team.LISTEN_TEAM_SUCCESS:
            const listen_team = action.notStateSave
                ?   state.appDetails
                : { ...action.response.data(),
                    id: action.response.id }
            const listen_team_number = listen_team && listen_team.team_number;
            return {
                ...state,
                teamLoading: false,
                teamError: false,
                ['team'+listen_team_number]: listen_team
            }
        case team.LISTEN_TEAM_FAILURE:
            return {
                ...state,
                teamLoading: false,
                teamError: true,
            }

        //TEAM CODE
        case team.VERIFY_TEAM_CODE_REQUEST:
            return {
                ...state,
                verifyingTeamCode: true,
            }
        case team.VERIFY_TEAM_CODE_SUCCESS:
            return {
                ...state,
                verifyingTeamCode: false,
                teamCodeError: false,
            }
        case team.VERIFY_TEAM_CODE_FAILURE:
            return {
                ...state,
                verifyingTeamCode: false,
                teamCodeError: true,
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

        //NON-API
        case team.RESET_TEAMS:
            if(action.data && action.data.teamNumber){
                return {
                    ...state,
                    team1: action.data.teamNumber === 1 ? null : state.team1,
                    team2: action.data.teamNumber === 2 ? null : state.team2,
                }
            }else{
                return {
                    ...state,
                    team1: null,
                    team2: null,
                }
            }

        default: 
            return state;
    }
}