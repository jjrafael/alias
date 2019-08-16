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
		}
	}

	submitForm = (formData) => {
		const data = {
			name: formData.name,
			avatar: 'bear',
			color: 'yellow'
		}
	}

	render() {
		const { user, team } = this.props;
		const { footOptions, input } = this.state;
		const hasActiveGame = false;
		const teamNumber = team && team.team_number;

		if(user.role === 'team'){
			return (
			  <div className={`page-wrapper build-team-page`}>
					<div className="page-inner">
						<SingleForm 
							formName={`build_team_${teamNumber}`}
							onSubmit={this.submitForm} 
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
