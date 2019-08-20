import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Components
import Footer from '../Footer';

// actions
import { startGame } from '../../actions/games';
import { editApp } from '../../actions/app';

//misc
import { makeId, getNow } from '../../utils';

const mapStateToProps = state => {
	return {
		playingDecks: state.cards.playingDecks,
		modDetails: state.game.modDetails,
		isCustom: state.game.isCustom,
		team1: state.team.team1,
		team2: state.team.team2,
		team1members: state.team.team1members,
		team2members: state.team.team2members,
		appDetails: state.app.appDetails,
	}
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
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
					onClick: () => {},
				},
				right: {
					text: 'Decks',
					onClick: () => {},
				},
				copyright: false,
			},
		}
	}

	startGame = () => {
		const { 
			playingDecks, 
			modDetails, 
			isCustom, 
			team1, 
			team2, 
			team1members, 
			team2members,
			appDetails
		} = this.props;
		const teamCompleted = team1 && team2 && team1members && team2members;
		
		if(teamCompleted){
			const data = {
				decks: playingDecks,
				game_key: 'g::'+makeId(),
				game_loser: '',
				game_winner: '',
				have_mod: !!modDetails,
				is_custom: isCustom,
				started_time: getNow(),
				status: 'active',
				teams: [team1.id, team2.id],
			}
			
			this.props.startGame(data).then(doc => {
				const id = doc.response.id;
				this.props.editApp(appDetails.id, {...appDetails, current_game_id: id});
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);