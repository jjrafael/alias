import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from '../common/Button';

// actions
import { shiftTurn } from '../../actions/games';

const mapStateToProps = state => {return {
	turnOf: state.game.turnOf,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      shiftTurn
    },
    dispatch
  )
}

class HomePage extends React.Component {
	shiftTurn = () => {
		this.props.shiftTurn();
	}

	render() {
		const { turnOf } = this.props;

	    return (
	      <div className={`page-wrapper home-page`} data-team={turnOf}>
	        <h1>HOME</h1>
	        <div className="center">
	        	<Button
	        		text="Click"
	        		type="link"
	        		link="/"
	        		className="btn btn-icon btn-l"
	        		onClick={this.shiftTurn}
	        	/>
	        </div>
	      </div>
	    );
  	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
