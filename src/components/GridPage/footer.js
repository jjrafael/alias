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

	componentDidUpdate(prevProps){
			if(prevProps.alias !== this.props.alias){
					this.setState({
						footOptions: {
							...this.state.footOptions,
							main: {
								...this.state.footOptions.main,
								text: this.props.alias.text || '...'
							}
						}
					})
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