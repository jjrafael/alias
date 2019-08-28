import React from 'react';

//components
import FormBox from '../forms/FormBox';
import SingleForm from '../forms/SingleForm';
import Board from '../common/Board';

//misc
import aliasCard from '../../config/formData/aliasCard';
import deckOptions from '../../config/formData/deckOptions';
import { makeId } from '../../utils';

class CardsBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deckName: '',
      deckData: null,
      cards: [],
      formInfo: {
        aliasCard: aliasCard,
        deckOptions: deckOptions
      },
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

    if(prevProps.successAdded !== this.props.successAdded && this.props.successAdded){
      this.resetBoard();
    }
  }

  composeDeckData() {
    const { cards, deckName, deckData } = this.state;
    const hasJinx = cards ? cards.filter(d => d.has_jinx_cards) : [];
    let data = null;

    if(deckName){
      data = {
        name: deckName,
        desc: deckData ? deckData.desc : '',
        has_jinx_cards: !!hasJinx,
        is_default_bundle: deckData ? (deckData.is_default_bundle || false) : false,
        status: 'active',
        tags: deckData ? (deckData.tags || []) : [],
        usage_count: 0,
        rating: 0,
        cards: cards,
      }
    }

    this.props.updateNewDeck(data);
  }

  resetBoard() {
    this.setState({
      deckName: '',
      deckData: null,
      cards: [],
    })
  }

  initDeck = (formData) => {
    if(formData){
      this.setState({deckName: formData.name });
    }
  }

  updateDeckData = (formData) => {
    this.setState({ deckData: formData });
  }

  addCard = (formData) => {
    if(formData && formData.text){
      this.setState({ 
        cards: [...this.state.cards, {
          ...formData,
          id: makeId()
        }]
      });
    }
  }

  composeCards(data) {
    return data.map(d => { return {
      data: d,
      backChildren: d && d.jinx_msg ? d.jinx_msg : this.state.deckName,
      type: 'alias-card'
    }});
  }

  render() {
    const { show } = this.props;
    const { deckName, cards, inputData, formInfo } = this.state;
    const cx = {
      col2: show ? 'show' : '',
      board: !!cards ? 'active' : '',
    }
    const showEl = {
      deckForm: !deckName,
      forms: deckName,
      cards: !!cards,
    }
    
    return (
      <div className={`col-2 col-cards ${cx.col2}`}>
      	<div className="col --center">
      		{ showEl.cards ?
            <Board data={this.composeCards(cards)} className={cx.board} type="cards"/>
            : 'Add Cards'
          }
      	</div>
      	<div className="col">
          { !showEl.deckForm ?
            <div className="col-header">
              <div className="heading-wrapper">
                <h2>{deckName}</h2>
              </div>
            </div> : ''
          }
          <div className="col-body --center">
            { showEl.deckForm ?
              <SingleForm 
                formName={`deckName`}
                className="--show-border"
                onSubmit={this.initDeck}
                input={inputData.deck}/> : ''
            }
            { showEl.forms ?
              <div className="forms-container">
                <FormBox
                  clearOnSubmit={true}
                  updateHandler={this.updateDeckData}
                  formInfo={formInfo.deckOptions}/>
                <FormBox
                  onSubmit={this.addCard}
                  clearOnSubmit={true}
                  formInfo={formInfo.aliasCard}/>
              </div> : ''
            }
          </div>
      	</div>
     	</div>
    );
  }
}

export default CardsBoard;