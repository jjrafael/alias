import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

//Components
import Footer from '../Footer';

// actions

const mapStateToProps = state => {return {}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
		  
		},
		dispatch
	 )
}

class DecksFooter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			footOptions: {
				main: {
					text: 'Load',
					onClick: this.props.loadDecks,
				},
				left: {
					text: 'New Deck',
					onClick: this.toggleBoards,
				},
				right: {
					text: 'Home',
					onClick: () => { props.history.push('') },
				},
				copyright: false,
			},
		}
	}

	toggleBoards = () => {
		const { footOptions } = this.state;
		const isDecksBoard = footOptions.left.text === 'New Deck';
		const newText = isDecksBoard ? 'Decks' : 'New Deck';
		const data = {
			...footOptions,
			left: {
				...footOptions.left,
				text: newText,
			}
		}

		this.props.toggleBoards();
		this.setState({ footOptions: data });
	}

  render() {
    const { footOptions } = this.state;
    return (
      <Footer options={footOptions}/>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DecksFooter));