import { unionBy } from 'lodash';
import constants from '../constants';

const initialState = {
    team1: null,
    team2: null,
    team1members: [],
    team2members: [],
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
    const { team } = constants;
    let teamObj = action.payload && action.payload.team_number
        ? 'team'+action.payload.team_number : 'team1';
    let teamMemberObj = action.team_number && action.team_number
        ? 'team'+action.team_number+'members' : 'team1members';
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
            teamObj = 'team'+data_read.team_number;
            return {
                ...state,
                teamLoading: false,
                teamError: false,
                [teamObj]: data_read
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
            teamObj = 'team'+listen_team.team_number;
            return {
                ...state,
                teamLoading: false,
                teamError: false,
                [teamObj]: listen_team
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
            teamMemberObj = 'team'+action.team_number+'members';
            const ADD_MEMBER_val = unionBy( state[teamMemberObj],
                    [{...action.payload, id: action.response.id}], 'id')
            return {
                ...state,
                memberLoading: false,
                [teamMemberObj]: ADD_MEMBER_val,
                memberError: false,
            }
        case team.ADD_MEMBER_FAILURE:
            return {
                ...state,
                memberLoading: false,
                memberError: true,
            }

        case team.EDIT_MEMBER_REQUEST:
            return {
                ...state,
                memberLoading: true,
            }
        case team.EDIT_MEMBER_SUCCESS:
            teamMemberObj = 'team'+action.team_number+'members';
            return {
                ...state,
                memberLoading: false,
                [teamMemberObj]: [
                    ...state[teamMemberObj],
                    action.response.data(),
                ],
                memberError: false,
            }
        case team.EDIT_MEMBER_FAILURE:
            return {
                ...state,
                memberLoading: false,
                memberError: true,
            }

        case team.BROWSE_MEMBER_REQUEST:
            return {
                ...state,
                memberLoading: true,
            }
        case team.BROWSE_MEMBER_SUCCESS:
        teamMemberObj = 'team'+action.team_number+'members';
            return {
                ...state,
                memberLoading: false,
                [teamMemberObj]: action.response,
                memberError: false,
            }
        case team.BROWSE_MEMBER_FAILURE:
            return {
                ...state,
                memberLoading: false,
                memberError: true,
            }

        case team.LISTEN_MEMBER_REQUEST:
            return {
                ...state,
                teamLoading: true,
            }
        case team.LISTEN_MEMBER_SUCCESS:
            teamMemberObj = 'team'+action.team_number+'members';
            const LISTEN_MEMBER_val = unionBy(state[teamMemberObj], action.response, 'id')
            return {
                ...state,
                teamLoading: false,
                teamError: false,
                [teamMemberObj]: LISTEN_MEMBER_val
            }
        case team.LISTEN_MEMBER_FAILURE:
            return {
                ...state,
                teamLoading: false,
                teamError: true,
            }

        //NON-API
        case team.RESET_TEAMS:
            if(action.data && action.data){
                return {
                    ...state,
                    team1: action.data === 1 ? null : state.team1,
                    team2: action.data === 2 ? null : state.team2,
                }
            }else{
                return {
                    ...state,
                    team1: null,
                    team2: null,
                }
            }

        case team.RESET_MEMBERS:
            if(action.data && action.data){
                return {
                    ...state,
                    team1members: action.data === 1 ? null : state.team1members,
                    team2members: action.data === 2 ? null : state.team2members,
                }
            }else{
                return {
                    ...state,
                    team1members: null,
                    team2members: null,
                }
            }

        //SIGNOUT
        case team.CLEAR_STATES:
            return {
                ...state,
                team1: null,
                team2: null,
                team1members: [],
                team2members: [],
                selectedTeamMembers: [],
            }

        default: 
            return state;
    }
}