import React from 'react';

class Card extends React.Component {
  renderCardBack() {
    const {backChildren} = this.props;
    return (
      <div className="card-back">
        <div className="card-back__emblem">
          A
        </div>
        {backChildren}
      </div>
    )
  }

  render() {
  	const { className, type, size, children, backChildren } = this.props;
  	let html = null;

  	switch(type){
  		case 'splash-cards':
  			html = <div className={`card card-${size || 'reg'} ${className || ''} ${type || ''}`}>
          <div className="card-front">{children}</div>
          {this.renderCardBack()}
  			</div>
  		break;
  		default:
  			html = <div className={`card card-${size || 'reg'} ${className || ''} ${type || ''}`}>
          <div className="card-front">{children}</div>
          <div className="card-back">{backChildren}</div>
        </div>
  		break;
  	}

    return html;
  }
}

export default Card;
