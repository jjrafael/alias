import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Components
import Footer from './footer';
import Button from '../common/Button';

// actions
import { addRound, shiftTurn } from '../../actions/games';

//misc
import { randomNumber } from '../../utils';

const mapStateToProps = state => {return {
	turnOf: state.game.turnOf,
	gameDetails: state.game.gameDetails,
	rounds: state.game.rounds,
	gridCards: state.game.gridCards,
	team1members: state.team.team1members,
	team2members: state.team.team2members,
	cardsOnGrid: state.cards.cardsOnGrid,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
		  addRound,
		  shiftTurn
		},
		dispatch
	 )
}

class GridPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	pickTeam(){
		const { gameDetails, cardsOnGrid } = this.props;
		const team = randomNumber(2);
		this.props.shiftTurn(team);
		//Start first round
		this.props.addRound(gameDetails.id, 'r1', {
			playing_cards: cardsOnGrid,
			turn_of: team,
			team1_score: 0,
			team2_score: 0,
			team1_violations: 0,
			team2_violations: 0,
			status: 'active',
		});
	}

	renderGrid() {
		const { gridCards } = this.props;
		let html = [];

		gridCards.forEach((d, i) => {
			html.push(
				<div className="card" key={i}>
					<div className="card__back" key={i}>Back</div>
					<div className="card__front" key={i}>Front</div>
				</div>
			)
		})

		return html;
	}

  render() {
  	const { turnOf, gridCards, rounds } = this.props;
  	const gridReady = rounds && !!gridCards;

    return (
      <div className={`page-wrapper grid-page`} data-team={turnOf}>
				<div className="page-inner">
					{ gridReady ?
						<div className={`grid`}>
							{this.renderGrid()}
						</div> :
						<div>
							<h4>Pick team leader randomly, and start round!</h4>
							<Button className="--pick-leader" text={'Start'} onClick={this.pickTeam.bind(this)}/>
						</div>
					}
				</div>
				<Footer/>
		  </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GridPage);