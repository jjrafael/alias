import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Card from './common/Card';
import CardsCol from './common/CardsCol';

//actions
import { initializeApp, addUser } from '../actions/app';

//misc
import { getNow, setLocalStorage } from '../utils';

const mapStateToProps = state => {
	return {
		deviceDetails: state.app.deviceDetails,
		user: state.app.user,
		settings: state.app.settings,
		appDetails: state.app.appDetails,
		loadingOverlay: state.app.loadingOverlay,
	}
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      initializeApp,
      addUser
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

	componentDidUpdate(prevProps){
		if(prevProps.user !== this.props.user && !!this.props.user){
			if(this.props.user.id && !this.props.user.isCache){
				this.initApp(this.props.user);
				setLocalStorage('alias_userId', this.props.user.id);
				setLocalStorage('alias_user', JSON.stringify(this.props.user));
			}
		}
	}

	initApp(user) {
		const { settings } = this.props;
		const now = getNow();
		const data = {
			created_by: user.id,
			created_time: now,
			grid_user_key: user.id,
			name: user.name,
			status: 'active',
			team1_user_key: null,
			team2_user_key: null,
			timer: settings.timer,
			total_connected_users: 1,
			total_games: 0,
			total_teams: 2,
		}
		this.props.initializeApp(data);
	}

	initUser = () => {
		const { deviceDetails, user } = this.props;
		const now = getNow();
		const data = {
			name: 'tester5a',
			email: 'tester5a@mail.co',
			platform: deviceDetails.platform,
			is_logged: user ? user.is_logged : true,
			device: deviceDetails.device,
			browser: deviceDetails.browser,
			status: 'active,',
			type: user ? user.type : 'player',
			role: 'grid',
			created_time: now,
			last_logged_time: now,
		}
		this.props.addUser(data);
	}

	render() {
		const { loadingOverlay, deviceDetails } = this.props;
		const isMobile = deviceDetails.device === 'mobile';

	    return (
	      <div className="page-wrapper splash-page">
	      	<div className="splash-tilt">
	      		<CardsCol count={20} animDelay={'0.5s'} className={`${!isMobile ? '--roulette' : ''}`}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20} animDelay={'3s'} className={`${!isMobile ? '--roulette' : ''}`}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20} animDelay={'1s'} className={`flippy ${!isMobile ? '--roulette' : ''}`}>
	      			<Card size="medium" flipBack type="splash-cards" className="--pointer">
	      				<div className="card-inner">
	      					<h3>Add Cards</h3>
	      				</div>
	      			</Card>
	      		</CardsCol>
	      		<CardsCol count={20} animDelay={'0.5s'} className={`flippy ${!isMobile ? '--roulette' : ''}`}>
	      			<Card size="medium" flipBack type="splash-cards" className="--pointer">
	      				<div className="card-inner">
	      					<h3>As Team Leader</h3>
	      				</div>
	      			</Card>
	      		</CardsCol>
	      		<CardsCol count={20} animDelay={'2s'} className={`flippy ${!isMobile ? '--roulette' : ''}`}>
	      			<Card size="medium" flipBack type="splash-cards" className="--pointer">
	      				<div className="card-inner" onClick={this.initUser}>
	      					<h3>Start Game</h3>
	      				</div>
	      			</Card>
	      		</CardsCol>
	      		<CardsCol count={20} animDelay={'2.5s'} className={`${!isMobile ? '--roulette' : ''}`}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20} animDelay={'3s'} className={`${!isMobile ? '--roulette' : ''}`}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20} animDelay={'1s'} className={`${!isMobile ? '--roulette' : ''}`}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      		<CardsCol count={20} animDelay={'4s'} className={`${!isMobile ? '--roulette' : ''}`}>
	      			<Card size="medium" flipBack type="splash-cards"/>
	      		</CardsCol>
	      	</div>
	      	<div className={`splash-logo-wrapper ${loadingOverlay ? 'trans-hide' : ''}`}>
	      		<div className="logo-typography">
	      			<span>A</span>
	      			<span>L</span>
	      			<span>I</span>
	      			<span>A</span>
	      			<span>S</span>
	      		</div>
	      	</div>
	      </div>
	    );
  	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SplashPage));
