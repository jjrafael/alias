import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Modal from './index';
import FormBox from '../forms/FormBox';
import Button from '../common/Button';

//actions
import { toggleSettingsModal, setSettings } from '../../actions/session';

//misc
import gameSettings from '../../config/formData/gameSettings';

const mapStateToProps = state => {
  return {
    showModal: state.session.showModalSettings,
    settings: state.session.settings
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleSettingsModal,
      setSettings
    },
    dispatch
  )
}

class ModalSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      formInfo: gameSettings
    }
  }

  componentDidMount(){
    const { settings } = this.props;
    let data = {};
    const inputs = gameSettings.inputs.map(d => {
      data[d.id] = settings[d.id];
      return {...d, value: settings[d.id]}
    });

    this.setState({
      formInfo: {
        ...gameSettings,
        inputs
      },
      formData: data
    })
  }

  closeModal() {
    this.props.toggleSettingsModal();
  }

  updateHandler = (data) => {
    const { formData } = this.state;
    this.setState({ formData: {...formData, ...data} });
  }

  submitForm = () => {
    const { formData } = this.state;
    const data = {
      ...formData,
      timer: Number(formData.timer) || 0,
      violation_limit: Number(formData.violation_limit) || 0,
      winning_score: Number(formData.winning_score )|| 3,
    }
    this.setState({ formData: data });
    this.props.setSettings(data);
    this.closeModal();
  }

  render() {
    const { showModal } = this.props;
    const { formInfo } = this.state;
    const cxDisableSubmit = false ? '--disabled' : '';
    
    if(showModal){
      return (
        <Modal
          className="--flipping --confirmation" 
          cxOverlay="settingsModal-wrap" 
          size="l"
          id="settingsModal">
          <div className="modal__inner">
            <div className="modal__header">Settings</div>
            <div className="modal__body">
              <FormBox
                updateHandler={this.updateHandler}
                formInfo={formInfo}/>
            </div>
            <div className="modal__footer --dual-buttons">
              <Button text="Submit" className={`--primary --plain ${cxDisableSubmit}`} onClick={() => this.submitForm()}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalSettings);