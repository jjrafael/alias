import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Modal from './index';
import Button from '../common/Button';
import SingleForm from '../forms/SingleForm';

//actions
import { 
  toggleEnterCodeModal, 
  toggleLoadingOverlay,
  readSession,
  addUser,
  initializeSession,
  editSession
} from '../../actions/session';

//misc
import {
  isResType, 
  getNow,
  setLocalStorage
} from '../../utils';

const mapStateToProps = state => {
  return {
    showModal: state.session.showModalEnterCode,
    sessionDetails: state.session.sessionDetails,
    user: state.session.user,
    userType: state.session.userType,
    deviceDetails: state.session.deviceDetails,
    submittingCode: state.session.submittingCode,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleEnterCodeModal,
      toggleLoadingOverlay,
      readSession,
      addUser,
      initializeSession,
      editSession,
    },
    dispatch
  )
}

class ModalEnterCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      haveActiveSession: this.props.sessionDetails && this.props.sessionDetail.status === 'active',
      haveActiveUser: this.props.user && this.props.user.status === 'active',
      code: '',
      maxChar: 6,
      verificationError: '',
      progressBar: 0,
    }
  }

  componentDidUpdate(prevProps, prevState){
      if(prevProps.sessionDetails !== this.props.sessionDetails){
        const haveActiveSession = this.props.sessionDetails && this.props.sessionDetails.status === 'active';
        this.setState({ 
          haveActiveSession, 
          progressBar: 100, 
          verificationError: '', 
        });
        this.closeLoading();
        this.closeModal();

        if(haveActiveSession){
          setLocalStorage('alias_sessionId', this.props.sessionDetails.id);
        }
      }

      if(prevProps.user !== this.props.user){
        const haveActiveUser = this.props.user && this.props.user.status === 'active';
        if(haveActiveUser){
          this.setState({ haveActiveUser });
          setLocalStorage('alias_userId', this.props.user.id);
        }
      }
  }

  removeErrorMsg() {
    this.setState({ verificationError: '' });
  }

  verifyCode(code) {
    this.closeLoading('Error while verifying code');
  }

  verifySession(data) {
    const { session_id } = data;
    this.props.readSession(session_id).then((doc) => {
      this.closeLoading();
    })
  }

  initUser(session) {
    const { deviceDetails, userType } = this.props;
    const now = getNow();
    const data = {
      name: 'tester1',
      email: 'tester1@mail.co',
      platform: deviceDetails.platform,
      is_logged: true,
      device: deviceDetails.device,
      browser: deviceDetails.browser,
      status: 'active',
      type: userType,
      role: 'player',
      created_time: now,
      last_logged_time: now,
    }

    this.props.addUser(data).then(doc => {
      if(isResType(doc)){
        const sessionData = {
          ...session.data, 
          total_connected_users: session.data.total_connected_users + 1,
        }

        //connect to session
        this.setState({ progressBar: 80 });
        this.props.editSession(session.id, sessionData);
      }else{
        this.closeLoading('Error while initializing user');
      }
    });
  }

  closeModal() {
    this.props.toggleEnterCodeModal(false);
    this.setState({ progressBar: 0, code: '' });
  }

  closeLoading(error) {
    this.props.toggleLoadingOverlay();
    if(error){
      this.setState({ verificationError: error });
    }
  }

  updateHandler = (formData) => {
    this.setState({ code: formData.code })
  }

  submitHandler = (formData) => {
    this.props.toggleLoadingOverlay(true, 'Verifying Code...');
    this.verifyCode(formData ? formData.code : this.state.code);
  }

  render() {
    const { showModal, submittingCode } = this.props;
    const { code, maxChar, verificationError } = this.state;
    const cxDisabled = !code || (code && code.length !== maxChar) ? '--disabled' : '';
    const shouldFlip = verificationError;
    const cxFlipover = shouldFlip ? '--flip' : '';
    const input = {
      id: 'code',
      type: 'text',
      placeholder: 'Code here',
      label: 'Code Verification',
      showLabel: false,
      required: true,
      validations: ['charMax-'+maxChar],
      enableEnter: true,
    }

    if(showModal){
      return (
        <Modal
            className={`--flipping --flippable ${cxFlipover}`} 
            cxOverlay="signOutModal" 
            size="m"
            id="signOutModal">
          <div className={`modal-card --back`}>
            <div className="unflip" onClick={this.removeErrorMsg.bind(this)}>X</div>
            <div className="modal-form-msg">{verificationError}</div>
          </div>
          <div className={`modal-card --front`}>
            <div className="modal__inner">
              <div className="modal__header">Code Verification</div>
                { !submittingCode ?
                  <div>
                    <div className="modal__body">
                      <SingleForm 
                        className="--on-modal"
                        formName="enter_code"
                        updateHandler={this.updateHandler}
                        onSubmit={this.submitHandler}
                        input={input}
                        noSubmitButton={true} />
                    </div>
                    <div className="modal__footer --dual-buttons">
                      <Button text="Submit" className={`--primary --plain ${cxDisabled}`} onClick={() => this.submitHandler()}/>
                      <Button text="Cancel" className="--plain" onClick={() => this.closeModal()}/>
                    </div>
                  </div>
                  : null
                }
            </div>
          </div>
        </Modal>
      );
    }else{
        return <div className="modal--blank"></div>;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalEnterCode);