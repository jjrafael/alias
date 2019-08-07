import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Button from './common/Button';
import Loading from './common/Loading';
import Card from './common/Card';
import CardsCol from './common/CardsCol';

//actions
import { toggleLoadingOverlay, initializeApp } from '../actions/app';

//misc
import { getNow } from '../utils';

const mapStateToProps = state => {
	return {
		deviceDetails: state.app.deviceDetails,
		user: state.app.user,
	}
}

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
		const { deviceDetails, user } = this.props;
		const now = getNow();
		const data = {
			name: 'tester3',
			email: 'tester3@mail.co',
			platform: deviceDetails.platform,
			is_logged: user.isLoggedIn,
			device: deviceDetails.device,
			browser: deviceDetails.browser,
			status: 'active,',
			type: user.type,
			created_time: now,
			last_logged_time: now,
		}
		this.props.toggleLoadingOverlay();
		this.props.initializeApp(data);
	}

	render() {
		const { loadingTitle } = this.state;

	    return (
	      <div className="page-wrapper splash-page">
	      	<div className="splash-tilt">
	      		<CardsCol count={20}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      	</div>
	      	<div className="splash-logo-wrapper">
	      		<div className="logo-typography">
	      			<span>A</span>
	      			<span>L</span>
	      			<span>I</span>
	      			<span>A</span>
	      			<span>S</span>
	      		</div>
		        <div className="center">
		        	<Button
		        		text="Click"
		        		className="btn btn-icon btn-l"
		        		onClick={this.openApp}
		        	/>
		        </div>
	      	</div>
	        
	        <Loading title={loadingTitle} autoDismiss/>
	      </div>
	    );
  	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashPage);
