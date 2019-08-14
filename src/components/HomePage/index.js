import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// components
import Footer from '../Footer';
import SingleForm from '../forms/SingleForm';

// actions
import { shiftTurn } from '../../actions/games';
import { addTeam } from '../../actions/teams';

//misc
import { makeId, getNow } from '../../utils';

const mapStateToProps = state => {return {
	turnOf: state.game.turnOf,
	team1: state.team.team1,
	team2: state.team.team2,
	addingTeam: state.team.addingTeam,
	user: state.app.user,
	appDetails: state.app.appDetails
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      shiftTurn,
      addTeam
    },
    dispatch
  )
}

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			textOnly: {
				1: false,
				2: false,
			},
		}
	}

	componentDidUpdate(prevProps){
		if(prevProps.team1 !== this.props.team1){
			//updated
		}
	}

	shiftTurn = () => {
		this.props.shiftTurn();
	}

	submitForm = (formData, teamNumber) => {
		const { addTeam, user, appDetails } = this.props;
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
			textOnly: { ...this.state.textOnly, [teamNumber]: true}
		});
		
		addTeam(data);
	}

	renderForm(index, data) {
		const { team1, team2, addingTeam } = this.props;
		const { textOnly } = this.state;
		const team = index === 0 ? team1 : team2;
		const teamNumber = team ? team.team_number : (Number(index) + 1);
		const isTextOnly = textOnly[data.teamNumber];
		const haveNewTeam = team && team.status === 'inactive';
		const haveConnectedTeam = team && team.status === 'active';
		
		return (
			<div className="col --center" data-team={teamNumber}>
				<SingleForm 
					formName={`add_team_${teamNumber}`}
  					className={isTextOnly ? '--text-only' : ''}
  					onSubmit={this.submitForm} 
  					input={data} 
  					payloadKey="teamNumber"
  					textOnly={isTextOnly}/>
      			{ haveNewTeam && !haveConnectedTeam &&
      				<div className="msg__connect-to-team">Connect to Team Code:
      					<h2>{team.game_key || '...'}</h2>
      				</div>
      			}
      			{ addingTeam && !haveConnectedTeam &&
      				<div className="team-grid">
      					Initializing Team...
      				</div>
      			}
      			{ haveNewTeam && !addingTeam && haveConnectedTeam &&
      				<div>Add members</div>
      			}
      		</div>
		)
	}

	render() {
		const { turnOf } = this.props;
		const footOptions = {
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
		}
		const inputData = [
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

	    return (
	      <div className={`page-wrapper home-page`} data-team={turnOf}>
	      	<div className="col-2">
	      		{this.renderForm(0, inputData[0])}
	      		{this.renderForm(1, inputData[1])}
	      	</div>
	      	<Footer options={footOptions}/>
	      </div>
	    );
  	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
