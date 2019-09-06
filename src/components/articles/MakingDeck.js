import React from 'react';

class MakingDeck extends React.Component {
  render() {
    return (
      <article className="howto-articles">
        <div className="paragraph__block">
          <p>
            One great thing about this app is that
            you can make, publish and use your own deck!
            Here's how to make a deck:
          </p>
          <ul className="list --number">
            <li>Go to home page (where you enter team name)</li>
            <li>Go to Decks</li>
            <li>Go to New Deck</li>
            <li>Enter Deck name</li>
            <li>Set if this deck will be part of Default bundle,
              so when you open the app next time,
              your default decks will load instantly</li>
            <li>Add Cards! (and also jinx)</li>
            <li><b>Upload!</b></li>
          </ul>
        </div>
      </article>
    );
  }
}

export default {
  header: 'Making A Deck',
  content: MakingDeck
};