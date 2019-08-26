import React from 'react';

class ScoreBar extends React.Component {
	renderIcons(count, icon){
		let html = [];

		if(count){
			for(var i = 1; i < count; i++){
				html.push(<div key={i} className={`icon icon-${icon}`}></div>)
			}
		}

		return html;
	}

	render (){
		const { team, round, settings } = this.props;
		
		return (
			<div className="scorebar scorebar-team" data-team={team.team_number}>
				<div className="scorebar__avatar"></div>
				<div className="scorebar__round-score">
						{round ? round.team1_score : 0}
						<span className="over-score">/{settings.cards_per_team}</span>
				</div>
				<div className="scorebar__info">
					<div className="scorebar__name">{team.name}</div>
					<div className="scorebar__trophies">
						{this.renderIcons(team.total_score, 'trophy')}
					</div>
					<div className="scorebar__violations">
					  {this.renderIcons(team.total_violations, 'stop')}
					</div>
				</div>
	    </div>
		)
	}
}

export default ScoreBar;