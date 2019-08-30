import React from 'react';
import Card from './Card';
import { bool } from '../../utils';

class Board extends React.Component {
  renderItems() {
    const { data, type } = this.props;
    const html = [];

    data.forEach((d, i) => {
      if(type === 'bar'){
        html.push(
          <div
            key={i}
            className="board-child" 
            onClick={d.onClick}>
            {d.frontChildren}
          </div>
        )
      }else{
        html.push(
          <Card
            key={i}
            className={`board-child ${d.className}`} 
            type={d.type} 
            backChildren={d.backChildren}
            onClick={d.onClick}
            data={d.data}
            {...this.props.extra}
            flipOver>
            {d.frontChildren}
          </Card>
        );
      }
    })

    return html;
  }

  render() {
  	const { className, data, type } = this.props;
    const cx = className || '';
    const cxType = type ? `--${type}` : '--cards';
    
    return (
      <div className={`board ${cxType} ${cx}`}>
        {bool(data) ? this.renderItems() : ''}
      </div>
    )
  }
}

export default Board;