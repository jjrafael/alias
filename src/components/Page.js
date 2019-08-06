import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Header from './Header';
import Body from './Body';
import SplashPage from './SplashPage';
import HomePage from './HomePage';
import BuildTeamPage from './BuildTeamPage';

//actions
import { setDeviceDetails } from '../actions/app';

//misc
import { isMobile } from '../utils/app';
import { variables } from '../config';

const mapStateToProps = state => {return {}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setDeviceDetails
    },
    dispatch
  )
}

class Page extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			device: null,
		}
	}

	componentDidMount() {
		const navigator = window.navigator;
		const device = {
			device: isMobile(navigator.userAgent) || 'desktop',
			platform: navigator.platform,
			browser: navigator.appCodeName,
		}
		this.props.setDeviceDetails(device);
		this.setState({device});
	}

  	render() {
  		const props = { variables };

	    return (
	      <div className="page" id="MainPage">
	        <Header className="app-header" />
	        <Body className="app-body">
	        	<Switch>
	        		<Route exact path="/"  render={() => <SplashPage {...props} /> }/>
	        		<Route exact path="/home"render={() => <HomePage {...props} /> }/>
	        		<Route exact path="/build-team" render={() => <BuildTeamPage {...props} /> }/>
	        		<Route  render={() => <SplashPage {...props} /> }/>
	        	</Switch>
	        </Body>
	      </div>
	    );
  	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Page));
