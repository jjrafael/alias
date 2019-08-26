import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Components
import Footer from './footer';

// actions
import { addRound } from '../../actions/games';

const mapStateToProps = state => {return {
	turnOf: state.game.turnOf,
	gameDetails: state.game.gameDetails,
	rounds: state.game.rounds,
	gridCards: state.game.gridCards,
	team1members: state.team.team1members,
	team2members: state.team.team2members,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
		  addRound,
		},
		dispatch
	 )
}

class LeaderPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cardsForTeam: [],
		}
	}

	componentDidUpdate(prevProps){
		if(prevProps.gridCards !== this.props.gridCards){
			this.setState({ cardsForTeam: this.props.gridCards });
		}
	}

  render() {
  	const { turnOf, cardsForTeam, rounds } = this.props;
  	const gridReady = rounds && !!cardsForTeam;

    return (
      <div className={`page-wrapper grid-page`} data-team={turnOf}>
				<div className="page-inner">
					{gridReady ? 'Submit Alias' : 'Preparing Game...'}
				</div>
				<Footer/>
		  </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderPage);