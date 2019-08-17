import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// components
import Footer from '../Footer';
import SingleForm from '../forms/SingleForm';

// actions
import { shiftTurn } from '../../actions/games';
import { addTeam, readTeam, listenTeam } from '../../actions/teams';

//misc
import { 
	makeId, 
	getNow, 
	setLocalStorage, 
	getAllLocalStorage,
	getResponse,
	deleteLocalStorage,
} from '../../utils';

const mapStateToProps = state => {return {
	turnOf: state.game.turnOf,
	team1: state.team.team1,
	team2: state.team.team2,
	addingTeam: state.team.addingTeam,
	user: state.app.user,
	appDetails: state.app.appDetails,
	gameDetails: state.app.gameDetails,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
	{
	  shiftTurn,
	  addTeam,
	  readTeam,
	  listenTeam
	},
	dispatch
  )
}

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			listenTeam1: false,
			listenTeam2: false,
			teamStatus: {
				1: '',
				2: '',
			},
			footOptions: {
				main: {
					text: 'Play',
					onClick: null,
				},
				left: {
					text: 'Settings',
					onClick: null,
				},
				right: {
					text: 'Decks',
					onClick: null,
				},
				copyright: false,
			},
			inputData: [
				{
					id: 'name',
					type: 'text',
					placeholder: 'Alpha',
					label: 'Team Name',
					showLabel: true,
					required: true,
					value: 'Alpha',
					validations: ['charMax-10'],
					teamNumber: 1,
					enableEnter: true,
				},
				{
					id: 'name',
					type: 'text',
					placeholder: 'Beta',
					label: 'Team Name',
					showLabel: true,
					required: true,
					value: 'Beta',
					validations: ['charMax-10'],
					teamNumber: 2,
					enableEnter: true,
				},
			]
		}
	}

	componentDidMount(){
		const { team1Id, team2Id } = getAllLocalStorage();
		if(team1Id){
			this.checkActiveTeam(1, team1Id);
		}

		if(team2Id){
			this.checkActiveTeam(2, team2Id);
		}
	}

	componentWillUnmount() {
		this.unListenData('all');
	}

	checkActiveTeam(teamNumber, id) {
		this.props.readTeam(id).then(doc => {
			const response = getResponse(doc);
			const arr = ['active', 'inactive'];
			if(response && arr.indexOf(response.status) !== -1){
				//team is either not existing or unavailable
				this.listenData('Team'+teamNumber, id);
			}else{
				//team is either not existing or unavailable
				deleteLocalStorage('alias_team'+teamNumber+'Id');
			}
		})
	}

	shiftTurn = () => {
		this.props.shiftTurn();
	}

	listenData(type, id) {
		const key = 'listen'+type;
		if(!this.state[key]){
			this.setState({ key: true });
			if(['Team1', 'Team2'].indexOf(type) !== -1){
				this.props.listenTeam(id);
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

	submitForm = (formData, teamNumber) => {
		const { addTeam, user, appDetails } = this.props;
		const { teamStatus } = this.state;
		const appId = appDetails ? appDetails.id : null;
		const data = {
			status: 'inactive',
			team_number: teamNumber,
			name: formData.name,
			total_score: 0,
			total_violations: 0,
			game_key: makeId(),
			created_by: user.id,
			created_time: getNow(),
			app_id: appId
		}
		this.setState({ 
			teamStatus: { ...teamStatus, [teamNumber]: 'adding'}
		});
		
		addTeam(data).then(doc => {
			setLocalStorage('alias_team'+teamNumber+'Id', doc.response.id);
			this.setState({ 
				teamStatus: { ...teamStatus, [teamNumber]: 'added'},
			});
			
			this.listenData('Team'+teamNumber, doc.response.id);
		});
		
	}

	renderContent(index, data) {
		const { team1, team2 } = this.props;
		const { teamStatus } = this.state;
		const team = index === 0 ? team1 : team2;
		const teamNumber = team ? team.team_number : (Number(index) + 1);
		const isTeamAdded = teamStatus[data.teamNumber] === 'added';
		const isTeamAdding = teamStatus[data.teamNumber] === 'adding';
		const haveNewTeam = team && team.status === 'inactive';
		const haveConnectedTeam = team && team.status === 'active';
		const members = team ? team.members : null;
		const cxForm = haveConnectedTeam ? '' : 'active';
		const cxBoard = members ? 'active' : '';
		const cxTextOnly = isTeamAdded ? '--text-only' : '';
		const showEl = {
			members: team && !isTeamAdded && haveConnectedTeam,
			form: !team,
			addingMsg: isTeamAdding && !haveConnectedTeam,
			teamCode: haveNewTeam && !haveConnectedTeam,
		}
		
		return (
			<div className="col --center" data-team={teamNumber}>
				{ showEl.form ?
					<SingleForm 
						formName={`add_team_${teamNumber}`}
						className={`${cxTextOnly} ${cxForm}`}
						onSubmit={this.submitForm} 
						input={data} 
						payloadKey="teamNumber"
						textOnly={isTeamAdded}/> :
					<div className="col__header">
						<h2>{team.name}</h2>
						{members ? members+' members' : ''}
					</div>
				}
				{ showEl.addingMsg &&
					<div className="msg__adding-iteam">
						Initializing Team...
					</div>
				}
				{ showEl.members && members &&
					<div className={`board --cards ${cxBoard}`}>
						Members here
					</div>
				}
				{ showEl.members && !members &&
					<div className="msg__connect-to-team">
						You're connected, add members:
						<h2>{team.game_key || '...'}</h2>
					</div>
				}
				{ showEl.teamCode &&
					<div className="msg__connect-to-team">
						Connect to Team Code:
						<h2>{team.game_key || '...'}</h2>
					</div>
				}
			</div>
		)
	}

	render() {
		const { turnOf, gameDetails } = this.props;
		const { footOptions, inputData } = this.state;

		return (
		  <div className={`page-wrapper home-page`} data-team={turnOf}>
				<div className="col-2">
					{this.renderContent(0, inputData[0])}
					{this.renderContent(1, inputData[1])}
				</div>
				<Footer options={footOptions}/>
		  </div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
