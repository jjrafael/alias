import React from 'react';
import { connect } from 'react-redux';

//components
import HeaderCenter from './HeaderCenter';
import ScoreBar from './ScoreBar';
import Menu from './Menu';

const mapStateToProps = state => {
  return {
    settings: state.app.settings,
    gameDetails: state.game.gameDetails,
    turnOf: state.game.turnOf,
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
    const { className, gameDetails, turnOf, headerProps, team1, team2 } = this.props;
    const { timer } = this.state;
    const inGame = gameDetails && gameDetails.status === 'active';

    return (
      <header className={`app-header ${className || ''}`} data-team={turnOf}>
        { inGame && team1 && team2 &&
            <div>
              <ScoreBar team={team1}/>
              <ScoreBar team={team2}/>
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
