import React from 'react';

class DeckCard extends React.Component {
  renderSneaks(data) {
    const len = 3;
    const cardsMore = data.length - len;
    const sneackItems = data.slice(0, len);
    const hasCards = (data && sneackItems);
    let html = [];

    if(hasCards){
      sneackItems.forEach((d, i) => {
        html.push(<li key={i}>{d.text},</li>)
      })
    }

    if(hasCards && cardsMore){
      html.push(<li key="etc" className="more">+{cardsMore} more</li>)
    }

    return <ul className="sneak-items">{html}</ul>
  }

  clickCard(data){
    const { onClick, subBoard } = this.props;
    if((subBoard === 'decks' && !data.selected) ||
      (subBoard === 'selected' && data.selected)) {
      onClick(data);
    }
  }

  render() {
  	const { className, type, size, flipOver, data, subBoard } = this.props;
    const cx = {
      size: size ? `card-${size}` : 'card-reg',
      card: className || '',
      type: type || '',
      flip: flipOver ? '--flipover' : '',
      selected: data.selected && subBoard === 'decks' ? '--selected' : ''
    }

    return ( 
      <div onClick={() => this.clickCard(data)}
        className={`card card-flip-up ${cx.selected} ${cx.size} ${cx.card} ${cx.type} ${cx.flip}`}>
        <div className="card-front">
          {data ?  data.name : 'Deck No.'+(data.index + 1)}
        </div>
        <div className={`card-back ${data && data.has_jinx_cards ? '--jinx' : ''}`}>
          <div className="card-back__wrapper">
            {this.renderSneaks(data.cards)}
          </div>
        </div>
      </div>
    )
  }
}

export default DeckCard;
