import React from 'react';
import Modal from './index';
import { randomNumber } from '../../utils';

class ModalAliasLoading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingMsg: '',
      messages: [
        'Waiting for new Alias...',
        'Tagal mo uy!',
        'Ano na?',
        'Petsa na boi',
        'Still there team leader?',
        'Psst! Poke your team leader',
        'Still waiting',
        'Siya nga nahintay ko, ikaw pa kaya...',
        'Koya wampipti, dali!',
        'Beat Energy Gap oy!'
      ]
    }
  }

  componentDidUpdate(prevProps){
    if(prevProps.show !== this.props.show){
      this.showMessage(this.props.show);
    }
  }

  showMessage(show) {
    const { messages } = this.state;
    const msg = messages[randomNumber(messages.length)];
    if(show){
      setTimeout(() => {
        this.setState({ loadingMsg: msg });
      }, 10000);
    }else{
      this.setState({ loadingMsg: '' });
    }
  }

  closeModal() {
    this.props.toggleAliasLoadingModal(false);
  }

  render() {
    const { show, team } = this.props;
    const { loadingMsg, messages } = this.state;
    const cxFlipover = loadingMsg ? '--flip-loop' : '';

    if(show){
      return (
        <Modal
          className={`--flipping --flippable ${cxFlipover}`} 
          cxOverlay="--showHeader"
          size="xs"
          id="aliasLoading">
          <div className="modal-card --back" data-team={team}>
            <div className="modal__inner">
              <div className="modal__body --body-only --center">
                {loadingMsg}
              </div>
            </div>
          </div>
          <div className={`modal-card --front`}>
            <div className="modal__inner">
              <div className="modal__body --body-only --center">
                {messages[0]}
              </div>
            </div>
          </div>
        </Modal>
      );
    }else{
        return <div className="modal--blank"></div>;
    }
  }
}

export default ModalAliasLoading;