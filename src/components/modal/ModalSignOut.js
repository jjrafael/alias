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
  editSession,
  editUser,
  clearRdxSession,
} from '../../actions/session';

//misc
import { clearLocalStorage } from '../../utils';

const mapStateToProps = state => {
  return {
    showModal: state.session.showModalSignout,
    sessionDetails: state.session.sessionDetails,
    user: state.session.user,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleSignOutModal,
      toggleLoadingOverlay,
      editSession,
      editUser,
      clearRdxSession,
    },
    dispatch
  )
}

class ModalSignOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      haveActiveSession: this.props.sessionDetails && this.props.sessionDetail.status === 'active',
      haveActiveUser: this.props.user && this.props.user.status === 'active',
      message: {
        inHome: 'Are you sure you want to Quit?'
      }
    }
  }

  componentDidUpdate(prevProps){
      if(prevProps.sessionDetails !== this.props.sessionDetails){
        const haveActiveSession = this.props.sessionDetails && this.props.sessionDetails.status === 'active';
        this.setState({ haveActiveSession });
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
      const { sessionDetails, user, editSession, editUser } = this.props;
      const { haveActiveUser , haveActiveSession } = this.state;

      //start signing out
      this.props.toggleLoadingOverlay(true, 'Signing Out...');
      this.props.clearRdxSession();
      this.closeModal();

      //has active session
      if(haveActiveSession && sessionDetails){
        editSession(sessionDetails.id, {...sessionDetails, status: 'inactive'});
      }

      //has active user
      if(haveActiveUser && user){
          editUser(user.id, {...user, status: 'signed_out', is_logged: false});
      }
  }

  render() {
    const { showModal } = this.props;
    const { message } = this.state;
    const msg = message.inHome;

    if(showModal){
      return (
        <Modal
          className="--flipping --confirmation" 
          cxOverlay="signOutModal" 
          size="xs"
          id="signOutModal">
          <div className="modal__inner">
            <div className="modal__header hide"></div>
            <div className="modal__body --no-header --text-only">{msg}</div>
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