import React from 'react';

class Card extends React.Component {
  renderCardBack(element) {
    const { backChildren } = this.props;
    return element || backChildren || <div className="card-back__emblem">A</div>
  }

  render() {
  	const { className, type, size, children, backChildren, flipOver, data } = this.props;
    const cxSize = size ? `card-${size}` : 'card-reg';
    const cxClassName = className || '';
    const cxType = type || '';
    const cxFlip = flipOver ? '--flipover' : '';
  	let html = null;
    
  	switch(type){
  		case 'splash-cards':
  			html = <div className={`card ${cxSize} ${cxClassName} ${cxType} ${cxFlip}`}>
          <div className="card-front">{children}</div>
          <div className="card-back">{this.renderCardBack()}</div>
  			</div>
  		break;
      case 'members-card':
        html = <div className={`card ${cxSize} ${cxClassName} ${cxType} ${cxFlip}`}>
          <div className="card-front" style={data && {backgroundColor: data.color}}>{data ? data.name : ''}</div>
          <div className="card-back">{this.renderCardBack()}</div>
        </div>
      break;
  		default:
  			html = <div className={`card ${cxSize} ${cxClassName} ${cxType} ${cxFlip}`}>
          <div className="card-front">{children}</div>
          <div className="card-back">{backChildren}</div>
        </div>
  		break;
  	}

    return html;
  }
}

export default Card;
