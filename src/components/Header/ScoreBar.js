import React from 'react';
import { compareUpdate, bool } from '../../utils';

class ScoreBar extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			newScore: false
		}
		this._isMounted = true;
	}

	componentDidUpdate(prevProps) {
		if(compareUpdate(prevProps.team, this.props.team, '!==', 'both')){
			const prevScore = prevProps.team.round.score;
			const nextScore = this.props.team.round.score;
			if(prevScore !== nextScore){
				const direction = nextScore && nextScore > prevScore ? 'up' : ''
				this.promptScore(direction);
			}
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	editState(obj){
		if(this._isMounted){
			this.setState(obj);
		}
	}

	promptScore(direction){
		this.editState({ newScore: direction });
		setTimeout(() => {
			this.editState({ newScore: '' });
		}, 2000);
	}

	renderIcons(count, icon){
		let html = [];

		if(count){
			for(var i = 1; i <= count; i++){
				html.push(<div key={i} className={`icon icon-${icon}`}></div>)
			}
		}

		return html;
	}

	render (){
		const { team } = this.props;
		const { newScore } = this.props;
		const teamNumber = team ? team.team_number : 0;
		const score = team && bool(team.round) ? team.round.score : 0;
		const trophies = team ? team.total_score : 0;
		const violations = team ? team.total_violations : 0;
		const cx = {
			score: newScore ? `--${newScore}` : ''
		};
		const icons = {
			trophies: this.renderIcons(trophies, 'trophy'),
			violations: this.renderIcons(violations, 'stop')
		}
		
		return (
			<div className={`scorebar scorebar-team ${cx.score}`} data-team={teamNumber}>
				<div className="scorebar__avatar"></div>
				<div className="scorebar__round-score">
						{score}
						<span className="over-score">/{team.score_goal}</span>
				</div>
				<div className="scorebar__info">
					<div className="scorebar__name">{team.name}</div>
					<div className="scorebar__trophies">
						{icons.trophies}
					</div>
					<div className="scorebar__violations">
					  {icons.violations}
					</div>
				</div>
	    </div>
		)
	}
}

export default ScoreBar;