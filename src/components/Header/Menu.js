import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//actions
import { 
	toggleSignOutModal, 
	toggleResetGameModal,
	toggleResetTeamModal,
	toggleRestartGameModal,
	toggleEnterCodeModal,
	toggleQuitGameModal
} from '../../actions/app';

//misc
import menu from '../../config/menu';

const mapStateToProps = state => {return {
	user: state.app.user,
	gameDetails: state.game.gameDetails,
}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
    	toggleSignOutModal, 
			toggleResetGameModal,
			toggleResetTeamModal,
			toggleRestartGameModal,
			toggleEnterCodeModal,
			toggleQuitGameModal
    },
    dispatch
  )
}

class Menu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menuData: menu.splashMenu || [],
		}
	}

	componentDidUpdate(prevProps) {
		if((prevProps.isAppReady !== this.props.isAppReady) ||
			(prevProps.inGame !== this.props.inGame) ||
			(prevProps.isTeam !== this.props.isTeam)){
			this.updateMenu();
		}
	}

	updateMenu(){
		const { isAppReady, isTeam, inGame } = this.props;
		let menuData = menu.aboutMenu;
		
		if(isAppReady){
			//user already logged, app is initialized
			if(isTeam && inGame){
				//team leader and already in play: LeaderPage
				menuData = menu.teamLeaderMenu
			}else if(isTeam && !inGame){
				//team leader and adding members: buildTeamPage
				menuData = menu.buildTeamMenu
			}else if(!isTeam && inGame){
				//grid and already in play: GridPage
				menuData = menu.inGridMenu
			}else if(!isTeam && !inGame){
				//grid and building team
				menuData = menu.homeMenu
			}else{
				//something went wrong
				menuData = menu.aboutMenu
			}
		}else{
			//no user logged and/or app wasn't initialized yet
			menuData = menu.splashMenu
		}
		
		this.setState({menuData});
}

	clickMenu(data) {
		switch(data.id) {
			case 'sign_out':
				this.props.toggleSignOutModal(true);
			break;
			case 'reset_game':
				this.props.toggleResetGameModal(true);
			break;
			case 'restart_game':
				this.props.toggleRestartGameModal(true);
			break;
			case 'reset_team':
				this.props.toggleResetTeamModal(true);
			break;
			case 'enter_code':
				this.props.toggleEnterCodeModal(true);
			break;
			case 'quit_game':
				this.props.toggleQuitGameModal(true);
			break;
			default:
			break;
		}
	}

	renderMenuItems() {
		const { menuData } = this.state;
		let html = [];
		
		menuData.forEach((d, i) => {
			html.push(
				<li key={i} className={`menu__item ${d.className}`}
					onClick={() => this.clickMenu(d)}>
					{d.label}
				</li>
			)
		})
		
		return html;
	}


 	render() {
    return (
      <div className="menu__wrapper group">
        <ul className="menu">
        	{this.renderMenuItems()}
        </ul>
      </div>
    );
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);