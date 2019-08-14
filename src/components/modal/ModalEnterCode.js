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
} from '../../actions/app';

const mapStateToProps = state => {
  return {
    showModal: state.app.showModalEnterCode,
    appDetails: state.app.appDetails,
    user: state.app.user,
    submittingCode: state.app.submittingCode,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleEnterCodeModal,
      toggleLoadingOverlay,
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
    }
  }

  componentDidUpdate(prevProps){
      if(prevProps.appDetails !== this.props.appDetails){
        const haveActiveApp = this.props.appDetails && this.props.appDetails.status === 'active';
        this.setState({ haveActiveApp });
      }

      if(prevProps.user !== this.props.user){
        const haveActiveUser = this.props.user && this.props.user.status === 'active';
        this.setState({ haveActiveUser });
      }
  }

  closeModal() {
    this.props.toggleEnterCodeModal(false);
  }

  updateHandler = (formData) => {
    this.setState({ code: formData.code })
  }

  submitHandler = (formData) => {
    if(this.state.code){
      console.log('jj submitHandler1: ', formData);
    }
  }

  render() {
    const { showModal, submittingCode } = this.props;
    const { code, maxChar } = this.state;
    const cxDisabled = !code || (code && code.length !== maxChar) ? '--disabled' : '';
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
            className="--flipping --confirmation" 
            cxOverlay="signOutModal" 
            size="m"
            id="signOutModal">
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
        </Modal>
      );
    }else{
        return <div className="modal--blank"></div>;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalEnterCode);