import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Modal from './index';
import Button from '../common/Button';

//actions
import { 
  toggleSignOutModal, 
  toggleLoadingOverlay,
  editApp,
  editUser,
  clearRdxApp,
} from '../../actions/app';
import { editGame } from '../../actions/games';

//misc
import { clearLocalStorage } from '../../utils';

const mapStateToProps = state => {
  return {
    showModal: state.app.showModalSignout,
    gameDetails: state.game.gameDetails,
    appDetails: state.app.appDetails,
    user: state.app.user,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleSignOutModal,
      toggleLoadingOverlay,
      editGame,
      editApp,
      editUser,
      clearRdxApp,
    },
    dispatch
  )
}

class ModalSignOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inGame: this.props.gameDetails && this.props.gameDetails.status === 'active',
      haveActiveApp: this.props.appDetails && this.props.appDetail.status === 'active',
      haveActiveUser: this.props.user && this.props.user.status === 'active',
      message: {
        inGame: 'Are you sure you want to Quit and end your game?',
        inHome: 'Are you sure you want to Quit?'
      }
    }
  }

  componentDidUpdate(prevProps){
      if(prevProps.gameDetails !== this.props.gameDetails){
        const inGame = this.props.gameDetails && this.props.gameDetails.status === 'active';
        this.setState({ inGame });
      }

      if(prevProps.appDetails !== this.props.appDetails){
        const haveActiveApp = this.props.appDetails && this.props.appDetails.status === 'active';
        this.setState({ haveActiveApp });
      }

      if(prevProps.user !== this.props.user){
        const haveActiveUser = this.props.user && this.props.user.status === 'active';
        this.setState({ haveActiveUser });

        if(!this.props.user && prevProps.user){
          //successfully signed out
          this.props.toggleLoadingOverlay();
          clearLocalStorage();
        }
      }
  }

  closeModal() {
    this.props.toggleSignOutModal(false);
  }

  signOut() {
      const { appDetails, gameDetails, user, editApp, editUser, editGame } = this.props;
      const { haveActiveUser , haveActiveApp, inGame } = this.state;
      const isTeam = user && user.role === 'team';

      //start signing out
      this.props.toggleLoadingOverlay(true, 'Signing Out...');
      this.props.clearRdxApp();
      this.closeModal();
      //in active game
      if(inGame && gameDetails){
          editGame(gameDetails.id, {...gameDetails, status: 'stopped'});
      }

      //has active app
      if(haveActiveApp && appDetails && !isTeam){
        editApp(appDetails.id, {...appDetails, status: 'inactive'});
      }

      //has active user
      if(haveActiveUser && user){
          editUser(user.id, {...user, status: 'signed_out', is_logged: false});
      }
  }

  render() {
    const { showModal } = this.props;
    const { message, inGame } = this.state;
    const msg = inGame ? message.inGame : message.inHome;

    if(showModal){
      return (
        <Modal
          className="--flipping --confirmation" 
          cxOverlay="signOutModal" 
          size="xs"
          id="signOutModal">
          <div className="modal__inner">
              <div className="modal__header hide"></div>
              <div className="modal__body --no-header">{msg}</div>
              <div className="modal__footer --dual-buttons">
                <Button text="OK" className="--red --plain" onClick={() => this.signOut()}/>
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