import React from 'react';

class ScoreBar extends React.Component {
	render (){
		const { team } = this.props;
		return (
			<div className="scorebar scorebar-team" data-team={team.team_number}>
				<div className="scorebar__avatar"></div>
				<div className="scorebar__round-score">
						4<span className="over-score">/8</span>
				</div>
				<div className="scorebar__info">
					<div className="scorebar__name">Team Two</div>
					<div className="scorebar__trophies">
					  <div className="icon icon-trophy"></div>
					</div>
					<div className="scorebar__violations">
					  <div className="icon icon-stop"></div>
					</div>
				</div>
	        </div>
		)
	}
}

export default ScoreBar;