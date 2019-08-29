import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Components
import Footer from './footer';

// actions
import { listenGame, listenRounds } from '../../actions/games';

//misc
import { bool } from '../../utils';
import { getActiveRound } from '../../utils/game';

const mapStateToProps = state => {return {
	team: state.team.team1 || state.team.team2 || null,
	turnOf: state.game.turnOf,
	gameDetails: state.game.gameDetails,
	rounds: state.game.rounds,
	team1members: state.team.team1members,
	team2members: state.team.team2members,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
		  listenGame, 
		  listenRounds,
		},
		dispatch
	 )
}

class LeaderPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cardsForTeam: [],
			activeRound: null,
			deathCard: null
		}
	}

	componentDidMount(){
		const { gameDetails } = this.props;
		
		if(gameDetails){
			this.props.listenGame(gameDetails.id);
			this.props.listenRounds(gameDetails.id);
		}
	}

	componentDidUpdate(prevProps){
		if(prevProps.rounds !== this.props.rounds && this.props.rounds){
			let activeRound = getActiveRound(this.props.rounds);
			activeRound = bool(activeRound) ? activeRound[0] : null;
			this.setState({ activeRound });
			this.getCardsForTeam(activeRound.playing_cards);
		}
	}

	getCardsForTeam(data){
		const teamNumber = this.props.team.team_number;
		let cards = [];
		let deathCard = null;

		if(bool(data) && teamNumber){
			cards = data.filter(d => d.type === 'team'+teamNumber);
			deathCard = data.filter(d => d.type === 'death');
			deathCard = bool(deathCard) ? deathCard[0] : null; 
		}

		this.setState({
			cardsForTeam: cards,
			deathCard,
		});
	}

  render() {
  	const { turnOf, rounds } = this.props;
  	const { cardsForTeam } = this.state;
  	const gridReady = bool(rounds) && bool(cardsForTeam);
  	
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