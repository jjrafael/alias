import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { shuffle } from 'lodash'; 

//components
import Modal from './index';
import Button from '../common/Button';

//actions
import { toggleLoadingOverlay, toggleRoundWinnerModal } from '../../actions/app';
import { addRound, editGame, shiftTurn } from '../../actions/games';
import { setCardsOnGrid } from '../../actions/cards';
import { editTeam } from '../../actions/teams';

//misc
import { 
  randomNumber, 
  getNow, 
  bool,
  makeArrayFromIndexArray,
  randomIndexArray,
  isResType,
  deleteLocalStorage
} from '../../utils';
import { getLastRound } from '../../utils/game';

const mapStateToProps = state => {
  return {
    show: state.app.showModalRoundWinner,
    gameDetails: state.game.gameDetails,
    rounds: state.game.rounds,
    settings: state.app.settings,
    turnOf: state.game.turnOf,
    team1: state.team.team1,
    team2: state.team.team2,
    team1members: state.team.team1members,
    team2members: state.team.team2members,
    playingDecks: state.cards.playingDecks,
    cardsOnGrid: state.cards.cardsOnGrid,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      shiftTurn,
      addRound,
      editGame,
      toggleRoundWinnerModal,
      toggleLoadingOverlay,
      setCardsOnGrid,
      editTeam
    },
    dispatch
  )
}

class ModalRoundWinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      messages: [
        'Good job!',
        'Pa-milktea ka naman!',
        'Amazing!',
        'Fantastic',
        'Ikaw na!',
        'Kabahan na yung Kalaban',
        'Nukkss',
        'Keep it up!'
      ]
    }
  }

  closeModal() {
    this.props.toggleRoundWinnerModal(null);
    this.setState({ progress: 0 });
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
      this.setState({ progress: 25 });
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
    
    this.setState({ progress: 50 });
    this.pickTeam(newCards);
    return newCards;
  }

  pickTeam(cards){
    const { gameDetails, show } = this.props;
    const winner = show.winner.team.team_number;
    const opponent = Number(winner) === 1 ? 2 : 1;

    this.props.editGame(gameDetails.id, {
      ...gameDetails,
      turnOf: opponent,
    }).then(doc => {
      if(isResType(doc)){
        this.props.shiftTurn(opponent);
        this.setState({ initProgress: 75 });
        this.nextRound(cards);
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

  nextRound(cards) {
    const { gameDetails, rounds } = this.props;
    const team1Leader = this.pickLeader(1);
    const team2Leader = this.pickLeader(2);
    const lastRound = getLastRound(rounds);
    const nextRound = Number(lastRound.round_number) + 1;
    const nextId = 'r'+nextRound;
    const data = {
      id: nextId,
      round_number: nextRound,
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
    this.closeModal();
    
    this.props.addRound(gameDetails.id, nextId, data).then(doc => {
      this.props.toggleLoadingOverlay();
      if(isResType(doc)){
        this.setState({ progress: 100 });
      }
    });
  }

  finishGame() {
    const { gameDetails, show } = this.props;
    const gameId = gameDetails.id;
    const winTeam = this.props[`team${show.winner.team.team_number}`];
    const loseTeam = this.props[`team${show.loser.team.team_number}`];
    
    this.props.shiftTurn(0);
    this.props.toggleLoadingOverlay(true, 'Exiting Game...');
    this.props.editGame(gameId, {
      ...gameDetails,
      game_winner: show.winner.team.id,
      game_loser: show.loser.team.id,
      game_winner_team: show.winner.team.team_number,
      game_loser_team: show.loser.team.team_number,
      status: 'end',
    }).then(doc => {
      if(isResType(doc)){
        deleteLocalStorage('alias_gameId');
      }
    });

    //winner
    this.props.editTeam(winTeam.id, {
      ...winTeam,
      total_violations: 0,
      total_score: 0,
      trophies: (winTeam.trophies || 0) + 1
    });

    //loser
    this.props.editTeam(loseTeam.id, {
      ...loseTeam,
      total_violations: 0,
      total_score: 0,
      trophies: loseTeam.trophies || 0
    });
    
    this.closeModal();
  }

  render() {
    const { show } = this.props;
    const { messages } = this.state;
    const winner = show ? show.winner : {};
    const loser = show ? show.loser : {};
    const msg = messages[randomNumber(messages.length)];
    
    if(show){
      return (
        <Modal
          className={`--flipping --winner shadow`} 
          cxOverlay={`--showHeader roundWinner-wrap --team${winner.team.team_number}`}
          size="l"
          id="roundWinner">
          <div className="modal__inner">
            { show.finish ? 
              <div className="modal__body --body-only --center">
                <h2>{winner.team.name || winner.team.team_number || ''}</h2>
                <div className="msg__round-result">
                  {show.isViolated ? loser.team.name+' reached violation limit' : 'Our Winner!'}
                </div>
                <div className="trophy-wrapper"></div>
                <Button text="Exit Game" className="--primary" onClick={() => this.finishGame()}/>
              </div> :
              <div className="modal__body --body-only --center">
                <h2>{winner.team.name || winner.team.team_number || ''}</h2>
                <div className="msg__round-result">
                  Congratulations! {msg}
                </div>
                <div className="trophy-wrapper"></div>
                <Button text="Next Round!" className="--primary" onClick={() => this.shufflePlayingCards()}/>
              </div>
            }
          </div>
        </Modal>
      );
    }else{
        return <div className="modal--blank"></div>;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalRoundWinner);