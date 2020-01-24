import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

//Components
import Footer from '../Footer';

// actions
import { editSession, toggleSettingsModal } from '../../actions/session';

//misc
import { bool } from '../../utils';

const mapStateToProps = state => {
	return {
		sessionDetails: state.session.sessionDetails,
		settings: state.session.settings,
	}
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
			toggleSettingsModal,
		  editSession,
		},
		dispatch
	 )
}

class HomeFooter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			footOptions: {
				main: {
					text: 'Settings',
					onClick: this.openSettings,
				},
				copyright: false,
			},
		}
	}

	openSettings = () => {
		this.props.toggleSettingsModal(true);
	}

	getUserKey(members) {
			return bool(members) ? members[0].created_by : '';
	}

  render() {
    const { footOptions } = this.state;
    return (
      <Footer options={footOptions}/>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeFooter));