import React from 'react';
import { connect } from 'react-redux';

//components
import HeaderCenter from './HeaderCenter';
import ScoreBar from './ScoreBar';
import Menu from './Menu';

//misc
import { bool } from '../../utils';

const mapStateToProps = state => {
  return {
    user: state.app.user,
    settings: state.app.settings,
    gameDetails: state.game.gameDetails,
    rounds: state.game.rounds,
    team1: state.team.team1,
    team2: state.team.team2,
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
    const { className, gameDetails, headerProps, team1, team2, settings, user, rounds } = this.props;
    const isTeam = user ? user.role === 'team' : false;
    const turnOf = gameDetails && !isTeam ? gameDetails.turnOf : '';
    const { timer } = this.state;
    const inGame = gameDetails && gameDetails.status === 'active';
    const team = {
      team1: {
        ...team1,
        rounds: bool(rounds) ? rounds.map((acc, d) => d.rounds) : []
      },
      team2: {
        ...team2,
        rounds: bool(rounds) ? rounds.map((acc, d) => d.rounds) : []
      }
    }

    return (
      <header className={`app-header ${className || ''}`} data-team={turnOf}>
        { inGame && team1 && team2 &&
            <div>
              <ScoreBar team={team.team1} settings={settings}/>
              <ScoreBar team={team.team2} settings={settings}/>
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
