import React from 'react';
import { connect } from 'react-redux';

//components
import HeaderCenter from './HeaderCenter';
import ScoreBar from './ScoreBar';
import Menu from './Menu';

//misc
import { getActiveRound, getCardsPerType } from '../../utils/game';
import { bool } from '../../utils';

const mapStateToProps = state => {
  return {
    user: state.app.user,
    settings: state.app.settings,
    gameDetails: state.game.gameDetails,
    rounds: state.game.rounds,
    team1: state.team.team1,
    team2: state.team.team2,
    cardsOnGrid: state.cards.cardsOnGrid,
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: this.props.settings.timer,
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.settings.timer !== this.props.settings.timer){
      this.setState({ timer: this.props.settings.timer });
    }
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
      rounds 
    } = this.props;
    const isTeam = user ? user.role === 'team' : false;
    const turnOf = gameDetails && !isTeam ? gameDetails.turnOf : '';
    const { timer } = this.state;
    const inGame = gameDetails && gameDetails.status === 'active';
    const activeRound = getActiveRound(rounds);
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
            <div>
              <ScoreBar team={team.team1}/>
              <ScoreBar team={team.team2}/>
              <div className="timerbar"></div>
            </div>
        }
        <HeaderCenter timer={timer}>
          <Menu {...headerProps}/>
        </HeaderCenter>
      </header>
    );
  }
}

export default connect(mapStateToProps)(Header);
