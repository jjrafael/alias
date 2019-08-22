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

class CardsBoard extends React.Component {
  render() {
    const { show } = this.props;
    const cxShow = show ? 'show' : '';
    return (
      <div className={`col-2 cards-decks ${cxShow}`}>
      	<div className="col --center">
      		Cards here
      	</div>
      	<div className="col --center">
      		Form here
      	</div>
     	</div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardsBoard);