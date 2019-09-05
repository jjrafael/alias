import React from 'react';
import Board from '../common/Board';
import { bool, pluralizeString } from '../../utils';

class DecksBoard extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
    	decks: [],
    	selectedDecks: [],
    }
  }

  componentDidMount() {
  	this.setState({
  		decks: this.composeDecks(this.props.decks),
    	selectedDecks: this.composeDecks(this.props.selectedDecks),
  	})
  }

  componentDidUpdate(prevProps) {
  	if(prevProps.decks !== this.props.decks){
  		this.setState({
	  		decks: this.composeDecks(this.props.decks)
	  	})
  	}

  	if(prevProps.selectedDecks !== this.props.selectedDecks){
  		this.setState({
	  		selectedDecks: this.composeDecks(this.props.selectedDecks)
	  	})
  	}
  }

	composeDecks(data) {
    return data.map((d, i) => { return {
      data: d,
      type: 'deck-card',
      onClick: this.props.selectDeck,
    }});
  }

  render() {
  	const { show } = this.props;
  	const { decks, selectedDecks } = this.state;
  	const hasSelectedDecks = bool(selectedDecks);
  	const cardsLen = hasSelectedDecks ? selectedDecks.reduce((sum, d) => {
  		return d.data && bool(d.data.cards) ? sum + d.data.cards.length : sum
  	}, 0) : 0;
  	const deckLenTxt = selectedDecks.length+' '+pluralizeString('deck', selectedDecks.length);
  	const cardLenTxt = cardsLen ? '  |  ' + cardsLen + ' ' + pluralizeString('card', cardsLen) : '';
  	const cx = {
      col2: show ? 'show' : '',
    }
    const showEl = {
    	decks: !!decks,
    	selectedDecks: !!selectedDecks
    }

    return (
      <div className={`col-2 col-decks ${cx.col2}`}>
    		{ showEl.decks ?
          <div className="col">
          	<div className="col-header">
          		<div className="heading-wrapper">
								<h2>Decks</h2>
								{ bool(decks) ?
									decks.length+' '+pluralizeString('deck', decks.length): ''
								}
							</div>
          	</div>
          	<div className="col-body --center">
          		<Board
          			id="boardYourDeck"
          		 	data={decks}
          		 	className='active'
          		 	type="cards"
          		 	extra={{ subBoard: 'decks' }}/>
          	</div>
          </div>
          :
          <div className="col --center">
          	Add Decks
         	</div>
        }
      	{ showEl.selectedDecks ?
          <div className="col">
          	<div className="col-header">
          		<div className="heading-wrapper">
								<h2>Your Decks</h2>
								{ bool(selectedDecks) ?
									deckLenTxt + cardLenTxt  : ''
								}
							</div>
          	</div>
          	<div className="col-body --center">
          		 <Board
          		 	data={selectedDecks}
          		 	className='active'
          		 	type="cards"
          		 	extra={{ subBoard: 'selected' }}/>
          	</div>
          </div>
          :
          <div className="col --center">
          	Select Decks on the left
         	</div>
        }
     	</div>
    );
  }
}

export default DecksBoard;