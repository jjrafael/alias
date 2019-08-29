import React from 'react';
import { randomNumber } from '../../../utils';

class DeckCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reveal: false,
      nuetralMessages: [
        'Oh Sh!t',
        'You sucks!',
        'Bobo',
        'Ampota!',
        'That sucks',
        'Next team!',
        'Haynako',
        'Gurl staph!',
        'Pabebe amp',
        'Kaya pa?',
        'F na F, mali naman',
        'Wrong!',
        'Mali Gags',
        'Huhubels',
        'Magteamwork din minsan!',
        'Kemengina'
      ]
    }
  }

  componentDidUpdate(prevProps){
    if(prevProps.reveal !== this.props.reveal){
      this.setState({ reveal: this.props.reveal });
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
    const { nuetralMessages } = this.state;
    const num = randomNumber(nuetralMessages.length);
    let html = null;

    if(type === 'none'){
      html = (
        <div className={`card-back__inner --${type}`}>
          {nuetralMessages[num]}
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
