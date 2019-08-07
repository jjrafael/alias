import React from 'react';

class CardsCol extends React.Component {
  renderCards() {
    const { count, children } = this.props;
    const html = [];
    for(var i = 1; i < count; i++){
      html.push(children);
    }

    return html;
  }

  render() {
  	const { className, count, children } = this.props;

    return (
      <div className={`cardscol ${className}`}>
        {count && count > 1 ? this.renderCards(count) : children}
      </div>
    )
  }
}

export default CardsCol;