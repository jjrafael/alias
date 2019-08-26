import React from 'react';
import Card from './Card';

class Board extends React.Component {
  renderItems(data) {
    const html = [];

    data.forEach((d, i) => {
      html.push(
        <Card
          key={i}
          className={d.className} 
          type={d.type} 
          backChildren={d.backChildren}
          data={d.data}
          flipOver>
          {d.frontChildren}
        </Card>
      );
    })

    return html;
  }

  render() {
  	const { className, data, type } = this.props;
    const cx = className || '';
    const cxType = type ? `--${type}` : '--cards';
    
    return (
      <div className={`board ${cxType} ${cx}`}>
        {data ? this.renderItems(data) : ''}
      </div>
    )
  }
}

export default Board;