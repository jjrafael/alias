import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => {return {
	
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
		  
		},
		dispatch
	 )
}

class DecksBoard extends React.Component {
  render() {
  	const { show } = this.props;
  	const cxShow = show ? 'show' : '';
    return (
      <div className={`col-2 col-decks ${cxShow}`}>
      	<div className="col --center">
      		Decks here
      	</div>
      	<div className="col --center">
      		Selection here
      	</div>
     	</div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DecksBoard);