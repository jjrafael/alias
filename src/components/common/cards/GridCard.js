import React from 'react';

class DeckCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reveal: false,
    }
  }

  componentDidMount(){
    if(this.props.data.revealed){
      this.setState({ reveal: true });
    }
  }

  revealCard(data){ 
    const { onClick } = this.props;
    
    if(onClick){
      onClick(data);
      this.setState({ reveal: true });
    }
  }

  renderLayer(type, team){
    let html = null;

    if(type === 'none'){
      html = (
        <div className={`card-back__inner --${type}`}>
          Wrong!
        </div>
      )
    }else if(type === 'team1' || type === 'team2'){
      html = (
        <div className={`card-back__inner --${type}`}>
          {team}
        </div>
      )
    }else if(type === 'death'){
      html = (
        <div className={`card-back__inner --${type}`}>
          You're Dead!
        </div>
      )
    }

    return html;
  }

  renderBack(){
    const { type, team } = this.props.data;
    const { reveal } = this.state;
    let html = null;

    if(reveal){
      html = this.renderLayer(type, team);
    }else{
      html = <div className="card-back__emblem">A</div>
    }

    return html;
  }

  render() {
  	const { flipOver, data } = this.props;
    const { reveal } = this.state;
    const cx = {
      flipUp: reveal ? 'nonflip-up' : 'nonflippable',
      flip: flipOver && !reveal ? '--flipover' : '',
    }

    return ( 
      <div onClick={() => this.revealCard(data)}
        className={`card grid-card card-flip-up card-reg ${cx.flipUp} ${cx.type} ${cx.flip}`}>
        <div className="card-front">
          {data.text}
        </div>
        <div className="card-back">
          <div className="card-back__wrapper">
            {this.renderBack()}
          </div>
        </div>
      </div>
    )
  }
}

export default DeckCard;
