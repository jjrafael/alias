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
import { editGame, addRound } from '../../actions/games';

const mapStateToProps = state => {
  return {
    showModal: state.app.showModalRestartGame,
    gameDetails: state.game.gameDetails,
    rounds: state.game.rounds,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleRestartGameModal,
      toggleLoadingOverlay,
      editGame,
      addRound,
    },
    dispatch
  )
}

class ModalSignOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Are you sure you want to Restart Game and lose all your scores?'
    }
  }

  componentDidUpdate(prevProps){
      if(prevProps.rounds && !this.props.rounds && this.props.gameDetails){
        //rounds successfully cleared, init new round
        this.props.addRound(this.props.gameDetails.id);
      }
  }

  closeModal() {
    this.props.toggleRestartGameModal(false);
  }

  restartGame() {
      const { gameDetails, editGame } = this.props;
      const restart_count = gameDetails.restart_count + 1;

      //restarting game
      this.props.toggleLoadingOverlay(true, 'Restarting Game...');
      this.closeModal();
      editGame(gameDetails.id, {...gameDetails, restart_count});
      
  }

  render() {
    const { showModal } = this.props;
    const { message } = this.state;

    if(showModal){
      return (
        <Modal
            className="--flipping --confirmation" 
            cxOverlay="signOutModal" 
            size="xs"
            id="signOutModal">
          <div className="modal__inner">
              <div className="modal__header hide"></div>
              <div className="modal__body --no-header --text-only">{message}</div>
               <div className="modal__footer --dual-buttons">
                  <Button text="OK" className="--red --plain" onClick={() => this.restartGame()}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalSignOut);