import React from 'react';

class HowToPlayPart1 extends React.Component {
  render() {
    return (
      <article className="howto-articles">
        <div className="paragraph__block --line-below">
          <h5>In One-word Clue:</h5>
          <h3>Codename</h3>
          <p>
            A web app/game inspired by Codename Boardgame,
            made more customizable and more fun!
          </p>
        </div>
        <div className="paragraph__block">
          <h5>Getting Started</h5>
          <ul className="list --number">
            <li>Start App</li>
            <li>Generate Team code by entering team name</li>
            <li>On other device, enter team code</li>
            <li>Each team should have seperate device</li>
            <li>Add members</li>
            <li>Play!</li>
          </ul>
        </div>
      </article>
    );
  }
}

class HowToPlayPart2 extends React.Component {
  render() {
    return (
      <article className="howto-articles">
        <div className="paragraph__block">
          <h5>In Game</h5>
          <ul className="list --number">
            <li>Once ready, start first round!</li>
            <li>App will randomly pick team</li>
            <li>Team leader will submit one-word clue or 'alias'</li>
            <li>The rest of the team will choose the card(s)
              that corresponds the given 'alias'</li>
            <li>Decide quickly as time ticks away*</li>
            <li>If correct, you got points.
              If not, its end of your team's turn.
              Opponent will take turn</li>
            <li>First to get three trophies* WIN!</li>
            <li>Or first to get 5 violations*,
              opponent team will win instead!</li>
            <li>Avoid picking 'Death Card'*! It will end the round and opponent will get a trophy.</li>
          </ul>
        </div>
        <div className="paragraph__footer --notes">
          * - depends on configured settings
        </div>
      </article>
    );
  }
}

export default {
  part1: {
    header: 'How To Play',
    content: HowToPlayPart1
  },
  part2: {
    header: 'How To Play',
    content: HowToPlayPart2
  },
};