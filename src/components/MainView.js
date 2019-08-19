import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Header from './Header';
import Body from './Body';
import SplashPage from './SplashPage';
import HomePage from './HomePage';
import BuildTeamPage from './BuildTeamPage';
import GridPage from './GridPage';
import Loading from './common/Loading';
import ModalSignOut from './modal/ModalSignOut';
import ModalEnterCode from './modal/ModalEnterCode';

//actions
import { 
	setDeviceDetails, 
	readApp, 
	readUser, 
	toggleLoadingOverlay } from '../actions/app';
import { readGame } from '../actions/games';
import { readTeam } from '../actions/teams';

//misc
import { isMobile } from '../utils/app';
import { 
	setLocalStorage, 
	getAllLocalStorage,
	clearLocalStorage,
	deleteLocalStorage,
	getResponse } from '../utils';
import { variables } from '../config';

const mapStateToProps = state => {return {
	team1: state.team.team1,
	team2: state.team.team2,
	user: state.app.user,
	appDetails: state.app.appDetails,
	gameDetails: state.game.gameDetails,
	appInitializing: state.app.appInitializing,
	readingApp: state.app.readingApp,
	readingUser: state.app.readingUser,
	gameStarting: state.game.gameStarting,
	loading: state.app.loading,
	hasModals: state.app.showModalSignout ||
		state.app.showModalResetGame ||
		state.app.showModalRestartGame ||
		state.app.showModalResetTeam ||
		state.app.showModalEnterCode,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setDeviceDetails,
      toggleLoadingOverlay,
      readGame,
      readApp,
      readUser,
      readTeam
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
			isTeamConnected: false,
			cachedIds: null,
			team: null,
			role: 'grid',
			inGame: false,
			teamNumber: null,
		}
	}

	componentDidMount() {
		const navigator = window.navigator;
		const cachedIds = getAllLocalStorage();
		const device = {
			device: isMobile(navigator.userAgent) ? 'mobile' : 'desktop',
			platform: navigator.platform,
			browser: navigator.appCodeName,
		}
		this.props.setDeviceDetails(device);
		this.setState({ device, cachedIds: cachedIds });
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
			}
		}

		if(prevProps.gameStarting !== this.props.gameStarting){
			this.props.toggleLoadingOverlay(this.props.gameStarting, 'Starting Game...');
		}

		if(prevProps.gameDetails !== this.props.gameDetails && this.props.gameDetails){
			if(this.props.gameDetails.status === 'active'){
				this.setState({ inGame: true });
				setLocalStorage('alias_gameId', this.props.gameDetails.id);
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

		if(userId){
			this.updateLoading('Verifying Cache...');
			this.props.readUser(userId, true).then((doc) => {
				//if exists and active
				const cond = {key: 'status', value: 'active'};
				const response = getResponse(doc, cond);
				if(response){
					this.checkActiveApp();
				}else{
					clearLocalStorage();
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
		const { user } = this.props;
		const { appId } = this.state.cachedIds;
		const isTeam = user && user.role === 'team';
		const doneStates = {
			cachedGameChecked: true,
			cachedAppChecked: true,
			cachedUserChecked: true,
			cacheLoaded: true,
			verifyCacheDone: true
		}

		if(appId){
			this.updateLoading('Initializing App...');
			this.props.readApp(appId).then((doc) => {
				//if exists and active
				const cond = {key: 'status', value: 'active'};
				const response = getResponse(doc, cond);
				if(response){
					this.setState({cachedAppChecked: true, cacheLoaded: true});
					this.checkActiveGame();

					if(isTeam){
						this.setState({ role: 'team' });
						this.checkActiveTeam();
					}
				}else{
					deleteLocalStorage([
						'alias_appId', 
						'alias_gameId', 
						'alias_team1Id', 
						'alias_team2Id'
					]);
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
				this.closeLoading();
				this.setState({ ...doneStates });
			})
		}else{
			deleteLocalStorage(['alias_game', 'alias_gameId']);
			this.closeLoading();
			this.setState({ ...doneStates });
		}
	}

	checkActiveTeam() {
		const { user, appDetails, readTeam } = this.props;
		const { cachedIds } = this.state;
		const isLogged = user && user.is_logged;
  		const isAppReady = (isLogged && appDetails && appDetails.status === 'active');
  		const isTeam = isAppReady && user.role === 'team';
  		const teamNumber = isTeam && user.id === appDetails.team1_user_key ? 1 : 2;
  		const teamId = cachedIds['team'+teamNumber+'Id'];
  		
  		if(teamId && isAppReady){
  			this.setState({ isTeamConnected: true, teamNumber });
  			readTeam(teamId).then(doc => {
  				const cond = {key: 'status', value: 'active'};
  				const response = getResponse(doc, cond);
  				if(response){
  					this.setState({ team: response });
  				}
  			});
  		}
	}

	renderPages(isAppReady) {
		const { hasModals, user } = this.props;
		const { team, isTeamConnected, inGame } = this.state;
		const isTeam = user && user.role === 'team';
		const generalProps = { variables, hasModals, team };
		let html = null;
		const props = {
			general: generalProps,
			home: {...generalProps, isTeamConnected},
		}

		if(isAppReady){
			//user already logged, app is initialized
			if(isTeam && inGame){
				//team leader and already in play: LeaderPage
				html = <SplashPage {...props.general} />;
			}else if(isTeam && !inGame){
				//team leader and adding members
				html = <BuildTeamPage {...props.general} />;
			}else if(!isTeam && inGame){
				//grid and already in play: GridPage
				html = <GridPage {...props.general} />;
			}else if(!isTeam && !inGame){
				//grid and building team
				html = <HomePage {...props.home} />;
			}else{
				//something went wrong
				html = <SplashPage {...props.general} />;
			}
		}else{
			//no user logged and/or app wasn't initialized yet
			html = <SplashPage {...props.general} />;
		}

		return html;
	}

  	render() {
  		const { user, appDetails } = this.props;
  		const { verifyCacheDone, device, inGame } = this.state;
  		const isLogged = user && user.is_logged;
  		const isAppReady = (isLogged && !!appDetails && verifyCacheDone);
  		const cxDevice = device ? device.device : 'desktop';
  		const cxHeader = isAppReady ? '' : '--splash';
  		
	    return (
	      <div className={`page --${cxDevice}`} id="MainPage">
	      	<Header
	      		className={`app-header ${cxHeader}`}
	      		isAppReady={isAppReady}/>
	        <Body className="app-body">
	        	{this.renderPages(isAppReady, inGame)}
	        </Body>
	        <ModalSignOut />
	        <ModalEnterCode />
	        <Loading />
	      </div>
	    );
  	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainView));
