import React from 'react';
import { connect } from 'react-redux';

//components
import HeaderCenter from './HeaderCenter';
import ScoreBar from './ScoreBar';

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
    const { className, gameDetails, turnOf } = this.props;
    const { timer } = this.state;
    const hasGame = gameDetails;
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
        { hasGame &&
            <div>
              <ScoreBar team={team.team_1}/>
              <ScoreBar team={team.team_2}/>
              <div className="timerbar"></div>
            </div>
        }
        <HeaderCenter timer={timer}/>
      </header>
    );
  }
}

export default connect(mapStateToProps)(Header);
