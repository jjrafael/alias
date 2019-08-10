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
import Loading from './common/Loading';

//actions
import { setDeviceDetails, readApp, readUser, toggleLoadingOverlay } from '../actions/app';
import { setGame } from '../actions/games';

//misc
import { isMobile } from '../utils/app';
import { 
	setLocalStorage, 
	getAllLocalStorage } from '../utils';
import { variables } from '../config';

const mapStateToProps = state => {return {
	user: state.app.user,
	appDetails: state.app.appDetails,
	appInitializing: state.app.appInitializing,
	readingApp: state.app.readingApp,
	readingUser: state.app.readingUser,
	loading: state.app.loading,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setDeviceDetails,
      setGame,
      readApp,
      toggleLoadingOverlay,
      readUser
    },
    dispatch
  )
}

class MainView extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			device: null,
			cachedGameChecked: false,
			cachedAppChecked: false,
		}
	}

	componentDidMount() {
		const navigator = window.navigator;
		const { gameId, appId } = getAllLocalStorage();
		const device = {
			device: isMobile(navigator.userAgent) || 'desktop',
			platform: navigator.platform,
			browser: navigator.appCodeName,
		}
		this.props.setDeviceDetails(device);
		this.setState({device});
			
		//check if there's cached active app
		if(appId){
			this.props.toggleLoadingOverlay(true, 'Verifying Cache..');
			this.checkActiveApp(appId);

			//check if there's cached active game
			if(gameId){
				this.checkActiveGame(gameId);
			}else{
				this.setState({cachedGameChecked: true});
			}
		}else{
			this.setState({cachedAppChecked: true});
		}
	}

	componentDidUpdate(prevProps) {
		if(prevProps.appInitializing !== this.props.appInitializing){
			this.props.toggleLoadingOverlay(this.props.appInitializing, 'Initializing App');
		}

		if(prevProps.readingApp !== this.props.readingApp && !this.props.readingApp){
			this.closeLoading();
		}

		if(prevProps.readingUser !== this.props.readingUser && !this.props.readingUser){
			this.closeLoading();
		}

		if(prevProps.appDetails !== this.props.appDetails && !!this.props.appDetails){
			//save to local app details
			if(this.props.appDetails.id){
				setLocalStorage('alias_appId', this.props.appDetails.id);
				setLocalStorage('alias_app', JSON.stringify(this.props.appDetails));
			}
		}
	}

	closeLoading() {
		//closing loading overlay
		this.props.toggleLoadingOverlay();
	}

	checkActiveApp(id) {
		let app = null;

		this.props.readApp(id).then((doc) => {
			app = doc.response.data();
			//if exists and active
			if(doc.response.exists && app.status === 'active'){
				this.setState({cachedAppChecked: true});
			}
		})
	}

	checkActiveGame(id) {
		const game = null;

		if(game){
			this.props.setGame({...game, id});
			this.setState({cachedGameChecked: true});
		}
	}

  	render() {
  		const { user, appDetails } = this.props;
  		const { cachedAppChecked } = this.state;
  		const props = { variables };
  		const isLogged = user && user.is_logged;
  		const isAppReady = (isLogged && !!appDetails && cachedAppChecked);
  		// const isGameReady = isAppReady && cachedGameChecked;
  		const isTeamReady = false;

	    return (
	      <div className="page" id="MainPage">
	        <Header className={`app-header ${!isAppReady ? 'hide' : ''}`}  />
	        <Body className="app-body">
	        	<Switch>
	        		<Route exact path="/"  render={() => isAppReady ? <HomePage {...props} /> : <SplashPage {...props} /> }/>
	        		<Route exact path="/home"render={() => isAppReady ? <HomePage {...props} /> : <SplashPage {...props} /> }/>
	        		<Route exact path="/build-team" render={() => isTeamReady ? <BuildTeamPage {...props} /> : <SplashPage {...props} />}/>
	        		<Route  render={() => <SplashPage {...props} /> }/>
	        	</Switch>
	        </Body>

	        <Loading />
	      </div>
	    );
  	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainView));
