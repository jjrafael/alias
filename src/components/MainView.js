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
import ModalHowToPlay from './modal/ModalHowToPlay';

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
import { browseDecks, setPlayingDecks } from '../actions/cards';
import { readTeam, resetTeams } from '../actions/teams';

//misc
import { isMobile } from '../utils/app';
import { 
	bool,
	setLocalStorage, 
	getAllLocalStorage,
	clearLocalStorage,
	deleteLocalStorage,
	getResponse } from '../utils';
import { variables } from '../config';

const mapStateToProps = state => {return {
	decks: state.cards.decks,
	playingDecks: state.cards.playingDecks,
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
      resetTeams,
      browseDecks,
      setPlayingDecks
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
			page: null,
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
			if(this.props.appDetails.id && this.props.appDetails.status === 'active'){
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
		
		if(prevProps.decks !== this.props.decks){
			if(!bool(this.props.playingDecks) && !bool(prevProps.playingDecks) && !bool(prevProps.decks)){
				//load default bundle
				const defaultDecks = this.getDefaultBundle(this.props.decks);
				this.props.setPlayingDecks(defaultDecks);
			}
		}

		if((prevProps.gameDetails !== this.props.gameDetails) ||
			(prevProps.user !== this.props.user) ||
			(prevProps.appDetails !== this.props.appDetails) ||
			(prevState.verifyCacheDone !== this.state.verifyCacheDone) ||
			(prevState.team !== this.state.team)){
			this.setPage(
				this.props.user, 
				this.props.appDetails, 
				this.props.gameDetails,
				this.state.verifyCacheDone,
				this.state.team);
		}
	}

	setPage(user, appDetails, gameDetails, verifyCacheDone, team) {
		const { inGame } = this.state;
		const isLogged = user && user.is_logged;
		const isAppReady = (isLogged && bool(appDetails) && verifyCacheDone);
		const isTeam = user && user.role === 'team';
		let page = null;

		if(isAppReady){
			//user already logged, app is initialized
			if(isTeam && inGame){
				//team leader and already in play: LeaderPage
				page = 'leader';
			}else if(isTeam && !inGame){
				//team leader and adding members
				page = 'buildTeam';
			}else if(!isTeam && inGame){
				//grid and already in play: GridPage
				page = 'grid';
			}else if(!isTeam && !inGame){
				//decks and building team
				page = 'home';
			}else{
				//something went wrong
				page = 'error';
			}
		}else{
			//no user logged and/or app wasn't initialized yet
			page = 'splash';
		}

		this.setState({ page });
	}

	getDefaultBundle(decks) {
		if(bool(decks)){
			return decks.filter(d => d.is_default_bundle);
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
					if(response.role === 'grid'){
						this.props.browseDecks();
					}
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
					this.setState({
						cachedAppChecked: true, 
						cacheLoaded: true
					});
					this.checkActiveGame();
					this.checkActiveTeam();
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
			deleteLocalStorage('alias_gameId');
			this.closeLoading();
			this.setState({ ...doneStates });
		}
	}

	checkActiveTeam() {
		const { user, appDetails, readTeam, resetTeams } = this.props;
		const { cachedIds } = this.state;
		const isLogged = user && user.is_logged;
		const isAppActive = appDetails && appDetails.status === 'active';
		const isAppReady = isLogged && isAppActive;
		const isTeam = isAppReady && user.role === 'team';
		const teamNumber = isTeam && user.id === appDetails.team1_user_key ? 1 : 2;
		const teamId = cachedIds['team'+teamNumber+'Id'];
		const oppositeTeam = Number(teamNumber) === 1 ? 2 : 1;
		
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

	renderPages() {
		const { hasModals } = this.props;
		const { page, isTeamConnected } = this.state;
		const generalProps = { variables, hasModals };
		let html = null;
		const props = {
			general: generalProps,
			home: {...generalProps, isTeamConnected},
		}

		if(page === 'splash'){
			html = <SplashPage {...props.general} />
		}else if(page === 'home'){
			html = (
				<Switch>
					<Route
						exact path="/" 
						render={() => <HomePage {...props.home} />}/>
					<Route 
						exact path="/decks" 
						render={() => <DecksPage {...props.general} />}/>
				</Switch>
			); 
		}else if(page === 'buildTeam'){
			html = <BuildTeamPage {...props.general} />
		}else if(page === 'leader'){
			html = <LeaderPage {...props.general} />
		}else if(page === 'grid'){
			html = <GridPage {...props.general} />
		}else if(page === 'error'){
			html = <SplashPage {...props.general} />
		}else{
			html = <SplashPage {...props.general} />
		}

		return html;
	}

  	render() {
  		const { user, appDetails } = this.props;
  		const { verifyCacheDone, device, inGame, page } = this.state;
  		const isLogged = user && user.is_logged;
  		const isAppReady = (isLogged && !!appDetails && verifyCacheDone);
  		const isTeam = user && user.role === 'team';
  		const cxDevice = device ? device.device : 'desktop';
  		const cxHeader = isAppReady ? '' : '--splash';
  		const headerProps = { isAppReady, isTeam, inGame };

	    return (
	      <div className={`page --${cxDevice}`} id="MainPage">
	      	<Header
	      		className={cxHeader} 
	      		headerProps={headerProps} 
	      		page={page}/>
	        <Body className="app-body">
	        	{this.renderPages()}
	        </Body>
	        <ModalWarning />
	        <ModalSignOut />
	        <ModalEnterCode />
	        <ModalHowToPlay />
	        <Loading />
	      </div>
	    );
  	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainView));
