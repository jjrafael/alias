import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux'

//actions
import { toggleLoadingOverlay } from '../../actions/session'

const mapStateToProps = (state) => {
    return {
        loading: state.session.loading
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
			dismissTimer: 3000,
			autoDismiss: false,
		}
	}

	componentDidMount() {
		this.setStateValues(this.props);
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.loading !== this.props.loading){
			if(this.state.autoDismiss && this.props.loading.show){
				this.autoDismiss();
			}
			if(!this.props.loading.show){
				this.dismiss();
			}
		}
	}

	dismiss() {
		if(this.props.loading.show){
			this.props.toggleLoadingOverlay(false, this.state.defautTitle);
		}
	}

	autoDismiss() {
		setTimeout(() => {
			this.dismiss();
		}, this.state.dismissTimer)
}

	setStateValues(props) {
		const { dismissTimer } = this.state;
		const state = {
			...this.state,
			autoDismiss: props.autoDismiss || false,
			dismissTimer: props.autoDismiss ? (props.dismissTimer || dismissTimer) : dismissTimer,
		}

		this.setState(state);
	}

	render() {
		const { className, loading } = this.props;
		const active = loading.show ? 'active' : '';

	    return (
	      <div className={`loading-overlay ${className || ''} ${active}`}>
	        <h2>
	        	{loading.title || this.state.defautTitle}
	        </h2>
	      </div>
	    );
  	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading);