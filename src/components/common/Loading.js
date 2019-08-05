import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux'
import '../../styles/main.css';

//actions
import { toggleLoadingOverlay } from '../../actions/app'

const mapStateToProps = (state) => {
    return {
        loadingOverlay: state.app.loadingOverlay
    }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleLoadingOverlay
    },
    dispatch
  )
}


class Loading extends React.Component {
	constructor(props) {
		super();
		this.state = {
			defautTitle: 'Loading...',
			title: 'Loading...',
			dismissTimer: 3000,
			autoDismiss: false,
		}
	}

	componentDidMount() {
		this.setStateValues(this.props);
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.loadingOverlay !== this.props.loadingOverlay
			&& this.state.autoDismiss && this.props.loadingOverlay){
			setTimeout(() => {
				this.props.toggleLoadingOverlay();
			}, this.state.dismissTimer)
		}
	}

	setStateValues(props) {
		const {title, defautTitle, dismissTimer} = this.state;
		const state = {
			...this.state,
			title: props.title || title || defautTitle,
			autoDismiss: props.autoDismiss || false,
			dismissTimer: props.autoDismiss ? (props.dismissTimer || dismissTimer) : dismissTimer,
		}

		this.setState(state);
	}

	render() {
		const { className, loadingOverlay } = this.props;
		const { title } = this.state;
		const active = loadingOverlay ? 'active' : '';

	    return (
	      <div className={`loading-overlay ${className || ''} ${active}`}>
	        <h1>
	        	{title}
	        </h1>
	      </div>
	    );
  	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading);