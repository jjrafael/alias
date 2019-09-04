import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Modal from './index';
import Button from '../common/Button';

//actions
import { 
  toggleQuitGameModal, 
  toggleLoadingOverlay,
} from '../../actions/app';
import { deleteGame, clearRounds } from '../../actions/games';
import { editTeam } from '../../actions/teams';

//misc
import { bool, deleteLocalStorage } from '../../utils';
import { getActiveRound } from '../../utils/game';

const mapStateToProps = state => {
  return {
    showModal: state.app.showModalQuitGame,
    gameDetails: state.game.gameDetails,
    rounds: state.game.rounds,
    team1: state.team.team1,
    team2: state.team.team2,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleQuitGameModal,
      toggleLoadingOverlay,
      deleteGame,
      clearRounds,
      editTeam
    },
    dispatch
  )
}

class ModalQuitGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: {
        inGame: 'Are you sure you want to Exit Game and lose all the scores?',
        noGame: 'You haven\'t started yet, continue exit game?'
      },
      activeRound: null,
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.rounds !== this.props.rounds){
      const activeRound = getActiveRound(this.props.rounds);
      this.setState({ activeRound });
    }
  }

  closeModal() {
    this.props.toggleQuitGameModal(false);
  }

  quitGame() {
    const { gameDetails, team1, team2 } = this.props;
    const gameId = gameDetails.id;
    
    this.props.toggleLoadingOverlay(true, 'Exiting Game...');
    deleteLocalStorage('alias_gameId');
    this.closeModal();
    this.props.clearRounds();
    this.props.deleteGame(gameId);
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
            <div className="modal__footer --dual-buttons">
              <Button text="OK" className="--red --plain" onClick={() => this.quitGame()}/>
              <Button text="Cancel" className="--plain" onClick={() => this.closeModal()}/>
            </div>
          </div>
        </Modal>
      );
    }else{
      return <div className="modal--blank"></div>;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalQuitGame);