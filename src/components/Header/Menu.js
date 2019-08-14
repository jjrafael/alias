import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//actions
import { 
	toggleSignOutModal, 
	toggleResetGameModal,
	toggleResetTeamModal,
	toggleRestartGameModal
} from '../../actions/app';

//misc
import defaultMenu from '../../config/menu';

const mapStateToProps = state => {return {}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      	toggleSignOutModal, 
		toggleResetGameModal,
		toggleResetTeamModal,
		toggleRestartGameModal
    },
    dispatch
  )
}

class Menu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menu: defaultMenu,
		}
	}

	componentDidMount(){
		if(this.props.menu){
			this.setState({ menu: this.props.menu });
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
			default:
			break;
		}
		console.log('jj click menu: ', data.id);
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
	      <div className="menu__wrapper">
	        <ul className="menu">
	        	{this.renderMenuItems()}
	        </ul>
	      </div>
	    );
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);