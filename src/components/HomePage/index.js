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
	shiftTurn = () => {
		this.props.shiftTurn();
	}

	updateText = () => {

	}

	submitForm = (formData) => {
		console.log('jj submit: ', formData);
	}

	render() {
		const { turnOf, teams } = this.props;
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
		const inputData = {
			id: 'teamName',
			type: 'text',
			placeholder: 'Alpha',
			label: 'Team Name',
			showLabel: true,
			required: true,
			validations: ['charMax-10']
		}

	    return (
	      <div className={`page-wrapper home-page`} data-team={turnOf}>
	      	<div className="col-2">
	      		<div className="col --center" data-team="1">
	      			{ teams && teams[0] && teams[0].status === 'inactive' ?
	      				<div>Connect to TeamCode</div>
	      				: <SingleForm onSubmit={this.submitForm} input={inputData}/>
	      			}
	      		</div>
	      		<div className="col --center" data-team="2">
	      			{ teams && teams[1] && teams[0].status === 'inactive' ?
	      				<div>Connect to TeamCode</div>
	      				: <SingleForm onSubmit={this.submitForm} input={{...inputData, placeholder: 'Beta'}} />
	      			}
	      		</div>
	      	</div>
	      	<Footer options={footOptions}/>
	      </div>
	    );
  	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
