import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Modal from './index';
import Button from '../common/Button';

//actions
import { toggleSignOutModal, toggleLoadingOverlay } from '../../actions/app';

const mapStateToProps = state => {
  return {
    showModal: state.app.showModalSignout,
    inGame: false,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleSignOutModal,
      toggleLoadingOverlay
    },
    dispatch
  )
}

class ModalSignOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: {
        inGame: 'Are you sure you want to Sign out and end your game?',
        inHome: 'Are you sure you want to Sign out?'
      }
    }
  }

  closeModal() {
    this.props.toggleSignOutModal(false);
  }

  signOut() {
      this.props.toggleLoadingOverlay(true, 'Signing Out...');
      this.closeModal();
      setTimeout(() => {
        this.props.toggleLoadingOverlay();
      }, 2000);
  }

  render() {
    const { showModal, inGame } = this.props;
    const { message } = this.state;
    const msg = inGame ? message.inGame : message.inHome;

    if(showModal){
      return (
        <Modal
            className="--flipping --confirmation" 
            cxOverlay="signOUtModal" 
            size="xs"
            id="signOutModal">
          <div className="modal__inner">
              <div className="modal__header hide"></div>
              <div className="modal__body --body-only">{msg}</div>
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

export default connect(mapStateToProps, mapDispatchToProps )(ModalSignOut);