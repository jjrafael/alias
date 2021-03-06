import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

//Components
import Footer from './footer';
import DecksBoard from './DecksBoard';
import CardsBoard from './CardsBoard';

// actions
import { toggleLoadingOverlay } from '../../actions/app';
import { addDeck, setPlayingDecks, browseDecks } from '../../actions/cards';

//misc
import { isResType, bool, scrollTo } from '../../utils';

const mapStateToProps = state => {return {
	decks: state.cards.decks,
	playingDecks: state.cards.playingDecks,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
		  setPlayingDecks,
		  addDeck,
		  browseDecks,
		  toggleLoadingOverlay
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
			decks: [],
			newDeck: null,
			successAdded: false,
		}
	}

	componentDidMount() {
		if(bool(this.props.decks)){
			this.setState({ decks: this.props.decks });
			this.setSelectedDecks();
		}else{
			this.props.browseDecks();
		}
	}

	componentDidUpdate(prevProps){
		if(prevProps.gridCards !== this.props.gridCards){
			this.setState({ cardsForTeam: this.props.gridCards });
		}

		if(prevProps.decks !== this.props.decks){
			this.setState({ decks: this.props.decks });
			this.setSelectedDecks();
		}
	}

	selectDeck = (data, _decks) => {
		const { selectedDecks } = this.state;
		const decks = _decks || this.state.decks || [];
		const isArray = Array.isArray(data);
		let newSelectedDecks = selectedDecks || [];
		let newDecks = decks;

		if(isArray){
			const ids = data.map(d => d.id);
			newDecks = decks.map(d => {
				return ids.indexOf(d.id) !== -1 ? {...d, selected: d.selected ? d.selected : true} : d;
			})

			data.forEach(d => {
				const result = this.processSelectedCards(d, newDecks, newSelectedDecks, true);
				newSelectedDecks = result.selectedDecks;
			})
		}else{
			const result = this.processSelectedCards(data, newDecks, newSelectedDecks);
			newSelectedDecks = result.selectedDecks;
			newDecks = result.decks;
		}
		
		scrollTo('boardYourDeck');
		this.setState({ selectedDecks: newSelectedDecks, decks: newDecks });
	}

	processSelectedCards(data, decks, selectedDecks, fromArray){
		const hasSelections = bool(selectedDecks);
		const isSelected = data && data.selected ? data.selected : false;
		const newData = { ...data, selected: !isSelected};
		let result = { decks: [], selectedDecks: [] };
		
		result.decks = decks.map(d => {
			return newData.id === d.id ? {...d, selected: !isSelected} : d;
		})

		if(isSelected && !fromArray){
			const filtered = selectedDecks.filter(d => d.id !== newData.id);
			result.selectedDecks = hasSelections ? filtered : [];
		}else{
			result.selectedDecks = [ ...selectedDecks, newData ];
		}

		return result;
	}

	toggleBoards = () => {
		this.setState({ showBoard: this.state.showBoard === 'decks' ? 'cards' : 'decks'});
	}

	uploadDeck = () => {
		const { newDeck } = this.state;
		if(newDeck){
			this.setState({ successAdded: false });
			this.props.toggleLoadingOverlay(true, 'Adding Deck...');
			this.props.addDeck(newDeck).then(doc => {
				if(isResType(doc)){
					//successfully added
					this.props.toggleLoadingOverlay();
					this.toggleBoards();
					this.setState({ newDeck: null, successAdded: true });
				}
			})
		}
	}

	updateNewDeck = (data) => {
		this.setState({ newDeck: data });
	}

	setSelectedDecks() {
		const { decks, playingDecks } = this.props;
		const { selectedDecks } = this.state;
		const defaultDecks = this.getDefaultBundle(decks);

		if(bool(selectedDecks)){
			this.props.setPlayingDecks(selectedDecks);
		}else if(bool(playingDecks)){
			this.props.setPlayingDecks(playingDecks);
			this.selectDeck(playingDecks, decks);
		}else if(bool(defaultDecks)){
			this.props.setPlayingDecks(defaultDecks);
			this.selectDeck(defaultDecks, decks);
		}
	}

	getDefaultBundle(decks) {
		if(bool(decks)){
			return decks.filter(d => d.is_default_bundle);
		}
	}

	loadDecks = () => {
		const { selectedDecks } = this.state;
		this.props.setPlayingDecks(selectedDecks);
		this.props.history.push('');
	}

  render() {
  	const { showBoard,successAdded, selectedDecks, decks } = this.state;
  	const deckProps = {
  		decks: decks,
  		selectedDecks: selectedDecks,
  		selectDeck: this.selectDeck,
  	}
  	const cardsProps = {
  		updateNewDeck: this.updateNewDeck,
  		successAdded: successAdded
  	}
  	
    return (
      <div className={`page-wrapper decks-page`}>
				<DecksBoard show={showBoard === 'decks'} {...deckProps}/>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DecksPage));