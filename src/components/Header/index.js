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
    const { className, gameDetails, turnOf, isAppReady } = this.props;
    const { timer } = this.state;
    const inGame = gameDetails && gameDetails.status === 'active';
    const team = {
      team_1: {
        team_number: '1'
      },
      team_2: {
        team_number: '2'
      },
    }

    return (
      <header className={`app-header ${className || ''}`} data-team={turnOf}>
        { inGame &&
            <div>
              <ScoreBar team={team.team_1}/>
              <ScoreBar team={team.team_2}/>
              <div className="timerbar"></div>
            </div>
        }
        <HeaderCenter timer={timer}>
          <Menu isAppReady={isAppReady}/>
        </HeaderCenter>
      </header>
    );
  }
}

export default connect(mapStateToProps)(Header);
