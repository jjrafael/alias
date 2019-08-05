import React from 'react';
import '../../styles/app.css';

//components
import Button from '../common/Button';

class HomePage extends React.Component {
	openApp = () => {
		console.log('jj homepage');
	}

	render() {
	    return (
	      <div className="page-wrapper splash-page">
	        <h1>HOME</h1>
	        <div className="center">
	        	<Button
	        		text="Click"
	        		className="btn btn-icon btn-l"
	        		onClick={this.openApp.bind(this)}
	        	/>
	        </div>
	      </div>
	    );
  	}
}

export default HomePage;
