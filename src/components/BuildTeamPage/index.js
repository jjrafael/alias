import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';

//components
import Footer from '../Footer';
import SingleForm from '../forms/SingleForm';

//actions
import { addMember, editTeam } from '../../actions/teams';
import { startGame } from '../../actions/games';

//misc
import avatars from '../../config/avatars';
import { randomNumber, generateColor } from '../../utils';

const mapStateToProps = state => {return {
	team: state.team.team1 || state.team.team2 || null,
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
	},
	dispatch
  )
}

class BuildTeamPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			footOptions: {
				main: {
					text: 'Play',
					onClick: null,
				},
				copyright: false,
			},
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

	componentDidUpdate(prevProps){
		if(!prevProps.team && this.props.team){
			this.setState({ teamNumber: this.props.team.team_number });
		}
	}

	submitForm = (formData) => {
		const { members } = this.state;
		const { name } = formData;
		const r = randomNumber(50);
		const i = randomNumber(r);
		if(name){
			const data = {
				name,
				avatar: avatars[randomNumber(10)].id,
				color: generateColor(r, i)
			}

			this.setState({ members: [...members, data] });
		}
	}

	renderList() {
		const { members } = this.state;
		// const { team } = this.props;
		let html = [];

		if(members.length){
			members.forEach(d => {
				let avatar = avatars.filter(ava => ava.id === d.avatar);
				avatar = !!avatar ? avatar[0].label : 'No-avatar';
				html.push(
					<div style={{backgroundColor: d.color}} title={avatar}>{d.name}</div>
				)
			})
		}


		return html;
	}

	render() {
		const { user, team } = this.props;
		const { footOptions, input, members } = this.state;
		const hasActiveGame = false;
		const hasMembers = members.length;
		const teamNumber = team && team.team_number;
		const cxBoard = hasMembers ? 'active' : '';

		if(user.role === 'team'){
			return (
			  <div className={`page-wrapper build-team-page`} data-team={teamNumber}>
					<div className="page-inner">
						<div className={`board --cards ${cxBoard}`}>
							{this.renderList()}
						</div>
						<SingleForm 
							formName={`build_team_${teamNumber}`}
							onSubmit={this.submitForm} 
							clearOnSubmit={true}
							input={input}/>
					</div>
					<Footer options={footOptions}/>
			  </div>
			);
		}else{
			if(hasActiveGame){
				return <Redirect to="/leader"/>
			}else{
				return <Redirect to="/build-team"/>
			}
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildTeamPage);
