import React from 'react';

class HowToWin extends React.Component {
  render() {
    return (
      <article className="howto-articles">
        <div className="paragraph__block">
          <p>
            You can win by:
          </p>
          <ul className="list --dot">
            <li>Gaining required trophies per game</li>
            <li>Reporting opponent's alias</li>
            <li>Opponent team reaching violation limit</li>
            <li>Accepting jinx dares</li>
            <li>Avoiding Death cards</li>
          </ul>
        </div>
      </article>
    );
  }
}

export default {
  header: 'How To Win',
  content: HowToWin
};