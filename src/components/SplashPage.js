import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import '../styles/app.css';

//components
import Button from './common/Button';
import Loading from './common/Loading';

//actions
import { toggleLoadingOverlay } from '../actions/app'

const mapStateToProps = state => {return {}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleLoadingOverlay
    },
    dispatch
  )
}

class SplashPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			loadingTitle: 'Initializing App...'
		}
	}
	openApp = () => {
		this.props.toggleLoadingOverlay();
	}

	render() {
		const { loadingTitle } = this.state;

	    return (
	      <div className="page-wrapper splash-page">
	        <h1>ALIAS</h1>
	        <div className="center">
	        	<Button
	        		text="Click"
	        		className="btn btn-icon btn-l"
	        		onClick={this.openApp}
	        	/>
	        </div>

	        <Loading title={loadingTitle} autoDismiss/>
	      </div>
	    );
  	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashPage);
