import React from 'react';
//components
import Board from '../common/Board';

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
          	</div>
          	<div className="col-body --center">
          		<Board
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