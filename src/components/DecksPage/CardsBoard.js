import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import FormBox from '../forms/FormBox';
import SingleForm from '../forms/SingleForm';
import Board from '../common/Board';

//misc
import aliasCard from '../../config/formData/aliasCard';

const mapStateToProps = state => {return {
	
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
		  
		},
		dispatch
	 )
}

class CardsBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deckName: '',
      deckData: null,
      cards: [],
      inputData: {
        deck: {
          id: 'name',
          type: 'text',
          placeholder: '',
          label: 'Deck Name',
          showLabel: true,
          required: true,
          validations: ['charMax-50'],
          enableEnter: true,
        },
        options: {},
      }
    }
  }

  componentDidUpdate(prevProps, prevState){
    if((prevState.deckName !== this.state.deckName) ||
      (prevState.deckData !== this.state.deckData) ||
      (prevState.cards !== this.state.cards)){
      this.composeDeckData();
    }
  }

  composeDeckData() {
    const { cards, deckName, deckData } = this.state;
    const hasJinx = cards ? cards.filter(d => d.jinx_text) : [];
    let data = null;

    if(deckName){
      data = {
        name: deckName,
        desc: deckData ? deckData.desc : '',
        has_jinx_cards: !!hasJinx,
        is_default_bundle: deckData ? deckData.isDefault : false,
        status: 'active',
        tags: deckData ? deckData.tags : [],
        usage_count: 0,
        rating: 0,
        cards: cards,
      }
    }
    this.props.updateNewDeck(data);
  }

  initDeck = (formData) => {
    if(formData){
      this.setState({deckName: formData.name });
    }
  }

  addCard = (formData) => {
    if(formData && formData.text){
      this.setState({ cards: [...this.state.cards, formData] });
    }
  }

  composeCards(data) {
    return data.map(d => { return {
      data: d,
      backChildren: this.state.deckName,
      type: 'alias-card'
    }});
  }

  render() {
    const { show } = this.props;
    const { deckName, cards, inputData } = this.state;
    const cx = {
      col2: show ? 'show' : '',
      board: !!cards ? 'active' : '',
    }
    const showEl = {
      deckForm: !deckName,
      cardForm: deckName,
      options: deckName,
      cards: cards,
    }
    
    return (
      <div className={`col-2 cards-decks ${cx.col2}`}>
      	<div className="col --center">
      		{ showEl.cards ?
            <Board data={this.composeCards(cards)} className={`--hor-scroll ${cx.board}`} type="cards"/>
            : 'Add Cards'
          }
      	</div>
      	<div className="col --center">
      		{ showEl.deckForm ?
            <SingleForm 
              formName={`deckName`}
              className="--show-border"
              onSubmit={this.initDeck}
              input={inputData.deck}/> :
            <div className="heading-wrapper">
              <h2>{deckName}</h2>
            </div>
          }
          { showEl.options ?
            '' : ''
          }
          { showEl.cardForm ?
            <FormBox 
              formName={`cardName`}
              onSubmit={this.addCard}
              clearOnSubmit={true}
              formInfo={aliasCard}/>
            : ''
          }
      	</div>
     	</div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardsBoard);