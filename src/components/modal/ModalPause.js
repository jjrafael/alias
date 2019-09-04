import React from 'react';
import Modal from './index';
import Button from '../common/Button';
import { randomNumber } from '../../utils';

class ModalPause extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayMsg: '',
      interval: 5000,
      messages: [
        'Teka lang bish',
        'Tagal mo uy!',
        'Ano na?',
        'Petsa na boi',
        'Pause-sang Ina! Tagal!',
        'Jejebs lang ako',
        'Still waiting',
        'Hold on',
        'Koya wampipti, dali!',
        'Beat Energy Gap oy!',
        'Just a sec',
        'Quickie muna'
      ]
    }
  }

  componentDidMount(){
    const { messages, interval } = this.state;
    const displayMsg = messages[randomNumber(messages.length)];
    setTimeout(() => {
      this.setState({ displayMsg });
    }, interval);
  }

  closeModal() {
    this.props.resumeGame();
  }

  render() {
    const { team } = this.props;
    const { displayMsg } = this.state;
    const cxFlipover = displayMsg ? '--flip-loop' : '';

    return (
      <Modal
        className={`--flipping --flippable ${cxFlipover}`} 
        cxOverlay="pauseGame-wrap"
        size="s"
        id="pauseGame">
        <div className="modal-card --back" data-team={team}>
          <div className="modal__inner">
            <div className="modal__body --body-only --center">
              {displayMsg}
            </div>
          </div>
        </div>
        <div className={`modal-card --front`}>
          <div className="modal__inner">
            <div className="modal__body --no-header --text-only --center">
              Game Paused
            </div>
            <div className="modal__footer --single-button">
              <Button text="Resume" className="--plain" onClick={() => this.closeModal()}/>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalPause;