import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//actions
import { 
	toggleSignOutModal, 
	toggleResetGameModal,
	toggleResetTeamModal,
	toggleRestartGameModal,
	toggleEnterCodeModal
} from '../../actions/app';

//misc
import menu from '../../config/menu';

const mapStateToProps = state => {return {

}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      	toggleSignOutModal, 
		toggleResetGameModal,
		toggleResetTeamModal,
		toggleRestartGameModal,
		toggleEnterCodeModal
    },
    dispatch
  )
}

class Menu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menu: menu.about,
		}
	}

	componentDidMount(){
		let menuData = menu.about;
		const pathname = window.location.pathname;

		if(this.props.menu){
			menuData = this.props.menu;
		}else{
			if(pathname === '/build-team'){
				menuData =  menu.buildTeamMenu;
			}else if(pathname === '/grid'){
				menuData =  menu.inGridMenu;
			}else if(pathname === '/leader'){
				menuData =  menu.asTeamLeaderMenu;
			}else{
				menuData = this.props.isAppReady ? menu.homeMenu : menu.splashMenu;
			}
		}

		this.setState({ menu: menuData });
	}

	componentDidUpdate(prevProps) {
		if(prevProps.isAppReady !== this.props.isAppReady){
			this.setState({ menu: this.props.isAppReady ? menu.homeMenu : menu.splashMenu });
		}
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
			default:
			break;
		}
	}

	renderMenuItems() {
		const { menu } = this.state;
		let html = [];

		menu.forEach((d, i) => {
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
	      <div className="menu__wrapper clearfix">
	        <ul className="menu">
	        	{this.renderMenuItems()}
	        </ul>
	      </div>
	    );
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);