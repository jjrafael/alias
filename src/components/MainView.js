import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Header from './Header';
import Body from './Body';
import Loading from './common/Loading';
import ModalSignOut from './modal/ModalSignOut';
import ModalEnterCode from './modal/ModalEnterCode';
import ModalWarning from './modal/ModalWarning';

//pages
import SplashPage from './SplashPage';
import HomePage from './HomePage';
import BuildTeamPage from './BuildTeamPage';
import GridPage from './GridPage';
import LeaderPage from './LeaderPage';
import DecksPage from './DecksPage';

//actions
import { 
	setDeviceDetails, 
	readApp, 
	readUser, 
	toggleWarningModal,
	toggleLoadingOverlay } from '../actions/app';
import { readGame } from '../actions/games';
import { readTeam, resetTeams } from '../actions/teams';

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
      toggleWarningModal,
      readGame,
      readApp,
      readUser,
      readTeam,
      resetTeams
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

		if(prevProps.gameDetails !== this.props.gameDetails){
			this.setState({ inGame: this.props.gameDetails && this.props.gameDetails.status === 'active' });
			if(this.props.gameDetails && this.props.gameDetails.status === 'active'){
				setLocalStorage('alias_gameId', this.props.gameDetails.id);
			}
		}
	}

	setDefaultState() {
		this.setState({
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
		})
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
				}else if(doc.error){
					this.closeLoading();
					this.setState({ ...doneStates });
					this.props.toggleWarningModal(true, {
						title: 'Network Error',
						message: doc.error.message
					});
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
		const { appId } = this.state.cachedIds;
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
					this.checkActiveTeam();
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
		const { user, appDetails, readTeam, resetTeams } = this.props;
		const { cachedIds } = this.state;
		const isLogged = user && user.is_logged;
		const isAppReady = (isLogged && appDetails && appDetails.status === 'active');
		const isTeam = isAppReady && user.role === 'team';
		const teamNumber = isTeam && user.id === appDetails.team1_user_key ? 1 : 2;
		const teamId = cachedIds['team'+teamNumber+'Id'];
		const oppositeTeam = teamNumber === 1 ? 2 : 1;
		
		if(isAppReady && isTeam){
			//for build team page
			this.setState({ role: 'team' });
			if(teamId){
				this.setState({ isTeamConnected: true, teamNumber });
				readTeam(teamId).then(doc => {
					const cond = {key: 'status', value: 'active'};
					const response = getResponse(doc, cond);
					if(response){
						this.setState({ team: response });
						deleteLocalStorage('alias_team'+oppositeTeam+'Id');
						resetTeams(oppositeTeam);
					}
				});
			}
		}else if(isAppReady && !isTeam){
			//for grid page
			const { team1Id, team2Id } = cachedIds;
			if(team1Id && team2Id){
				readTeam(team1Id);
				readTeam(team2Id);
			}
		}
	}

	renderPages(isAppReady, isTeam) {
		const { hasModals } = this.props;
		const { team, isTeamConnected, inGame } = this.state;
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
				html = <LeaderPage {...props.general} />;
			}else if(isTeam && !inGame){
				//team leader and adding members
				html = <BuildTeamPage {...props.general} />;
			}else if(!isTeam && inGame){
				//grid and already in play: GridPage
				html = <GridPage {...props.general} />;
			}else if(!isTeam && !inGame){
				//grid and building team
				html = (
					<Switch>
						<Route exact path="/" render={() => <HomePage {...props.home} />}/>
						<Route exact path="/decks" render={() => <DecksPage {...props.general} />}/>
					</Switch>
				);
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
  		const isTeam = user && user.role === 'team';
  		const cxDevice = device ? device.device : 'desktop';
  		const cxHeader = isAppReady ? '' : '--splash';
  		const headerProps = { isAppReady, isTeam, inGame };

	    return (
	      <div className={`page --${cxDevice}`} id="MainPage">
	      	<Header className={`app-header ${cxHeader}`} headerProps={headerProps}/>
	        <Body className="app-body">
	        	{this.renderPages(isAppReady, isTeam)}
	        </Body>
	        <ModalWarning />
	        <ModalSignOut />
	        <ModalEnterCode />
	        <Loading />
	      </div>
	    );
  	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainView));
