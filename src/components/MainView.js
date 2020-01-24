import React from 'react';
import { withRouter } from 'react-router-dom';
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
import ModalAboutDev from './modal/ModalAboutDev';

//pages
import SplashPage from './SplashPage';
import HomePage from './HomePage';

//actions
import { 
	setDeviceDetails, 
	readSession,  
	toggleWarningModal,
	toggleLoadingOverlay } from '../actions/session';

//misc
import { isMobile } from '../utils/session';
import { 
	bool,
	setLocalStorage, 
	getAllLocalStorage,
	clearLocalStorage,
	getResponse } from '../utils';
import { variables } from '../config';

const mapStateToProps = state => {return {
	sessionDetails: state.session.sessionDetails,
	readingSession: state.session.readingSession,
	loading: state.session.loading,
	hasModals: state.session.showModalSignout ||
		state.session.showModalEnterCode,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setDeviceDetails,
      toggleLoadingOverlay,
      toggleWarningModal,
      readSession,
    },
    dispatch
  )
}

class MainView extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			device: null,
			cachedSessionChecked: false,
			cachedUserChecked: false,
			cacheLoaded: false,
			verifyCacheDone: false,
			cachedIds: null,
			page: null,
		}
	}

	componentDidMount() {
		const navigator = window.navigator;
		const cachedIds = getAllLocalStorage();
		const device = {
			device: isMobile(navigator.userAgent) ? 'mobile' : 'desktop',
			platform: navigator.platform,
			browser: navigator.sessionCodeName,
		}
		this.props.setDeviceDetails(device);
		this.setState({ device, cachedIds: cachedIds });
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.sessionInitializing !== this.props.sessionInitializing){
			this.props.toggleLoadingOverlay(this.props.sessionInitializing, 'Initializing session');
		}

		if(prevProps.sessionDetails !== this.props.sessionDetails && !!this.props.sessionDetails){
			//save to local session details
			if(this.props.sessionDetails.id && this.props.sessionDetails.status === 'active'){
				setLocalStorage('alias_sessionId', this.props.sessionDetails.id);
			}
		}
	}

	setPage(user, sessionDetails, verifyCacheDone) {
		const isLogged = user && user.is_logged;
		const isSessionReady = (isLogged && bool(sessionDetails) && verifyCacheDone);
		let page = null;

		if(isSessionReady){
			page = 'home';
		}else{
			page = 'splash';
		}
		
		this.setState({ page });
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
			cachedSessionChecked: true,
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
					this.checkActiveSession();
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

	checkActiveSession() {
		//check if there's cached active session
		const { sessionId } = this.state.cachedIds;
		const doneStates = {
			cachedSessionChecked: true,
			cachedUserChecked: true,
			cacheLoaded: true,
			verifyCacheDone: true
		}

		if(sessionId){
			this.updateLoading('Initializing session...');
			this.props.readSession(sessionId).then((doc) => {
				//if exists and active
				const cond = {key: 'status', value: 'active'};
				const response = getResponse(doc, cond);

				if(response){
					this.setState({
						cachedSessionChecked: true, 
						cacheLoaded: true
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

	renderPages() {
		const { hasModals } = this.props;
		const { page } = this.state;
		const generalProps = { variables, hasModals };
		let html = null;
		const props = {
			general: generalProps,
			home: {...generalProps},
		}
		
		if(page === 'splash'){
			html = <SplashPage {...props.general} />
		}else if(page === 'home'){
			html = <HomePage {...props.home} /> 
		}else if(page === 'error'){
			html = <SplashPage {...props.general} />
		}else{
			html = <SplashPage {...props.general} />
		}

		return html;
	}

  	render() {
  		const { user, sessionDetails } = this.props;
  		const { verifyCacheDone, device, page } = this.state;
  		const isLogged = user && user.is_logged;
  		const isSessionReady = (isLogged && !!sessionDetails && verifyCacheDone);
  		const cxDevice = device ? device.device : 'desktop';
  		const cxHeader = isSessionReady ? '' : '--splash';
  		const headerProps = { isSessionReady };

	    return (
	      <div className={`page --${cxDevice}`} id="MainPage">
	      	<Header
	      		className={cxHeader} 
	      		headerProps={headerProps} 
	      		page={page}/>
	        <Body className="session-body">
	        	{this.renderPages()}
	        </Body>
	        <ModalWarning />
	        <ModalSignOut />
	        <ModalEnterCode />
	        <ModalHowToPlay />
	        <ModalAboutDev />
	        <Loading />
	      </div>
	    );
  	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainView));
