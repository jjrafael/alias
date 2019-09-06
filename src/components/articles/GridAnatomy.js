import React from 'react';

class GridAnatomyPart1 extends React.Component {
  render() {
    return (
      <article className="howto-articles">
        <div className="paragraph__block">
          <h5>The Cards</h5>
          <p>
            Cards are the words with corresponding types,
            sometimes it also has Jinx on it.
            These are the answer(s) which the leader
            needs to think of to submit an Alias
          </p>
          
        </div>
        <div className="paragraph__block">
          <h5>Card Types</h5>
          <ul className="list --dot">
            <li><b>Team cards:</b> your target cards to have points.
              Color is depends on your team's color</li>
            <li><b>Nuetral cards:</b> you'll lose turn.
              Color orange on grid</li>
            <li><b>Death cards:</b> avoid this!
              Your team will automatically lose a round*.
              There's only 1 Death card on the grid</li>
            <li><b>Jinx cards:</b> hidden lies behind a card,
              do a dare to either claim point or avoid losing turns</li>
          </ul>
        </div>
        <div className="paragraph__footer --notes">
          * - depends on configured settings
        </div>
      </article>
    );
  }
}

class GridAnatomyPart2 extends React.Component {
  render() {
    return (
      <article className="howto-articles">
        <div className="paragraph__block">
          <h5>The Grid</h5>
          <p>
            Grid is the board to display all playing cards.
          </p>
        </div>
        <div className="paragraph__block ">
          <h5>Alias</h5>
          <p>
            Alias is a one-word clue that is being sent
            to the rest of the team. Helpful to pick the card
            which is respectively belongs to your team!
            An alias can correspond to 1 or more cards.
          </p>
        </div>
      </article>
    );
  }
}

export default {
  part1: {
    header: 'Grid Anatomy',
    content: GridAnatomyPart1
  },
  part2: {
    header: 'Grid Anatomy',
    content: GridAnatomyPart2
  },
};