import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

//Components
import Footer from '../Footer';

// actions
import { startGame } from '../../actions/games';
import { editApp, toggleSettingsModal } from '../../actions/app';

//misc
import { makeId, getNow, bool } from '../../utils';

const mapStateToProps = state => {
	return {
		playingDecks: state.cards.playingDecks,
		modDetails: state.game.modDetails,
		team1: state.team.team1,
		team2: state.team.team2,
		team1members: state.team.team1members,
		team2members: state.team.team2members,
		appDetails: state.app.appDetails,
		settings: state.app.settings,
	}
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
			toggleSettingsModal,
		  startGame,
		  editApp,
		},
		dispatch
	 )
}

class HomeFooter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			footOptions: {
				main: {
					text: 'Play',
					onClick: this.startGame,
				},
				left: {
					text: 'Settings',
					onClick: this.openSettings,
				},
				right: {
					text: 'Decks',
					onClick: () => { props.history.push('/decks') },
				},
				copyright: false,
			},
		}
	}

	openSettings = () => {
		this.props.toggleSettingsModal(true);
	}

	getUserKey(members) {
			return bool(members) ? members[0].created_by : '';
	}

	startGame = () => {
		const { 
			playingDecks, 
			modDetails,
			team1, 
			team2, 
			team1members, 
			team2members,
			appDetails,
			settings
		} = this.props;
		const teamCompleted = team1 && team2 && team1members && team2members;
		const deckIds = bool(playingDecks) ? playingDecks.map(d => d.id) : [];
		
		if(teamCompleted){
			const updApp = {
				...appDetails,
				team1_user_key: this.getUserKey(team1members),
				team2_user_key: this.getUserKey(team2members)
			}
			const data = {
				decks: deckIds,
				game_name: 'alias',
				game_key: 'g::'+makeId(),
				game_loser: '',
				game_winner: '',
				have_mod: bool(modDetails),
				started_time: getNow(),
				status: 'active',
				teams: [team1.id, team2.id],
				is_pause: false,
				settings: {
					include_jinx_cards: settings.include_jinx_cards,
					include_death_card: settings.include_death_card,
					timer: settings.timer,
					violation_limit: settings.violation_limit,
					show_death_on_leader:settings.show_death_on_leader,
					winning_score: settings.winning_score,
					add_mod: settings.add_mod,
				}
			}
			
			this.props.startGame(data).then(doc => {
				const id = doc.response.id;
				this.props.editApp(appDetails.id, {...updApp, current_game_id: id});
			});
		}
	}

  render() {
    const { footOptions } = this.state;
    return (
      <Footer options={footOptions}/>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeFooter));