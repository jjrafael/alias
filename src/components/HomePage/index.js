import React from 'react';
import { connect } from 'react-redux';

// components
import Footer from './footer';
import SingleForm from '../forms/SingleForm';
import Board from '../common/Board';
import ModalSettings from '../modal/ModalSettings';

//misc
import {
	makeId, 
	getNow, 
	setLocalStorage,
	pluralizeString,
	randomNumber, 
	generateColor,
} from '../../utils';
import avatars from '../../config/avatars';

const mapStateToProps = state => {return {
	user: state.session.user,
	sessionDetails: state.session.sessionDetails,
}}

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentWillUnmount() {
		this.unListenData('all');
	}

	submitForm = (formData, teamNumber) => {
		const { addTeam, user, sessionDetails } = this.props;
		const { teamStatus } = this.state;
		const appId = sessionDetails ? sessionDetails.id : null;
		const r = randomNumber(50);
		const i = randomNumber(r);
		const data = {
			status: 'inactive',
			team_number: teamNumber,
			name: formData.name,
			total_score: 0,
			total_violations: 0,
			trophies: 0,
			game_key: makeId(),
			created_by: user.id,
			created_time: getNow(),
			app_id: appId,
			avatar: avatars[randomNumber(avatars.length)].id,
			color: generateColor(r, i),
		}
		this.setState({ 
			teamStatus: { ...teamStatus, [teamNumber]: 'adding'}
		});
		
		addTeam(data).then(doc =>{
			setLocalStorage('alias_team'+teamNumber+'Id', doc.response.id);
			this.setState({ teamStatus: { ...teamStatus, [teamNumber]: 'added'} });		
			this.listenData('Team'+teamNumber, doc.response.id);
		});
		
	}

	getMembers(members, teamNumber) {
		const team = this.props[`team${teamNumber}`];
		let arr = [];

		if(members.length){
			members.forEach((d, i) => {
				let avatar = avatars.filter(ava => ava.id === d.avatar);
				avatar =  !!avatar ? avatar[0] : null;
				if(d && d.name){
					arr.push({
						data: { ...d, avatarObj: avatar},
						type: 'members-card',
						className: '--team'+ teamNumber,
						backChildren: team && team.avatar ? 
							<i className={`icon icon-${team.avatar}`}></i> : ''
					});
				}
			})
		}

		return arr;
	}

	renderContent(index, data) {
		const { team1, team2, team1members, team2members } = this.props;
		const { teamStatus } = this.state;
		const team = index === 0 ? team1 : team2;
		const members = index === 0 ? team1members : team2members;
		const hasMembers = members && members.length;
		const teamNumber = team ? team.team_number : (Number(index) + 1);
		const isTeamAdded = teamStatus[data.teamNumber] === 'added';
		const isTeamAdding = teamStatus[data.teamNumber] === 'adding';
		const haveNewTeam = team && team.status === 'inactive';
		const haveConnectedTeam = team && team.status === 'active';
		const cxForm = haveConnectedTeam ? '' : 'active';
		const cxBoard = hasMembers ? 'active' : '';
		const cxTextOnly = isTeamAdded ? '--text-only' : '';
		const showEl = {
			members: hasMembers && !isTeamAdding && haveConnectedTeam,
			connectedNoMembers: !hasMembers && !isTeamAdding && haveConnectedTeam,
			form: !team,
			addingMsg: false,
			teamCode: haveNewTeam && !haveConnectedTeam,
		}
		
		return (
			<div className="col" data-team={teamNumber}>
				{ !showEl.form ?
					<div className="col-header group">
						<div className="heading-wrapper">
							<h2>{team.name}</h2>
							{ hasMembers ?
								members.length+' '+pluralizeString('member', members.length) : ''
							}
						</div>
					</div> : ''
				}
				<div className="col-body --center">
					{ showEl.form ?
						<SingleForm 
							formName={`add_team_${teamNumber}`}
							className={`${cxTextOnly} ${cxForm}`}
							onSubmit={this.submitForm} 
							input={data} 
							payloadKey="teamNumber"
							textOnly={isTeamAdded}/> : ''
					}
					{ showEl.addingMsg ?
						<div className="msg__adding-iteam">
							Initializing Team...
						</div> : ''
					}
					{ showEl.members ?
						<Board
							id={`boardTeam${teamNumber}Members`}
							data={this.getMembers(members, teamNumber)} 
							className={`--hor-scroll ${cxBoard}`} 
							type="cards"/> : ''
					}
					{ showEl.connectedNoMembers ?
						<div className="msg__connect-to-team">
							You're connected, add members:
							<h2>{team.game_key || '...'}</h2>
						</div> : ''
					}
					{ showEl.teamCode ?
						<div className="msg__connect-to-team">
							Connect thru Team Code:
							<h2>{team.game_key || '...'}</h2>
						</div> : ''
					}
				</div>
				<ModalSettings />
			</div>
		)
	}

	render() {
		const { turnOf } = this.props;
		const { inputData } = this.state;

		return (
		  <div className={`page-wrapper home-page`} data-team={turnOf}>
				<div className="col-2">
					{this.renderContent(0, inputData[0])}
					{this.renderContent(1, inputData[1])}
				</div>
				<Footer/>
		  </div>
		);
	}
}

export default connect(mapStateToProps)(HomePage);
