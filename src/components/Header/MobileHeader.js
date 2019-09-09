import React from 'react';
import { connect } from 'react-redux';
import { find } from 'lodash';
import { bool } from '../../utils';
import { getActiveRound } from '../../utils/game';

const mapStateToProps = state => {
  return {
    rounds: state.game.rounds,
    team: state.team.team1 || state.team.team2 || null,
    members: bool(state.team.team1members) ? state.team.team1members
			: (bool(state.team.team2members) ? state.team.team2members : [])
  }
}

class MobileHeader extends React.Component {
	renderHeader() {
		const { page, team, rounds, members } = this.props;
		const teamNumber = team ? team.team_number : 0;
		const activeRound = getActiveRound(rounds);
		let html = '';

		if(page === 'buildTeam'){
			html = team ? team.name : 'Build your team';
		}else if(bool(activeRound) && page === 'leader'){
			const activeTeam = activeRound[`team${teamNumber}`];
			const leader = activeTeam ? activeTeam.leader : '';
			const member = find(members, ['id', leader]);
			html = member ? member.name : (team.name || 'Team Leader');
		}
		
		return html;
	}

  render() {
  	const { page } = this.props;
    return (
      <div className={`mobile-header page-${page}`}>
        {this.renderHeader()}
      </div>
    );
  }
}

export default connect(mapStateToProps)(MobileHeader);