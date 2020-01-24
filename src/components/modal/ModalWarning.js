import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Modal from './index';
import Button from '../common/Button';

//actions
import { toggleWarningModal } from '../../actions/session';

const mapStateToProps = state => {
  return {
    warningModal: state.session.warningModal,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleWarningModal
    },
    dispatch
  )
}

class ModalWarning extends React.Component {
  closeModal() {
    this.props.toggleWarningModal(false);
  }

  render() {
    const { warningModal } = this.props;
    const { show, message, title, type, extra } = warningModal;
    const size = extra && extra.size ? extra.size : 's'
    const cx = {
      type: type ? '--'+type : ''
    }
    
    if(show){
      return (
        <Modal
          className={`--flipping --confirmation ${cx.type}`} 
          cxOverlay="warningModal" 
          size={size}
          id="warningModal">
          <div className="modal__inner">
              <div className="modal__header">{title || 'Warning!'}</div>
              <div className="modal__body --text-only">{message}</div>
              <div className="modal__footer --single-button">
                <Button text="Got it!" className="--plain" onClick={() => this.closeModal()}/>
              </div>
          </div>
        </Modal>
      );
    }else{
        return <div className="modal--blank"></div>;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalWarning);