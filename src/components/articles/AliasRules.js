import React from 'react';

class AliasRulesPart1 extends React.Component {
  render() {
    return (
      <article className="howto-articles">
        <div className="paragraph__block">
          <h5>Alias-related</h5>
          <p>
            There are handful of rules on submitting Alias,
            Keep these on mind to avoid getting reported:
          </p>
          <ul className="list --dot">
            <li>Direct Translation</li>
            <li>Used special characters to seperate words</li>
            <li>Reused an Alias from previous rounds</li>
            <li>Direct Acronym equivalent to any card</li>
            <li>Gave a word which part of a phrase/acronym of any cards</li>
            <li>Alias already existing in the grid</li>
            <li>Shorthand/Plural/Singular word for any card</li>
            <li>Made up illogical/non-existing word to make hints</li>
          </ul>
        </div>
      </article>
    );
  }
}

class AliasRulesPart2 extends React.Component {
  render() {
    return (
      <article className="howto-articles">
        <div className="paragraph__block">
          <h5>Other violations</h5>
          <p>
            Even the alias is valid. There are still some
            cases indentify as violations:
          </p>
          <ul className="list --dot">
            <li>Direct/Indirectly pointed the answer</li>
            <li>Revealed the answer</li>
            <li>Gave hint(s) aside from One-word Alias</li>
            <li>Gave a hint thru movements</li>
            <li>Revealed the Death Card</li>
            <li>Opponent Team violated rules or misbehaved,
              while the other team is still playing</li>
            <li>Other reason as agreed by both teams,
              valid incidents that are not on the rules above</li>
          </ul>
        </div>
      </article>
    );
  }
}

export default {
  part1: {
    header: 'Alias Rules',
    content: AliasRulesPart1
  },
  part2: {
    header: 'Alias Rules',
    content: AliasRulesPart2
  }
};