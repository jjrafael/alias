import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Components
import Footer from './footer';
import DecksBoard from './DecksBoard';
import CardsBoard from './CardsBoard';

// actions
import { setPlayingDecks } from '../../actions/cards';

const mapStateToProps = state => {return {
	decks: state.cards.decks,
	playingDecks: state.cards.playingDecks,
	isCustom: state.game.isCustom,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
		  setPlayingDecks,
		},
		dispatch
	 )
}

class DecksPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedDecks: [],
			showBoard: 'decks',
			newDeck: null,
		}
	}

	componentDidUpdate(prevProps){
		if(prevProps.gridCards !== this.props.gridCards){
			this.setState({ cardsForTeam: this.props.gridCards });
		}

		if(prevProps.decks !== this.props.decks){
			this.setSelectedDecks();
		}
	}

	toggleBoards = () => {
		this.setState({ showBoard: this.state.showBoard === 'decks' ? 'cards' : 'decks'});
	}

	uploadDeck = () => {
		const { newDeck } = this.state;
		if(newDeck){
			this.props.addDeck(newDeck);
		}
	}

	updateNewDeck = (data) => {
		this.setState({ newDeck: data });
	}

	setSelectedDecks() {
		const { isCustom, decks } = this.props;
		const defaultDecks = this.filterDefaultDecks(decks);

		if(isCustom){
			this.props.setPlayingDecks(this.state.selectedDecks);
		}else{
			this.props.setPlayingDecks(defaultDecks);
		}
	}

	filterDefaultDecks(decks) {
		return decks.filter(d => d.default);
	}

	loadDecks = () => {
		this.props.setPlayingDecks(this.state.selectedDecks);
	}

  render() {
  	const { showBoard } = this.state;
  	const cardsProps = {
  		updateNewDeck: this.updateNewDeck,
  	}

    return (
      <div className={`page-wrapper decks-page`}>
				<DecksBoard show={showBoard === 'decks'}/>
				<CardsBoard show={showBoard !== 'decks'} {...cardsProps}/>
				<Footer
					toggleBoards={this.toggleBoards} 
					loadDecks={this.loadDecks} 
					uploadDeck={this.uploadDeck}
					board={showBoard}/>
		  </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DecksPage);