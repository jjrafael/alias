import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Components
import FormBox from '../forms/FormBox';
import Board from '../common/Board';
import Button from '../common/Button';

// actions
import { listenGame, listenRounds, editRound } from '../../actions/games';
import { setSettings } from '../../actions/app';
import { browseMembers } from '../../actions/teams';

//misc
import { bool, getNow, makeId } from '../../utils';
import { getActiveRound, getTeamNumber } from '../../utils/game';
import inGameAlias from '../../config/formData/inGameAlias';

const mapStateToProps = state => {return {
	team: state.team.team1 || state.team.team2 || null,
	turnOf: state.game.turnOf,
	gameDetails: state.game.gameDetails,
	settings: state.app.settings,
	rounds: state.game.rounds,
	members: bool(state.team.team1members) ? state.team.team1members
		: (bool(state.team.team2members) ? state.team.team2members : [])
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
		  listenGame, 
		  listenRounds,
		  editRound,
		  setSettings,
		  browseMembers
		},
		dispatch
	 )
}

class LeaderPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cardsForTeam: [],
			activeRound: null,
			deathCard: null,
			pendingAnswer: false,
			alias: [],
			isWaiting: false,
			activatePage: false,
		}
	}

	componentDidMount(){
		const { gameDetails } = this.props;
		
		if(gameDetails){
			this.props.listenGame(gameDetails.id);
			this.props.listenRounds(gameDetails.id);
			this.props.setSettings(gameDetails.settings);
		}
	}

	componentDidUpdate(prevProps, prevState){
		if(!prevProps.team && this.props.team && !bool(this.props.members)){
			this.props.browseMembers(this.props.team.id, this.props.team.team_number);
		}

		if(prevProps.rounds !== this.props.rounds && this.props.rounds){
			const activeRound = getActiveRound(this.props.rounds);
			this.setState({ activeRound });
			if(activeRound){
				this.getCardsForTeam(activeRound.playing_cards);
			}
		}

		if(prevState.activeRound !== this.state.activeRound){
			const alias = this.state.activeRound ? this.state.activeRound.alias : [];
			this.setState({ alias });
			if(!bool(alias)){
				this.activatePage(false);
			}
		}

		if(prevState.alias !== this.state.alias){
			// const hadNew = bool(prevState.alias.filter(d => d.new));
			const haveNew = bool(this.state.alias.filter(d => d.new));
			this.setState({ pendingAnswer: haveNew && bool(this.state.alias) });
		}
	}

	activatePage(value) {
		this.setState({ activatePage: value });
	}

	submitForm = (formData) => {
		const { team, gameDetails, editRound, rounds } = this.props;
		const { alias, activeRound } = this.state;
		const teamNumber = getTeamNumber(team, true);
		const teamData = activeRound && teamNumber ? activeRound[`team${teamNumber}`] : null;
		const oldAlias = alias.map(d => {return {...d, new: false}});
		const data = {
			...formData,
			count: formData.count ? Number(formData.count) : 1,
			left: formData.count || 0,
			created_time: getNow(),
			created_by_member: teamData ? teamData.leader : 'anyone',
			new: true,
			team_number: teamNumber,
			id: makeId(10, true)
		}
		const roundData = {
			...activeRound,
			alias: [ ...activeRound.alias, data ]
		}
		const roundsData = rounds.map(d => {
			return d.id === activeRound.id ? roundData : d;
		});
		
		this.setState({
			alias: [...oldAlias, data],
		});

		if(bool(data)){
			editRound(gameDetails.id, activeRound.id, roundData, roundsData);
			this.setState({ pendingAnswer: true });
		}
	}

	getCardsForTeam(data){
		const { team } = this.props;
		const teamNumber = team ? team.team_number : null;
		let cards = [];
		let deathCard = null;

		if(bool(data) && teamNumber){
			cards = data.filter(d => d.type === 'team'+teamNumber);
			deathCard = data.filter(d => d.type === 'death');
			deathCard = bool(deathCard) ? deathCard[0] : null; 
		}
			
		this.setState({
			cardsForTeam: cards,
			deathCard,
		});
	}

	composeBoardArr(data=[]) {
		const { settings } = this.props;
		const { deathCard } = this.state;
		const showDeath = settings.show_death_on_leader;
		let arr = [];

		if(deathCard && showDeath){
			arr.push({
				...deathCard,
				className: '--death',
				frontChildren: deathCard.text
			});
		}

		data.forEach(d => {
			const cxRevealed = d.revealed ? '--revealed' : '';
			arr.push({
				...d,
				className: `--${d.type} ${cxRevealed}`,
				frontChildren: d.text
			})
		})
		
		return arr;
	}

  render() {
  	const { rounds, gameDetails, team } = this.props;
  	const { cardsForTeam, pendingAnswer, activeRound, activatePage } = this.state;
  	const turnOf = gameDetails ? gameDetails.turnOf : 0;
  	const gridReady = bool(rounds) && bool(cardsForTeam) && activeRound;
  	const teamNumber = team ? team.team_number : null;
  	const boardArr = this.composeBoardArr(cardsForTeam);
  	const isPause = gameDetails && gameDetails.is_pause;
  	const notTurn = gameDetails && teamNumber ? (Number(turnOf) !== teamNumber) : false;
  	const cx = {
  		page: `${bool(boardArr) ? '--hasBoard' : ''}`,
  		board: bool(boardArr) ? 'active' : '',
  		activated: activatePage ? 'active' : 'inactive',
  	}
  	const msg = {
  		msgNoRound: 'Preparing Game...',
  		msgPending: 'Waiting for answer...',
  		msgNotTurn: 'Opponent team\'s turn',
  		msgPause: 'Game Paused',
  	}
  	const showEl = {
  		board: gridReady && activatePage,
  		form: gridReady && activatePage && !pendingAnswer && !notTurn && !isPause,
  		activateButton: gridReady && !activatePage,
  		msgNoRound: !gridReady,
  		msgPending: gridReady && activatePage && pendingAnswer && !notTurn && !isPause,
  		msgNotTurn: gridReady && activatePage && notTurn && !isPause,
  		msgPause: gridReady && activatePage && isPause
  	}
  	
    return (
      <div className={`page-wrapper leader-page ${cx.page}`} data-team={teamNumber}>
				<div className={`page-inner ${cx.activated}`}>
					{showEl.board ? 
						<Board
							id="boardInGameAlias"
							data={boardArr}
							className={`--hor-scroll ${cx.board}`}
							type="bar"/> : ''
					}
					{showEl.form ?
						<FormBox
              onSubmit={this.submitForm}
              clearOnSubmit={true}
              formInfo={inGameAlias}/>
						: ''
					}
					{ showEl.msgPause ?
						msg.msgPause : ''
					}
					{ showEl.msgPending ?
						msg.msgPending : ''
					}
					{ showEl.msgNoRound ?
						msg.msgNoRound : ''
					}
					{ showEl.msgNotTurn ?
						msg.msgNotTurn : ''
					}
					{ showEl.activateButton ?
						<div className="activate-page-wrapper">
							<h4>Ready?</h4>
							<Button
								text={'Start'} 
								onClick={() => this.activatePage(true)}/>
						</div>
						: ''
					}
				</div>
		  </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderPage);