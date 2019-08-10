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
import { readGame } from '../actions/games';

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
      toggleLoadingOverlay,
      readGame,
      readApp,
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
			cachedUserChecked: false,
			cacheLoaded: false,
			verifyCacheDone: false,
			cachedIds: null,
		}
	}

	componentDidMount() {
		const navigator = window.navigator;
		const { gameId, appId, userId } = getAllLocalStorage();
		const device = {
			device: isMobile(navigator.userAgent) || 'desktop',
			platform: navigator.platform,
			browser: navigator.appCodeName,
		}
		this.props.setDeviceDetails(device);
		this.setState({ device, cachedIds: { gameId, appId, userId } });
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevState.cachedIds !== this.state.cachedIds && this.state.cachedIds){
			this.checkActiveUser();
		}

		if(prevProps.appInitializing !== this.props.appInitializing){
			this.props.toggleLoadingOverlay(this.props.appInitializing, 'Initializing App');
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

	updateLoading(data){
		//update attributes of loading overlay
		this.props.toggleLoadingOverlay(true, data);
	}

	checkActiveUser() {
		//check if there's logged user
		const { userId } = this.state.cachedIds;
		const doneStates = {
			cachedGameChecked: true,
			cachedAppChecked: true,
			cachedUserChecked: true,
			cacheLoaded: false,
			verifyCacheDone: true
		}
		let user = null;

		if(userId){
			this.updateLoading('Verifying Cache...');
			this.props.readUser(userId).then((doc) => {
				user = doc.response.data();
				//if exists and active
				if(doc.response.exists && user.status === 'active' && !doc.error){
					this.checkActiveApp();
				}else{
					this.closeLoading();
					this.setState({ ...doneStates });
				}
			})
		}else{
			this.closeLoading();
			this.setState({ ...doneStates });
		}
	}

	checkActiveApp() {
		//check if there's cached active app
		const { appId } = this.state.cachedIds;
		const doneStates = {
			cachedGameChecked: true,
			cachedAppChecked: true,
			cachedUserChecked: true,
			cacheLoaded: true,
			verifyCacheDone: true
		}
		let app = null;

		if(appId){
			this.updateLoading('Initializing App...');
			this.props.readApp(appId).then((doc) => {
				app = doc.response.data();
				//if exists and active
				if(doc.response.exists && app.status === 'active' && !doc.error){
					this.setState({cachedAppChecked: true, cacheLoaded: true});
					this.checkActiveGame();
				}else{
					this.closeLoading();
					this.setState({ ...doneStates });
				}
			})
		}else{
			this.closeLoading();
			this.setState({ ...doneStates });
		}
	}

	checkActiveGame() {
		//check if there's cached unfinished game
		const { gameId } = this.state.cachedIds;
		const doneStates = {
			cachedGameChecked: true,
			cachedAppChecked: true,
			cachedUserChecked: true,
			cacheLoaded: true,
			verifyCacheDone: true
		}

		if(gameId){
			this.updateLoading('In a moment...');
			this.props.readGame(gameId).then((doc) => {
				//if exists and active
				this.closeLoading();
				this.setState({ ...doneStates });
			})
		}else{
			this.closeLoading();
			this.setState({ ...doneStates });
		}
	}

  	render() {
  		const { user, appDetails } = this.props;
  		const { verifyCacheDone } = this.state;
  		const props = { variables };
  		const isLogged = user && user.is_logged;
  		const isAppReady = (isLogged && !!appDetails && verifyCacheDone);
  		const isTeamReady = isAppReady && false;
  		const isGridReady = isAppReady && false;

	    return (
	      <div className="page" id="MainPage">
	        <Header className={`app-header ${!isAppReady ? 'hide' : ''}`}  />
	        <Body className="app-body">
	        	<Switch>
	        		<Route exact path="/"  render={() => isAppReady ? <HomePage {...props} /> : <SplashPage {...props} /> }/>
	        		<Route exact path="/grid" render={() => isGridReady ? <HomePage {...props} /> : <SplashPage {...props} /> }/>
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
