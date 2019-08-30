import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Components
import Footer from '../Footer';

// actions

const mapStateToProps = state => {return {}}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
		{
		  
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
					onClick: () => {},
				},
				right: {
					text: 'History',
					onClick: () => {},
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
		const text = alias ? alias.alias : (
			<div className="loading-dots">
				<i>.</i>
				<i>.</i>
				<i>.</i>
			</div>
		);
		const footOptions = {
			...this.state.footOptions,
			main: {
				...this.state.footOptions.main,
				text
			}
		}
		console.log('jj alias: ', alias, text, footOptions);
		this.setState({ footOptions });
	}

  render() {
    const { footOptions } = this.state;
    return (
      <Footer options={footOptions}/>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);