import React from 'react';
import '../../styles/app.css';

//components
import Button from '../common/Button';

class BuildTeamPage extends React.Component {
	openApp = () => {
		console.log('jj build team2');
	}

	render() {
	    return (
	      <div className="page-wrapper splash-page">
	        <h1>TEAM</h1>
	        <div className="center">
	        	<Button
	        		text="Click"
	        		type="link"
	        		link="/"
	        		className="btn btn-icon btn-l"
	        		onClick={this.openApp}
	        	/>
	        </div>
	      </div>
	    );
  	}
}

export default BuildTeamPage;
