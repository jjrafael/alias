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
  readApp,
  addUser,
  initializeApp,
  editApp
} from '../../actions/app';
import { 
  verifyTeamCode,
  editTeam,
  resetTeams,
  resetMembers
} from '../../actions/teams';

//misc
import { 
  getResponse, 
  isResType, 
  getNow, 
  deleteLocalStorage,
  setLocalStorage
} from '../../utils';
import { checkQuerySize } from '../../utils/data';

const mapStateToProps = state => {
  return {
    showModal: state.app.showModalEnterCode,
    appDetails: state.app.appDetails,
    user: state.app.user,
    userType: state.app.userType,
    deviceDetails: state.app.deviceDetails,
    submittingCode: state.app.submittingCode,
    teamCodeError: state.team.teamCodeError,
    team1: state.team.team1,
    team2: state.team.team2,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleEnterCodeModal,
      toggleLoadingOverlay,
      verifyTeamCode,
      editTeam,
      readApp,
      addUser,
      initializeApp,
      editApp,
      resetTeams,
      resetMembers,
    },
    dispatch
  )
}

class ModalEnterCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      haveActiveApp: this.props.appDetails && this.props.appDetail.status === 'active',
      haveActiveUser: this.props.user && this.props.user.status === 'active',
      code: '',
      maxChar: 6,
      verificationError: '',
      progressBar: 0,
      teamNumber: null,
    }
  }

  componentDidUpdate(prevProps, prevState){
      if(prevProps.appDetails !== this.props.appDetails){
        const haveActiveApp = this.props.appDetails && this.props.appDetails.status === 'active';
        this.setState({ 
          haveActiveApp, 
          progressBar: 100, 
          verificationError: '', 
        });
        this.closeLoading();
        this.closeModal();

        if(haveActiveApp){
          setLocalStorage('alias_appId', this.props.appDetails.id);
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
    this.props.verifyTeamCode(code).then(res => {
      if(!res.error){
        const data = checkQuerySize(res, true);
        if(!!data && data[0] && data[0].status === 'inactive'){
          this.setState({ progressBar: 20 });
          this.verifyApp(data[0]);
        }else{
          this.closeLoading('Code was not available anymore');
        }
      }else{
        this.closeLoading('Error while verifying team code');
      }
    })
  }

  verifyApp(data) {
    const { app_id, id, team_number } = data;
    const isTeam1 = (['1', 1]).indexOf(team_number) !== -1;
    const oppositeTeam = isTeam1 ? 2 : 1;
    this.props.readApp(app_id).then((doc) => {
      //if exists and active
      const cond = {key: 'status', value: 'active'};
      const response = getResponse(doc, cond);
      if(response){
        const isTeamUnAvail = response['team'+team_number+'_user_key'];
        if(!isTeamUnAvail){
          const teamData = {
            ...data, 
            status: 'active',
          };

          this.setState({ 
            teamNumber: team_number,
            progressBar: 40,
          });

          this.props.editTeam(id, teamData).then(doc => {
            if(isResType(doc)){
              this.initUser({
                id: app_id, 
                data: response
              }, team_number);
              this.setState({ progressBar: 60 });
              this.props.resetTeams(oppositeTeam);
              this.props.resetMembers();
              setLocalStorage('alias_team'+team_number+'Id', id);
              deleteLocalStorage('alias_team'+oppositeTeam+'Id');
            }
          });

        }else{
          this.closeLoading('The app or the team is already unavailable');
        }
      }else{
        this.closeLoading('Error while verifying team status');
      }
    })
  }

  initUser(app, teamNumber) {
    const { deviceDetails, userType } = this.props;
    const now = getNow();
    const data = {
      name: 'team_tester1',
      email: 'team_tester1@mail.co',
      platform: deviceDetails.platform,
      is_logged: true,
      device: deviceDetails.device,
      browser: deviceDetails.browser,
      status: 'active',
      type: userType,
      role: 'team',
      created_time: now,
      last_logged_time: now,
    }

    this.props.addUser(data).then(doc => {
      if(isResType(doc)){
        const teamKey = 'team'+teamNumber+'_user_key';
        const appData = {
          ...app.data, 
          total_connected_users: app.data.total_connected_users + 1,
          [teamKey]: doc.response.id
        }

        //connect to app
        this.setState({ progressBar: 80 });
        this.props.editApp(app.id, appData);
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