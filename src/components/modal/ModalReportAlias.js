import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { find } from 'lodash';

//components
import Modal from './index';
import Board from '../common/Board';
import Button from '../common/Button';

//actions
import { 
  toggleReportAliasModal, 
  toggleLoadingOverlay,
  toggleRoundWinnerModal,
} from '../../actions/app';
import { editRound, editGame, shiftTurn, pauseGame, resumeGame } from '../../actions/games';
import { editTeam } from '../../actions/teams';

//misc
import { bool, isResType } from '../../utils';
import { getActiveRound, getTotalViolations } from '../../utils/game';
import reportReasons from '../../config/reportReasons';

const mapStateToProps = state => {
  return {
    showModal: state.app.showModalReportAlias,
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
      toggleReportAliasModal,
      toggleLoadingOverlay,
      toggleRoundWinnerModal,
      editGame,
      editRound,
      editTeam,
      shiftTurn,
      pauseGame,
      resumeGame
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

    if(prevProps.showModal !== this.props.showModal && this.props.showModal){
      this.props.pauseGame();
    }
  }

  closeModal() {
    this.props.toggleReportAliasModal();
    this.props.resumeGame();
  }

  reportAlias() {
    const { newAlias, gameDetails, settings, rounds } = this.props;
    const { activeRound, selectedReason } = this.state;
    const turnOf = gameDetails && gameDetails.turnOf;
    const oppositeViolations = ['10'];
    const violatedByOpponent = selectedReason && oppositeViolations.indexOf(selectedReason.id) !== -1;
    const opponent = Number(turnOf) === 1 ? 2 : 1;
    const violator = violatedByOpponent ? opponent : turnOf;
    const nonviolator = Number(violator) === 1 ? 2 : 1;
    const violatorKey = `team${violator}`;
    const canReport = selectedReason && gameDetails && activeRound && newAlias;
    const violations = canReport ? activeRound[violatorKey].violations + 1 : activeRound[violatorKey].violations;
    const totalViolations = getTotalViolations(violator, rounds);
    const reachedLimit = canReport && totalViolations >= settings.violation_limit;
    let updAlias = [];
    let violatorData = {};
    let roundData = {};
    let roundsData = [];
    
    if(canReport){
      this.props.toggleLoadingOverlay(true, 'Submitting Report...');
      updAlias = activeRound.alias.map(d => {
        return d.id === newAlias.id ? {
          ...d, 
          new: false, 
          violated: true,
          violation_reason: selectedReason.id,
          violator_team: violator,
          left: 0
        } : d;
      })

      violatorData = {
        ...activeRound[violatorKey],
        violations: violations
      }

      roundData = {
        ...activeRound,
        alias: updAlias,
        [violatorKey]: violatorData
      }

      roundsData = rounds.map(d => {
        return d.id === activeRound.id ? roundData : d;
      });
      
      this.props.editTeam(this.props[violatorKey].id, {
        ...this.props[violatorKey],
        total_violations: this.props[violatorKey].total_violations + 1
      });
      
      this.props.editRound(gameDetails.id, activeRound.id, roundData, roundsData).then(doc => {
        this.props.toggleLoadingOverlay();
        if(isResType(doc)){
          if(reachedLimit){
            this.endRound(violator);
          }else{
            this.props.shiftTurn(nonviolator);
          }
          this.closeModal();
        }
      });
    }
  }

  endRound(violator) {
    const { activeRound } = this.state;
    const nonviolator = Number(violator) === 1 ? 2 : 1;
    const winTeam = this.props[`team${nonviolator}`];
    const loseTeam = this.props[`team${violator}`];
    this.props.toggleRoundWinnerModal({
      winner: {
        score: activeRound[`team${nonviolator}`].score,
        team: winTeam
      },
      loser: {
        score: activeRound[`team${violator}`].score,
        team: loseTeam
      },
      finish: true,
      isDeath: false,
      isViolated: true,
    });
  }

  selectReason = (data) => {
    const { selectedReason } = this.state;
    if(data && !selectedReason){
      this.setState({ selectedReason: data });
    }else if(data && selectedReason){
      const isSame = selectedReason.id === data.id;
      this.setState({ selectedReason: isSame ? null : data });
    }
  }

  composeBoardArr() {
    const { selectedReason } = this.state;
    let arr = [];

    reportReasons.forEach(d => {
      const selected = selectedReason ? selectedReason.id === d.id : false;
      const cxSelected = selected ? '--selected' : '';
      arr.push({
        data: d,
        onClick: this.selectReason,
        className: `--selectable ${cxSelected}`,
        frontChildren: d.text
      })
    })
    
    return arr;
  }

  render() {
    const { showModal, newAlias, gameDetails } = this.props;
    const { selectedReason } = this.state;
    const turnOf = gameDetails && gameDetails.turnOf;
    const team = this.props[`team${turnOf}`];
    const members = this.props[`team${turnOf}members`];
    const leader = newAlias ? find(members, ['id', newAlias.created_by_member]) : null
    const leaderName = leader && leader.name !== 'anyone' ? leader.name : (team ? team.name : null);
    const display = leaderName ? 'submitted by '+leaderName : '';
    const cxDisableSubmit = !bool(selectedReason) ? '--disabled' : '';
    const boardArr = this.composeBoardArr();
    
    if(showModal && newAlias){
      return (
        <Modal
          className="--flipping --confirmation" 
          cxOverlay="reportModal-wrap" 
          size="l"
          id="reportModal">
          <div className="modal__inner">
            <div className="modal__header hide"></div>
            <div className="modal__body --no-header --text-only">
              <h2>{newAlias.alias}</h2>
              <div className="msg__round-result">
                Report this alias {display}
              </div>
              <Board
                id="boardReportReason"
                data={boardArr}
              className="--hor-scroll active --board-on-modal"
                type="bar"/>
            </div>
            <div className="modal__footer --dual-buttons">
              <Button text="Report" className={`--red --plain ${cxDisableSubmit}`} onClick={() => this.reportAlias()}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalReportAlias);