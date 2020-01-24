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
					onClick: this.props.toggleBoards,
				},
				right: {
					text: 'Home',
					onClick: () => { props.history.push('') },
				},
				copyright: false,
			},
		}
	}

	componentDidMount() {
		this.toggleBoardData();
	}

	componentDidUpdate(prevProps) {
		if(prevProps.board !== this.props.board){
			this.toggleBoardData();
		}
	}

	toggleBoardData = () => {
		const { footOptions } = this.state;
		const isCardsBoard = this.props.board === 'cards';
		const text = {
			main: isCardsBoard ? 'Upload' : 'Load',
			left: isCardsBoard ? 'Decks' : 'New Deck',
		}
		const onClick = {
			main: isCardsBoard ? this.props.uploadDeck : this.props.loadDecks,
		}
		const data = {
			...footOptions,
			main: {
				...footOptions.main,
				text: text.main,
				onClick: onClick.main,
			},
			left: {
				...footOptions.left,
				text: text.left,
			}
		}
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