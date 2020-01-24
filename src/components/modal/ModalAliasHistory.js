import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Modal from './index';
import Board from '../common/Board';
import Button from '../common/Button';

//actions
import { toggleAliasHistoryModal } from '../../actions/app';

//misc
import { bool } from '../../utils';
import { getActiveRound } from '../../utils/game';

const mapStateToProps = state => {
  return {
    showModal: state.app.showModalAliasHistory,
    gameDetails: state.game.gameDetails,
    rounds: state.game.rounds,
    team1: state.team.team1,
    team2: state.team.team2,
    settings: state.app.settings
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleAliasHistoryModal,
    },
    dispatch
  )
}

class ModalReportAlias extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRound: null,
      selectedReason: null,
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.rounds !== this.props.rounds){
      const activeRound = getActiveRound(this.props.rounds);
      this.setState({ activeRound });
    }
  }

  closeModal() {
    this.props.toggleAliasHistoryModal();
  }

  renderCardInfo(d) {
    const { team1, team2 } = this.props;
    const cards = d.for_cards ? d.for_cards : [];
    let el = [];

    cards.forEach((d, i) => {
      if(d.type === 'team1' && team1){
        el.push(<span key={i}><span className={`bordered --${d.type}`}>{d.text}</span> </span>);
      }else if(d.type === 'team2' && team2){
        el.push(<span key={i}><span className={`bordered --${d.type}`}>{d.text}</span> </span>);
      }else if(d.type === 'death'){
        el.push(<span key={i}><span className={`bordered --${d.type}`}>Death</span> </span>);
      }else if(d.type === 'none'){
        el.push(<span key={i}><span className={`bordered --${d.type}`}>Neutral</span> </span>);
      }
    });

    return el;
  }

  renderBoardItems() {
    const { activeRound } = this.state;
    const alias = activeRound ? activeRound.alias : [];
    let arr = [];

    alias.forEach((d, i) => {
      const team = this.props[`team${d.team_number}`];
      const cardInfo = this.renderCardInfo(d);
      
      arr.push({
        frontChildren: (
          <div key={i} className="history__item">
            {d.alias}
            <div className="history__info">
              <span className="count">{d.count || 1}</span>
            </div>
            <div className="history__cardinfo">
              From <span className={`bordered --team${team.team_number}`}>
              {team.name}</span>
              {bool(cardInfo) ? ' for ' : ''}{cardInfo}
            </div>
            { d.violated ?
              <div className="history__cardinfo --red">
                Violation of <span className={`bordered --team${d.violator_team}`}>
                {this.props[`team${d.violator_team}`].name}</span>
              </div> : ''
            }
          </div>
        )
      })
    })
    
    return arr.reverse();
  }

  render() {
    const { showModal } = this.props;
    const { activeRound } = this.state;
    const roundName = activeRound ? 'Round '+activeRound.round_number : 'Current Round';
    const boardArr = this.renderBoardItems();
    
    if(showModal){
      return (
        <Modal
          className="--flipping --confirmation" 
          cxOverlay="historyModal-wrap" 
          size="l"
          id="historyModal">
          <div className="modal__inner">
            <div className="modal__header hide"></div>
            <div className="modal__body --no-header --text-only">
              <h2>{roundName}</h2>
              { bool(boardArr) ? 
                <Board
                id="boardAliasHistory"
                data={boardArr}
                className="--hor-scroll active --board-on-modal"
                type="bar"/>
                : ''
              }
            </div>
            <div className="modal__footer --single-button">
              <Button text="Back" className="--plain" onClick={() => this.closeModal()}/>
            </div>
          </div>
        </Modal>
      );
    }else{
      return <div className="modal--blank"></div>;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalReportAlias);