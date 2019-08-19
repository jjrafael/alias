import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import SingleForm from '../forms/SingleForm';

//actions
import { addMember, editTeam, listenMembers } from '../../actions/teams';
import { startGame } from '../../actions/games';

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
	  editTeam,
	  startGame,
	  listenMembers,
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
		}
	}

	componentDidMount(){
		if(this.props.team){
			this.setPage(this.props.team);
		}
	}

	componentDidUpdate(prevProps){
		if(!prevProps.team && this.props.team){
			this.setPage(this.props.team);
		}

		if(prevProps.members !== this.props.members){
			this.setState({ members: this.props.members });
		}
	}

	setPage(team){
		const { team_number, id } = team;
		this.setState({ teamNumber: team_number });
		this.props.listenMembers(id, team_number);
	}

	submitForm = (formData) => {
		const { members, teamNumber } = this.state;
		const { team, addMember } = this.props;
		const { name } = formData;
		const r = randomNumber(50);
		const i = randomNumber(r);

		if(name && team){
			const data = {
				name,
				avatar: avatars[randomNumber(10)].id,
				color: generateColor(r, i),
				created_time: getNow(true),
			}
			
			this.setState({ members: [...members, data] });
			addMember(team.id, data, teamNumber);
		}
	}

	renderList() {
		const { members } = this.state;
		let html = [];

		if(members.length){
			members.forEach((d, i) => {
				let avatar = avatars.filter(ava => ava.id === d.avatar);
				avatar = !!avatar && avatar[0] ? avatar[0].label : 'No-avatar';
				if(d && d.name){
					html.push(
						<div className="board__card" key={i} style={{backgroundColor: d.color}} title={avatar}>{d.name}</div>
					)
				}
			})
		}

		return html;
	}

	render() {
		const { team } = this.props;
		const { input, members } = this.state;
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
					<div className={`board --cards ${cxBoard}`}>
						{this.renderList()}
					</div>
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
