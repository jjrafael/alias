import React from 'react';
import { Link } from 'react-router-dom';

class Button extends React.Component {
  render() {
  	const { className, text, onClick, type, link, children } = this.props;
  	let html = null;

  	switch(type){
  		case 'link':
  			html = <button className={`btn ${className || ''}`} onClick={onClick}>
  				<Link to={link}>{text}</Link>
  				{children}
  			</button>
  		break;
  		default:
  			html = <button className={`btn ${className || ''}`} onClick={onClick}>
  				{text}{children}
  			</button>
  		break;
  	}

    return html;
  }
}

export default Button;
