import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { shuffle } from 'lodash';

//Components
import Footer from './footer';
import Button from '../common/Button';
import Card from '../common/Card';
import ModalAliasLoading from '../modal/ModalAliasLoading';

// actions
import { toggleLoadingOverlay } from '../../actions/app';
import { setCardsOnGrid } from '../../actions/cards';
import { 
	addRound, 
	shiftTurn, 
	editRound, 
	listenRounds, 
	editGame 
} from '../../actions/games';

//misc
import { 
	randomNumber, 
	makeArrayFromIndexArray, 
	randomIndexArray, 
	bool,
	isResType,
	getNow,
} from '../../utils';
import { getActiveRound } from '../../utils/game';

const mapStateToProps = state => {return {
	settings: state.app.settings,
	turnOf: state.game.turnOf,
	gameDetails: state.game.gameDetails,
	rounds: state.game.rounds,
	team1: state.team.team1,
	team2: state.team.team2,
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
		  setCardsOnGrid,
		  toggleLoadingOverlay,
		  editRound,
		  listenRounds,
		  editGame
		},
		dispatch
	 )
}

class GridPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			initProgress: 0,
			activeRound: null,
			history: [],
			newAlias: null,
		}
	}

	componentDidMount(){
		const { gameDetails } = this.props;

		if(gameDetails){
			this.props.listenRounds(gameDetails.id);
		}
	}

	componentDidUpdate(prevProps, prevState){
		if(prevProps.rounds !== this.props.rounds){
			let activeRound = getActiveRound(this.props.rounds);
			activeRound = bool(activeRound) ? activeRound[0] : null;
			this.setState({ activeRound: activeRound });
		}

		if(prevState.activeRound !== this.state.activeRound){
			this.updateNewAlias(this.state.activeRound ? this.state.activeRound.alias : []);
		}

		if(prevProps.turnOf !== this.props.turnOf && this.props.gameDetails){
			this.editGame(this.props.gameDetails.id, {
				...this.props.gameDetails,
				turnOf: this.props.turnOf
			})
		}
	}

	updateNewAlias(data){
		const arr = bool(data) ? data.filter(d => d.new) : [];
		const alias = bool(arr) ? arr[0] : null;
		this.setState({ newAlias: alias });
	}

	shufflePlayingCards() {
		const { playingDecks, settings, toggleLoadingOverlay } = this.props;
		const cardsPerRound = settings.cards_per_round;
		let cards = [];
		playingDecks.forEach(d => {
			cards.push(...d.cards);
		});
		const cardsLen = cards.length < cardsPerRound ? cards.length : cardsPerRound;
		const indexArray = randomIndexArray(cards.length, cardsLen);
		const shuffled = makeArrayFromIndexArray(cards, indexArray);
		const assignedCards = this.assignedCards(shuffled);
		toggleLoadingOverlay(true, 'Shuffling Cards');
		if(bool(shuffled)){
			this.props.setCardsOnGrid(assignedCards);
		}
	}

	assignedCards(cards){
		const { settings } = this.props;
		const { cards_per_team, include_death_card, cards_per_round } = settings;
		const types = ['none', 'team1', 'team2'];
		let maxNone = cards_per_round - ( cards_per_team * 2 );
		let newTypes = types;
		let hasDeathCard = 0; //max of 1 if include_death_card
		let team1Count = 0; //max of cards_per_team
		let team2Count = 0; //max of cards_per_team
		let noneCount = 0;
		let newCards = [];

		if(include_death_card){
			newTypes.push('death');
			maxNone = maxNone - 1;
		}

		cards.forEach(d => {
			const clones = types.concat(types).concat(types);
			const shuffledTypes = shuffle(newTypes.concat(clones));
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
		const { gameDetails } = this.props;
		const team = randomNumber(2) + 1;
		this.props.shiftTurn(team);
		this.props.editGame(gameDetails.id, {
			...gameDetails,
			turnOf: team
		}).then(doc => {
			if(isResType(doc)){
				this.setState({ initProgress: 75 });
				this.initRound(cards, team);
			}
		});
	}

	pickLeader(team){
		const members = this.props[`team${team}members`];
		let leader = null;
		let num = 0;

		if(bool(members)){
			num = randomNumber(members.length);
			leader = members[num];
		}

		this.setState({ [`team${team}Leader`]: leader });
		return leader;
	}

	initRound(cards, team){
		const { gameDetails, toggleLoadingOverlay } = this.props;
		const team1Leader = this.pickLeader(1);
		const team2Leader = this.pickLeader(2);
		const data = {
			id: 'r1',
			playing_cards: cards,
			turn_of: team,
			team1: {
				score: 0,
				violations: 0,
				leader: team1Leader ? team1Leader.id : 'anyone',
			},
			team2: {
				score: 0,
				violations: 0,
				leader: team2Leader ? team2Leader.id : 'anyone',
			},
			status: 'active',
			alias: [],
			created_time: getNow(),
		}

		//Start first round
		this.props.addRound(gameDetails.id, 'r1', data).then(doc => {
			toggleLoadingOverlay();
			if(isResType(doc)){
				this.setState({ initProgress: 100 });
			}
		});
	}

	selectCard = (data) => {
		const { shiftTurn, editRound, gameDetails, rounds } = this.props;
		const { activeRound, newAlias } = this.state;
		const turnOf = gameDetails ? gameDetails.turnOf : null;
		const isTeam = data.type.indexOf('team') !== -1;
		const cardOf = isTeam ? data.type.split('team')[1] : null;
		const oppTeam = turnOf === 1 ? 2 : 1;
		const isCorrect = turnOf === Number(cardOf);
		const teamKey = isCorrect ? `team${turnOf}` : `team${oppTeam}`;
		const aliasToBeDone = !newAlias.left || newAlias.left === 1;
		const updAlias = aliasToBeDone ?
			activeRound.alias.map(d => {return {...d, new: false }})
			: activeRound.alias;
		let score = activeRound[teamKey].score + 1;
		let newHistory = {
				forAlias: newAlias,
				turnOf: turnOf,
				cardSelected: data,
				correct: isCorrect,
		}

		const roundData = {
			...activeRound,
			alias: updAlias,
			[teamKey]: {
				...activeRound[teamKey], score
			}
		}

		const roundsData = rounds.map(d => {
			return d.id === activeRound.id ? roundData : d;
		});

		if(!isCorrect){
			shiftTurn(oppTeam);
		}

		this.setState({
			history: [
				...this.state.history,
				newHistory
			],
			newAlias: aliasToBeDone	? null : {
				...this.state.newAlias,
				left: this.state.newAlias.left ? this.state.newAlias.left - 1 : 0
			}
		})

		editRound(gameDetails.id, activeRound.id, roundData , roundsData);
	}

	renderGrid() {
		const { team1, team2 } = this.props;
		const { activeRound, newAlias } = this.state;
		const cards = activeRound ? activeRound.playing_cards : [];
		let html = [];

		cards.forEach((d, i) => {
			let team = null;

			if(d.type === 'team1'){
				team = team1.name;
			}else if(d.type === 'team2'){
				team = team2.name;
			}

			html.push(
				<Card
          key={i}
          type="grid-card" 
          onClick={newAlias ? this.selectCard : null}
          data={{...d, team}}
          flipOver>
        </Card>
			)
		})

		return html;
	}

  render() {
  	const { gameDetails } = this.props;
  	const { activeRound, newAlias } = this.state;
  	const turnOf = gameDetails ? gameDetails.turnOf : null;
  	const gridReady = bool(activeRound) && bool(activeRound.playing_cards);
  	const cxPage = gridReady ? '--ingame': '';
  	const waitingForAlias = gridReady	&& !bool(newAlias);
  	
    return (
      <div className={`page-wrapper grid-page ${cxPage}`} data-team={turnOf}>
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
				<ModalAliasLoading show={waitingForAlias} team={turnOf}/>
				{ gridReady ?
					<Footer newAlias={newAlias} /> : ''
				}
		  </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GridPage);