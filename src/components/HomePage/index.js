import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// components
import Footer from '../Footer';
import SingleForm from '../forms/SingleForm';

// actions
import { shiftTurn } from '../../actions/games';

const mapStateToProps = state => {return {
	turnOf: state.game.turnOf,
	teams: state.team.teams,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      shiftTurn
    },
    dispatch
  )
}

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			textOnly: false,
		}
	}
	shiftTurn = () => {
		this.props.shiftTurn();
	}

	updateText = () => {

	}

	submitForm = (formData) => {
		console.log('jj submit: ', formData);
		this.setState({ textOnly: true });
	}

	renderForm(index) {
		const { teams } = this.props;
		const { textOnly } = this.state;
		const team = teams ? teams[index] : null;
		const teamNumber = team ? team.team_number : (Number(index) + 1);
		const inputData = [
			{
				id: 'teamName',
				type: 'text',
				placeholder: 'Alpha',
				label: 'Team Name',
				showLabel: true,
				required: true,
				value: 'Alpha',
				validations: ['charMax-10']
			},
			{
				id: 'teamName',
				type: 'text',
				placeholder: 'Beta',
				label: 'Team Name',
				showLabel: true,
				required: true,
				value: 'Beta',
				validations: ['charMax-10']
			},
		]
		
		return (
			<div className="col --center" data-team={teamNumber}>
      			{ teams && team && team.status === 'inactive' ?
      				<div>Connect to TeamCode:
      					<h2>CODE1234</h2>
      				</div>
      				: <SingleForm 
      					className={textOnly ? '--text-only' : ''}
      					onSubmit={this.submitForm} 
      					input={inputData[index]} 
      					textOnly={textOnly}/>
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

	    return (
	      <div className={`page-wrapper home-page`} data-team={turnOf}>
	      	<div className="col-2">
	      		{this.renderForm(0)}
	      		{this.renderForm(1)}
	      	</div>
	      	<Footer options={footOptions}/>
	      </div>
	    );
  	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
