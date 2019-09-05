import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Components
import Footer from '../Footer';

// actions
import { toggleReportAliasModal, toggleAliasHistoryModal } from '../../actions/app';

const mapStateToProps = state => {return {}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
		  toggleReportAliasModal,
		  toggleAliasHistoryModal
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
					text: 'Alias',
					onClick: () => {},
				},
				left: {
					text: 'Report',
					onClick: this.reportAlias,
				},
				right: {
					text: 'History',
					onClick: this.openHistory,
				},
				copyright: false,
			},
		}
	}

	componentDidMount(){
		const { newAlias } = this.props;
		this.updateAlias(newAlias);
	}

	componentDidUpdate(prevProps){
		if(prevProps.newAlias !== this.props.newAlias){
			this.updateAlias(this.props.newAlias);
		}
	}

	updateAlias(alias) {
		let html = null;

		if(alias){
			html = <div className="new-alias">
				{alias.alias}
				{alias.count && Number(alias.left) > 1 ?
					<div className="count-tip">
						{alias.left}
					</div> : ''
				}
			</div>
		}else{
			html = <div className="loading-dots">
				<div>.</div>
				<div>.</div>
				<div>.</div>
				<div>.</div>
			</div>
		}
		const footOptions = {
			...this.state.footOptions,
			main: {
				...this.state.footOptions.main,
				cx: alias ? '--new' : '',
				text: html
			}
		}
		
		this.setState({ footOptions });
	}

	openHistory = () => {
		this.props.toggleAliasHistoryModal(true);
	}

	reportAlias = () => {
		const { newAlias } = this.props;

		if(newAlias){
			this.props.toggleReportAliasModal(true);
		}
	}

  render() {
    const { footOptions } = this.state;
    return (
      <Footer options={footOptions}/>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);