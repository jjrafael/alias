import React from 'react';

class Card extends React.Component {
  render() {
  	const { className, type, size, children } = this.props;
  	let html = null;

  	switch(type){
  		case 'splash-cards':
  			html = <div className={`card card-${size} ${className}`}>
  				{children}
  			</div>
  		break;
  		default:
  			html = <div className={`card card-${size} ${className}`}>
          {children}
        </div>
  		break;
  	}

    return html;
  }
}

export default Card;
