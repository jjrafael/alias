import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { shuffle, find, isEqual, sortBy } from 'lodash';

//Components
import Footer from './footer';
import Button from '../common/Button';
import Card from '../common/Card';
import ModalAliasLoading from '../modal/ModalAliasLoading';
import ModalRoundWinner from '../modal/ModalRoundWinner';
import ModalQuitGame from '../modal/ModalQuitGame';
import ModalRestartGame from '../modal/ModalRestartGame';

// actions
import { toggleLoadingOverlay, toggleRoundWinnerModal } from '../../actions/app';
import { setCardsOnGrid, setPlayingDecks } from '../../actions/cards';
import { editTeam } from '../../actions/teams';
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
	reduce
} from '../../utils';
import { 
	getLastRound,
	getActiveRound,
	getTotalViolations,
	getCardsPerType
} from '../../utils/game';

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
	decks: state.cards.decks,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
		  addRound,
		  shiftTurn,
		  setCardsOnGrid,
		  setPlayingDecks,
		  toggleLoadingOverlay,
		  toggleRoundWinnerModal,
		  editRound,
		  listenRounds,
		  editGame,
		  editTeam
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
			showWaitingModal: false,
			roundEndResult: null,
		}
	}

	componentDidMount(){
		const { gameDetails, playingDecks, decks } = this.props;

		if(gameDetails){
			this.props.listenRounds(gameDetails.id);
		}
		
		if(gameDetails && bool(gameDetails.decks)
			&& bool(decks) && bool(playingDecks)){
			const currentDecks	= reduce(playingDecks, 'accum', 'id');
			const sameArr = isEqual(sortBy(gameDetails.decks), sortBy(currentDecks));
			if(!sameArr){
				const arr = gameDetails.decks.map(d => find(decks, ['id', d]));
				this.props.setPlayingDecks(arr);
			}
		}
	}

	componentDidUpdate(prevProps, prevState){
		if(prevProps.rounds !== this.props.rounds){
			const activeRound = getActiveRound(this.props.rounds, true);
			const isSame = (activeRound && prevState.activeRound) &&
				(activeRound.id === prevState.activeRound.id);
			this.setState({
				roundEndResult: isSame ? prevState.roundEndResult : null,
				activeRound
			});
		}

		if(prevState.activeRound !== this.state.activeRound && !this.state.roundEndResult){
			this.setNewAlias(this.state.activeRound ? this.state.activeRound.alias : []);
		}

		if(prevProps.turnOf !== this.props.turnOf && this.props.gameDetails){
			this.props.editGame(this.props.gameDetails.id, {
				...this.props.gameDetails,
				turnOf: this.props.turnOf
			})
		}
	}

	componentWillUnmount(){
		this.props.toggleLoadingOverlay();
		this.props.toggleRoundWinnerModal(null);
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

			newCards.push({...d, type});
		})
		
		this.setState({ initProgress: 50 });
		this.initRound(newCards);
		return newCards;
	}

	pickTeam(cards){
		const { gameDetails } = this.props;
		const team = randomNumber(2) + 1;

		this.props.editGame(gameDetails.id, {
			...gameDetails,
			turnOf: team
		}).then(doc => {
			if(isResType(doc)){
				this.setState({ initProgress: 75 });
				this.props.shiftTurn(team);
				this.firstRound(cards, team);
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

	initRound(cards){
		const { rounds } = this.props;
		const lastRound = getLastRound(rounds);
		const isNext = lastRound && lastRound.id !== 'r1'

		if(isNext){
			this.nextRound(cards);
		}else{
			this.pickTeam(cards);
		}
	}

	nextRound(cards){
		const { gameDetails, toggleLoadingOverlay } = this.props;
		const team1Leader = this.pickLeader(1);
		const team2Leader = this.pickLeader(2);
		const data = {
			id: 'r1',
			round_number: 1,
			playing_cards: cards,
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

	firstRound(cards){
		const { gameDetails, toggleLoadingOverlay } = this.props;
		const team1Leader = this.pickLeader(1);
		const team2Leader = this.pickLeader(2);
		const data = {
			id: 'r1',
			round_number: 1,
			playing_cards: cards,
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
		const { shiftTurn, editRound, gameDetails, rounds, settings, cardsOnGrid } = this.props;
		const { activeRound, newAlias } = this.state;
		const turnOf = gameDetails ? gameDetails.turnOf : null;
		const teamCards = getCardsPerType(cardsOnGrid, `team${turnOf}`);
		const cardsPerTeam = teamCards.length || settings.cards_per_team;
		const isTeam = data.type.indexOf('team') !== -1;
		const cardOf = isTeam ? data.type.split('team')[1] : null;
		const oppTeam = Number(turnOf) === 1 ? 2 : 1;
		const isCorrect = turnOf === Number(cardOf);
		const teamKey = isCorrect ? `team${turnOf}` : `team${oppTeam}`;
		const aliasToBeDone = newAlias.count === 1 || newAlias.left === 1;
		const score = isTeam ? activeRound[teamKey].score + 1 : activeRound[teamKey].score;
		const reachedGoal = score === cardsPerTeam;
		const isWin = reachedGoal && isCorrect;
		const isDeath = data.type === 'death';
		const isLose = isDeath  || (reachedGoal && !isCorrect);
		let updAlias = [];
		let updCards = [];
		let newHistory = {};
		let roundData = {};
		let roundsData = [];
		
		updAlias = aliasToBeDone ?
			activeRound.alias.map(d => {
				return {
					...d,
					new: false,
					left: 0
				}
			})
		: activeRound.alias.map(d => {
				return {
					...d,
					left: d.left ? d.left - 1 : 0
				}
			});

		updCards = activeRound.playing_cards.map(d => {
			return d.id === data.id && d.text === data.text ? {
				...d,
				revealed: true,
				revealed_by_team: turnOf
			} : d;
		})

		newHistory = {
			forAlias: newAlias,
			turnOf: turnOf,
			cardSelected: data,
			correct: isCorrect,
		}

		roundData = {
			...activeRound,
			alias: updAlias,
			playing_cards: updCards,
			[teamKey]: {
				...activeRound[teamKey], score
			}
		}

		roundsData = rounds.map(d => {
			return d.id === activeRound.id ? roundData : d;
		});

		this.updateNewAlias(aliasToBeDone);
		this.updateHistory(newHistory);
		editRound(gameDetails.id, activeRound.id, roundData , roundsData);

		if(isWin || isLose){
			const team = isWin ? [turnOf, oppTeam] : [oppTeam, turnOf];
			this.endRound(team[0], team[1], isDeath);
		}else if(!isCorrect){
			shiftTurn(oppTeam);
		}
	}

	updateHistory(data){
		this.setState({
			history: [
				...this.state.history, data
			]
		})
	}

	setNewAlias(data){
		const arr = bool(data) ? data.filter(d => d.new) : [];
		const alias = bool(arr) ? arr[0] : null;
		this.setState({ newAlias: alias });
	}

	updateNewAlias(isDone){
		const { newAlias } = this.state;
		const data = isDone	? null : {
			...newAlias,
			left: newAlias.left ? newAlias.left - 1 : 0
		}

		this.setState({
			newAlias: data,
		})
	}

	endRound(winTeam, loseTeam, isDeath){
		const { settings, gameDetails, rounds } = this.props;
		const { activeRound } = this.state;
		const winKey = `team${winTeam}`;
		const loseKey = `team${loseTeam}`;
		const opponent = activeRound[loseKey];
		let roundData = {};
		let roundsData = [];
		let result = {
			winner: {
				score: settings.cards_per_team,
				team: this.props[`team${winTeam}`]
			},
			loser: {
				score: opponent.score,
				team: this.props[`team${loseTeam}`]
			},
			isDeath: isDeath
		}

		roundData = {
			...activeRound,
			end_time: getNow(),
			status: 'end',
			winner: winTeam,
		}

		roundsData = rounds.map(d => {
			return d.id === activeRound.id ? roundData : d;
		});

		this.props.editRound(
			gameDetails.id, 
			activeRound.id, 
			roundData,
			roundsData,
		)
		
		this.setState({
			isDeath: isDeath,
			endRound: true,
		});
		this.props.shiftTurn(0);
		setTimeout(() => {
			this.setState({
				roundEndResult: result,
				isDeath: false,
				endRound: false,
			});
			this.props.toggleRoundWinnerModal(result);
			this.props.shiftTurn(loseTeam);
			//winner
			this.props.editTeam(this.props[winKey].id, {
				...this.props[winKey],
				total_score: this.props[winKey].total_score + 1,
				total_violations: getTotalViolations(winTeam, rounds),
			});

			//loser
			this.props.editTeam(this.props[loseKey].id, {
				...this.props[loseKey],
				total_score: this.props[loseKey].total_score,
				total_violations: getTotalViolations(loseTeam, rounds),
			});
		}, isDeath ? 7000 : 0);
	}

	renderGrid() {
		const { team1, team2 } = this.props;
		const { activeRound, newAlias, roundEndResult } = this.state;
		const isEnd = roundEndResult || activeRound.status === 'end';
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
          onClick={newAlias && !isEnd ? this.selectCard : null}
          data={{...d, team}}
          flipOver>
        </Card>
			)
		})

		return html;
	}

  render() {
  	const { gameDetails } = this.props;
  	const { 
  		activeRound, 
  		newAlias, 
  		showWaitingModal, 
  		roundEndResult, 
  		endRound, 
  		isDeath
  	} = this.state;
  	const turnOf = gameDetails ? gameDetails.turnOf : null;
  	const gridReady = bool(activeRound) && bool(activeRound.playing_cards);
  	const cxPage = gridReady ? '--ingame': '';
  	const cxDied = isDeath ? '--death': '';
  	const waitingForAlias = gridReady	&& !bool(newAlias);
  	const showEl = {
  		grid: gridReady,
  		startRound: !gridReady && !roundEndResult && !endRound && !isDeath,
  		roundEnded: !gridReady && endRound && !isDeath,
  		roundDied: !gridReady && endRound && isDeath,
  		footer: gridReady,
  		aliasLoading: showWaitingModal
  	}
  	
    return (
      <div className={`page-wrapper grid-page ${cxPage} ${cxDied}`} data-team={turnOf}>
				<div className="page-inner">
				{ showEl.grid ?
					<div className={`grid`}>
						{this.renderGrid()}
					</div> : ''
				}
				{ showEl.startRound ?
					<div className="start-round-wrapper">
						<h4>Ready?</h4>
						<Button className="--pick-leader" text={'Start'} onClick={this.shufflePlayingCards.bind(this)}/>
					</div> : ''
				}
				{ showEl.roundEnded ?
					<div className="start-round-wrapper">
						<h4>Round just ended</h4>
					</div> : ''
				}
				{ showEl.roundDied ?
					<div className="start-round-wrapper">
						<h4>You clicked Death!</h4>
					</div> : ''
				}
				</div>
				{ showEl.footer ?
					<Footer newAlias={newAlias} /> : ''
				}
				<ModalRoundWinner result={roundEndResult}/>
				<ModalQuitGame />
				<ModalRestartGame />
				{ showEl.aliasLoading ?
					<ModalAliasLoading show={waitingForAlias} team={turnOf}/> : ''
				}
		  </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GridPage);