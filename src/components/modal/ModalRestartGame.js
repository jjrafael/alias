import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Modal from './index';
import Button from '../common/Button';

//actions
import { 
  toggleRestartGameModal, 
  toggleLoadingOverlay,
} from '../../actions/app';
import { editGame, editRound } from '../../actions/games';
import { editTeam } from '../../actions/teams';

//misc
import { bool } from '../../utils';
import { getActiveRound } from '../../utils/game';

const mapStateToProps = state => {
  return {
    showModal: state.app.showModalRestartGame,
    gameDetails: state.game.gameDetails,
    team1: state.team.team1,
    team2: state.team.team2,
    rounds: state.game.rounds,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleRestartGameModal,
      toggleLoadingOverlay,
      editGame,
      editRound,
      editTeam,
    },
    dispatch
  )
}

class ModalRestartGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: {
        inGame: 'Are you sure you want to Restart Game and lose all the scores?',
        noGame: 'You haven\'t started yet'
      },
      activeRound: null,
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.rounds !== this.props.rounds){
      const activeRound = getActiveRound(this.props.rounds);
      this.setState({ activeRound });
      if(bool(this.props.rounds) && !activeRound && this.props.gameDetails){     
        //restart active round to r1
        this.props.toggleLoadingOverlay();
      }
    }
  }

  closeModal() {
    this.props.toggleRestartGameModal(false);
  }

  restartGame() {
      const { gameDetails, rounds, team1, team2 } = this.props;
      const { activeRound } = this.state;
      const count = gameDetails.restart_count ? gameDetails.restart_count + 1 : 1;
      const gameId = gameDetails.id;
      let roundData = {};
      let roundsData = [];
      
      //restarting game      
      if(activeRound){
        this.props.toggleLoadingOverlay(true, 'Restarting Game...');
        this.closeModal();

        roundData = {
          ...activeRound, 
          status: 'invalid',
          alias: [],
          team1: {},
          team2: {},
          playing_cards: [],
        }

        roundsData = rounds.map(d => {
          return {
            ...d, 
            status: 'invalid',
            alias: [],
            team1: {},
            team2: {},
            playing_cards: [],
          };
        });

        this.props.editGame(gameId, {
          ...gameDetails,
          restart_count: count,
          turnOf: 0,
        });
        this.props.editRound(gameId, activeRound.id, roundData, roundsData);
        this.props.editTeam(team1.id, {
          ...team1,
          total_score: 0,
          total_violations: 0
        });
        this.props.editTeam(team2.id, {
          ...team2,
          total_score: 0,
          total_violations: 0
        });
      }
  }

  render() {
    const { showModal } = this.props;
    const { msg, activeRound } = this.state;
    const hasActiveRound = bool(activeRound);
    const bodyMsg = hasActiveRound ? msg.inGame : msg.noGame;
    
    if(showModal){
      return (
        <Modal
          className="--flipping --confirmation" 
          cxOverlay="signOutModal" 
          size="xs"
          id="signOutModal">
          <div className="modal__inner">
            <div className="modal__header hide"></div>
            <div className="modal__body --no-header --text-only">{bodyMsg}</div>
            { hasActiveRound ?
              <div className="modal__footer --dual-buttons">
                <Button text="OK" className="--red --plain" onClick={() => this.restartGame()}/>
                <Button text="Cancel" className="--plain" onClick={() => this.closeModal()}/>
             </div> :
             <div className="modal__footer --single-button">
                <Button text="OK" className="--plain" onClick={() => this.closeModal()}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalRestartGame);