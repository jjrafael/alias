import React from 'react';
import Card from './Card';
import { bool } from '../../utils';

class Board extends React.Component {
  renderItems() {
    const { data, type } = this.props;
    const html = [];
    
    data.forEach((d, i) => {
      const cx = `board-child ${d.className || ''}`;
      if(type === 'bar'){
        html.push(
          <div
            key={i}
            className={cx} 
            onClick={d.onClick
              ? () => d.onClick(d.data) : () => {}}>
            {d.frontChildren}
          </div>
        )
      }else{
        html.push(
          <Card
            key={i}
            className={cx} 
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
  	const { className, data, type, id } = this.props;
    const cx = className || '';
    const cxType = type ? `--${type}` : '--cards';
    
    return (
      <div id={id || 'board'+type } className={`board ${cxType} ${cx}`}>
        {bool(data) ? this.renderItems() : ''}
      </div>
    )
  }
}

export default Board;