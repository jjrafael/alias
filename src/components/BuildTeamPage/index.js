import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import SingleForm from '../forms/SingleForm';
import Board from '../common/Board';

//actions
import { addMember, listenMembers } from '../../actions/teams';
import { startGame, readGame } from '../../actions/games';
import { listenApp, toggleLoadingOverlay } from '../../actions/app';

//misc
import avatars from '../../config/avatars';
import { randomNumber, generateColor, getNow } from '../../utils';

const mapStateToProps = state => {return {
	team: state.team.team1 || state.team.team2 || null,
	members: state.team.team1members || state.team.team2members || [],
	user: state.app.user,
	appDetails: state.app.appDetails,
	gameDetails: state.app.gameDetails,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
	{
	  addMember,
	  startGame,
	  listenMembers,
	  listenApp,
	  readGame,
	  toggleLoadingOverlay
	},
	dispatch
  )
}

class BuildTeamPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			input: {
				id: 'name',
				type: 'text',
				placeholder: 'Inday',
				label: 'Member Name',
				showLabel: true,
				required: true,
				validations: ['charMax-10'],
				enableEnter: true,
			},
			teamNumber: null,
			members: [],
			listenApp: false,
		}
	}

	componentDidMount(){
		const { team, appDetails, gameDetails } = this.props;
		const inGame = gameDetails && gameDetails.status !== 'ended';
		if(team){
			this.setPage(team);
		}

		if(appDetails && appDetails.id){
			const currentGameId = appDetails.current_game_id;
			const sameGameId = inGame && currentGameId === gameDetails.id;
			if(!this.state.listenApp){
				this.listenData('App',appDetails.id);
			}
			if(currentGameId && (!gameDetails || !sameGameId)){
				this.newGame(appDetails.current_game_id);
			}
		}
	}

	componentDidUpdate(prevProps){
		if(!prevProps.team && this.props.team){
			this.setPage(this.props.team);
		}

		if(prevProps.members !== this.props.members){
			this.setState({ members: this.props.members });
		}

		if(prevProps.appDetails !== this.props.appDetails){
			const { appDetails } = this.props;
			if(!this.state.listenApp){
				this.listenData('App',appDetails.id);
			}
			if(prevProps.appDetails.current_game_id !== appDetails.current_game_id){
				this.newGame(appDetails.current_game_id);
			}
		}
	}

	listenData(type, id) {
		const key = 'listen'+type;
		if(!this.state[key]){
			this.setState({ [key]: true });
			if(type === 'App'){
				this.props.listenApp(id);
			}
		}
	}

	unListenData(type) {
		if(type === 'all'){
			this.setState({
				listenTeam1: false,
				listenTeam2: false,
			});
		}else{
			const key = 'listen'+type;
			this.setState({ [key]: false });
		}
	}

	newGame(id){
		if(id){
			this.props.toggleLoadingOverlay(true, 'Starting Game...');
			this.props.readGame(id).then(doc => {
				this.props.toggleLoadingOverlay();
			});
		}
	}

	setPage(team){
		const { team_number, id } = team;
		this.setState({ teamNumber: team_number });
		this.props.listenMembers(id, team_number);
	}

	submitForm = (formData) => {
		const { members, teamNumber } = this.state;
		const { team, addMember, user } = this.props;
		const { name } = formData;
		const r = randomNumber(50);
		const i = randomNumber(r);

		if(name && team){
			const data = {
				name,
				avatar: avatars[randomNumber(avatars.length)].id,
				color: generateColor(r, i),
				created_time: getNow(true),
				created_by: user.id
			}
			
			this.setState({ members: [...members, data] });
			addMember(team.id, data, teamNumber);
		}
	}

	getMembers() {
		const { team } = this.props;
		const { members } = this.state;
		const teamNumber = team && team.team_number;
		const cxTeam = '--team'+teamNumber;
		let arr = [];

		if(members.length){
			members.forEach((d, i) => {
				let avatar = avatars.filter(ava => ava.id === d.avatar);
				avatar =  !!avatar ? avatar[0] : null;
				if(d && d.name){
					arr.push({
						data: { ...d, avatarObj: avatar},
						type: 'members-card',
						className: cxTeam,
						frontChildren: d.name
					});
				}
			})
		}

		return arr;
	}

	render() {
		const { team } = this.props;
		const { input } = this.state;
		const members = this.getMembers();
		const hasMembers = members.length;
		const teamNumber = team && team.team_number;
		const cxBoard = hasMembers ? 'active' : '';

		return (
		  <div className={`page-wrapper build-team-page`} data-team={teamNumber}>
				<div className="page-inner">
					{ team &&
						<div className="heading-wrapper">
							<h2>{team.name}</h2>
						</div>
					}
					<Board
						data={members}
						className={`${cxBoard}`}
						type="bar"/>
					<SingleForm 
						formName={`build_team_${teamNumber}`}
						onSubmit={this.submitForm} 
						clearOnSubmit={true}
						input={input}/>
				</div>
		  </div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildTeamPage);
