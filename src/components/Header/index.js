import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import HeaderCenter from './HeaderCenter';
import ScoreBar from './ScoreBar';
import Menu from './Menu';

//action
import { setTimesUp } from '../../actions/games';

//misc
import { getActiveRound, getCardsPerType } from '../../utils/game';
import { bool, minToMsec, getPercentage } from '../../utils';

const mapStateToProps = state => {
  return {
    user: state.app.user,
    settings: state.app.settings,
    gameDetails: state.game.gameDetails,
    isPause: state.game.isPause,
    rounds: state.game.rounds,
    team1: state.team.team1,
    team2: state.team.team2,
    cardsOnGrid: state.cards.cardsOnGrid,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
  {
    setTimesUp
  },
  dispatch
  )
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: minToMsec(this.props.settings.timer),
      activeRound: null,
      newAlias: null,
    }
    this.timeFunc = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.settings.timer !== this.props.settings.timer){
      this.setState({ timer: minToMsec(this.props.settings.timer) });
    }

    if(prevProps.rounds !== this.props.rounds){
      const activeRound = getActiveRound(this.props.rounds);
      this.setNewAlias(activeRound ? activeRound.alias : []);
      this.setState({ activeRound: activeRound });
    }

    if(prevState.newAlias !== this.state.newAlias && this.props.settings.timer){
      if(this.state.newAlias){
        this.props.setTimesUp(false);
        this.timeFunc = setInterval(this.setTimeFunc, 1000);
      }else{
        clearInterval(this.timeFunc);
      }
    }

    if(prevProps.isPause !== this.props.isPause && this.props.settings.timer){
      this.toggleTimer(this.props.isPause);
    }
  }

  setTimeFunc = () => {
    const { settings } = this.props;
    const { timer } = this.state;
    const baseTimer = minToMsec(settings.timer);
    const interval = 1000;
    this.setState({ timer: timer - interval });
    if (timer < interval) {
      clearInterval(this.timeFunc);
      this.props.setTimesUp(true);
      this.setState({ timer: baseTimer });
    }
  }

  toggleTimer(isPause) {
    if(isPause){
      clearInterval(this.timeFunc);
    }else{
      this.timeFunc = setInterval(this.setTimeFunc, 1000);
    }
  }

  setNewAlias(data){
    const arr = bool(data) ? data.filter(d => d.new) : [];
    const alias = bool(arr) ? arr[0] : null;
    this.setState({ newAlias: alias });
  }

  render() {
    const { 
      className, 
      gameDetails, 
      headerProps, 
      team1, 
      team2, 
      settings, 
      user, 
      cardsOnGrid,
    } = this.props;
    const { timer, activeRound } = this.state;
    const isTeam = user ? user.role === 'team' : false;
    const turnOf = gameDetails && !isTeam ? gameDetails.turnOf : '';
    const inGame = gameDetails && gameDetails.status === 'active';
    const baseTimer = minToMsec(settings.timer);
    const timePerc = getPercentage(baseTimer, timer, 'diffPerc');
    const isTimeQuarter = timePerc > 75;
    const cxQuarter = isTimeQuarter ? '--quarter' : '';
    const cxHide = !activeRound ? 'hide' : '';
    const team = {
      team1: {
        ...team1,
        round: bool(activeRound) ? activeRound.team1 : {},
        total_score: team1 ? team1.total_score : 0,
        total_violations: team1 ? team1.total_violations : 0,
        score_goal: getCardsPerType(cardsOnGrid, 'team1').length || settings.cards_per_team
      },
      team2: {
        ...team2,
        round: bool(activeRound) ? activeRound.team2 : {},
        total_score: team2 ? team2.total_score : 0,
        total_violations: team2 ? team2.total_violations : 0,
        score_goal: getCardsPerType(cardsOnGrid, 'team2').length || settings.cards_per_team
      }
    }
    
    return (
      <header className={`app-header ${className || ''}`} data-team={turnOf}>
        { inGame && team1 && team2 &&
            <div className="header-inner">
              <ScoreBar team={team.team1}/>
              <ScoreBar team={team.team2}/>
              <div
                className={`timerbar ${cxQuarter} ${cxHide}`} 
                style={{width: timePerc+'%'}}>
              </div>
            </div>
        }
        <HeaderCenter timer={timer}>
          <Menu {...headerProps}/>
        </HeaderCenter>
      </header>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
