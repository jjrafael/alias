import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import '../styles/app.css';

//components
import Button from './common/Button';
import Loading from './common/Loading';

//actions
import { toggleLoadingOverlay, initializeApp } from '../actions/app'

const mapStateToProps = state => {return {}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleLoadingOverlay,
      initializeApp
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
		const data = {
			name: 'tester1',
			email: 'tester1@mail.co',
			platform: 'Desktop',
			is_logged: false,
			device: 'ASUS Laptop',
			status: 'active,',
		}
		this.props.toggleLoadingOverlay();
		this.props.initializeApp(data);
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
