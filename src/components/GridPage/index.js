import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { shuffle } from 'lodash';

//Components
import Footer from './footer';
import Button from '../common/Button';

// actions
import { setCardsOnGrid } from '../../actions/cards';
import { addRound, shiftTurn } from '../../actions/games';

//misc
import { 
	randomNumber, 
	makeArrayFromIndexArray, 
	randomIndexArray, 
	bool,
	isResType
} from '../../utils';

const mapStateToProps = state => {return {
	settings: state.app.settings,
	turnOf: state.game.turnOf,
	gameDetails: state.game.gameDetails,
	rounds: state.game.rounds,
	gridCards: state.game.gridCards,
	team1members: state.team.team1members,
	team2members: state.team.team2members,
	playingDecks: state.cards.playingDecks,
	cardsOnGrid: state.cards.cardsOnGrid,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
		  addRound,
		  shiftTurn,
		  setCardsOnGrid
		},
		dispatch
	 )
}

class GridPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			initProgress: 0,
		}
	}

	shufflePlayingCards() {
		const { playingDecks, settings } = this.props;
		const cardsPerRound = settings.cards_per_round;
		let cards = [];
		playingDecks.forEach(d => {
			cards.push(...d.cards);
		});
		const cardsLen = cards.length < cardsPerRound ? cards.length : cardsPerRound;
		const indexArray = randomIndexArray(cards.length, cardsLen);
		const shuffled = makeArrayFromIndexArray(cards, indexArray);
		const assignedCards = this.assignedCards(shuffled);

		if(bool(shuffled)){
			this.props.setCardsOnGrid(assignedCards);
		}
	}

	assignedCards(cards){
		const { settings } = this.props;
		const { cards_per_team, include_death_card, cards_per_round } = settings;
		let maxNone = cards_per_round - ( cards_per_team * 2 );
		let types = ['none', 'team1', 'team2'];
		let hasDeathCard = 0; //max of 1 if include_death_card
		let team1Count = 0; //max of cards_per_team
		let team2Count = 0; //max of cards_per_team
		let noneCount = 0;
		let newCards = [];

		if(include_death_card){
			types.push('death');
			maxNone = maxNone - 1;
		}

		cards.forEach(d => {
			const shuffledTypes = shuffle(types);
			let assigned = false;
			let type = 'none';
			
			shuffledTypes.forEach(d => {
				if(!assigned){
					if(d === 'team1' && team1Count !== cards_per_team){
						type = d;
						team1Count++;
						assigned = true;
					}else if(d === 'team2' && team2Count !== cards_per_team){
						type = d;
						team2Count++;
						assigned = true;
					}else if(d === 'none' && noneCount !== maxNone){
						type = d;
						noneCount++;
						assigned = true;
					}else if(include_death_card && d === 'death' && hasDeathCard !== 1){
						type = d;
						hasDeathCard++;
						assigned = true;
					}
				}
			});

			newCards.push({...d, type})
		})
		
		this.setState({ initProgress: 50 });
		this.pickTeam(newCards);
		return newCards;
	}

	pickTeam(cards){
		const team = randomNumber(2) + 1;
		this.props.shiftTurn(team);
		this.setState({ initProgress: 65 });
		this.startRound(cards, team);
	}

	startRound(cards, team){
		const { gameDetails } = this.props;
		const data = {
			playing_cards: cards,
			turn_of: team,
			team1_score: 0,
			team2_score: 0,
			team1_violations: 0,
			team2_violations: 0,
			status: 'active',
		}

		//Start first round
		this.props.addRound(gameDetails.id, 'r1', data).then(doc => {
			if(isResType(doc)){
				this.setState({ initProgress: 100 });
			}
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
						<div className="start-round-wrapper">
							<h4>Pick team leader randomly, and start round!</h4>
							<Button className="--pick-leader" text={'Start'} onClick={this.shufflePlayingCards.bind(this)}/>
						</div>
					}
				</div>
				{ gridReady ?
					<Footer/> : ''
				}
		  </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GridPage);