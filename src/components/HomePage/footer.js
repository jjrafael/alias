import React from 'react';
import Footer from '../Footer';

class HomeFooter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			footOptions: {
				main: {
					text: 'Play',
					onClick: null,
				},
				left: {
					text: 'Settings',
					onClick: null,
				},
				right: {
					text: 'Decks',
					onClick: null,
				},
				copyright: false,
			},
		}
	}

  render() {
    const { footOptions } = this.state;
    return (
      <Footer options={footOptions}/>
    );
  }
}

export default HomeFooter;