import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Components
import Footer from './footer';
import FormBox from '../forms/FormBox';
import Board from '../common/Board';

// actions
import { listenGame, listenRounds, editRound } from '../../actions/games';

//misc
import { bool, getNow } from '../../utils';
import { getActiveRound } from '../../utils/game';
import inGameAlias from '../../config/formData/inGameAlias';

const mapStateToProps = state => {return {
	team: state.team.team1 || state.team.team2 || null,
	turnOf: state.game.turnOf,
	gameDetails: state.game.gameDetails,
	rounds: state.game.rounds,
	team1members: state.team.team1members,
	team2members: state.team.team2members,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
		  listenGame, 
		  listenRounds,
		  editRound
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
			pending: false,
			alias: [],
			showDeathCard: true,
		}
	}

	componentDidMount(){
		const { gameDetails } = this.props;
		
		if(gameDetails){
			this.props.listenGame(gameDetails.id);
			this.props.listenRounds(gameDetails.id);
		}
	}

	componentDidUpdate(prevProps, prevState){
		if(prevProps.rounds !== this.props.rounds && this.props.rounds){
			let activeRound = getActiveRound(this.props.rounds);
			activeRound = bool(activeRound) ? activeRound[0] : null;
			this.setState({ activeRound });
			if(activeRound){
				this.getCardsForTeam(activeRound.playing_cards);
			}
		}

		if(prevState.activeRound !== this.state.activeRound){
			const alias = this.state.activeRound ? this.state.activeRound.alias : [];
			this.setState({ alias });
		}
	}

	submitForm = (formData) => {
		const { team, gameDetails, editRound } = this.props;
		const { alias, activeRound } = this.state;
		const teamNumber = team ? team.team_number : null;
		const teamData = activeRound && teamNumber ? activeRound[`team${teamNumber}`] : null;
		const data = {
			...formData,
			created_time: getNow(),
			created_by_member: teamData ? teamData.leader : 'anyone',
		}

		this.setState({
			alias: [...alias, data],
		});

		if(bool(data)){
			editRound(gameDetails.id, activeRound.id, {
				...activeRound,
				alias: [ ...activeRound.alias, data ]
			});
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
		const { deathCard, showDeathCard } = this.state;
		let arr = [];

		if(deathCard && showDeathCard){
			arr.push({
				...deathCard,
				className: '--death',
				frontChildren: deathCard.text
			});
		}

		data.forEach(d => {
			arr.push({
				...d,
				className: '--'+d.type,
				frontChildren: d.text
			})
		})
		
		return arr;
	}

  render() {
  	const { turnOf, rounds, gameDetails, team } = this.props;
  	const { cardsForTeam, pending } = this.state;
  	const gridReady = bool(rounds) && bool(cardsForTeam);
  	const teamNumber = team ? team.team_number : null;
  	const boardArr = this.composeBoardArr(cardsForTeam);
  	const notTurn = gameDetails && teamNumber ? (gameDetails.turnOf !== teamNumber) : false;
  	const cx = {
  		page: `${bool(boardArr) ? '--hasBoard' : ''}`,
  		board: bool(boardArr) ? 'active' : ''
  	}
  	const msg = {
  		msgNoRound: 'Preparing Game...',
  		msgPending: 'Waiting for answer puuuu...',
  		msgNotTurn: 'Opponent team\'s turn',
  	}
  	const showEl = {
  		board: gridReady,
  		form: gridReady && !pending && !notTurn,
  		msgNoRound: !gridReady,
  		msgPending: gridReady && pending && !notTurn,
  		msgNotTurn: gridReady && notTurn && !pending
  	}
  	
    return (
      <div className={`page-wrapper leader-page ${cx.page}`} data-team={turnOf}>
				<div className="page-inner">
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
					{ showEl.msgPending ?
						msg.msgPending : ''
					}
					{ showEl.msgNoRound ?
						msg.msgNoRound : ''
					}
					{ showEl.msgNotTurn ?
						msg.msgNotTurn : ''
					}
				</div>
				<Footer/>
		  </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderPage);