import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

//components
import Header from './Header';
import Body from './Body';
import SplashPage from './SplashPage';
import HomePage from './HomePage';
import BuildTeamPage from './BuildTeamPage';

class Page extends React.Component {
  render() {
    return (
      <div className="page" id="MainPage">
        <Header className="app-header" />
        <Body className="app-body">
        	<Switch>
        		<Route exact path="/" component={SplashPage}/>
        		<Route exact path="/home" component={HomePage}/>
        		<Route exact path="/build-team" component={BuildTeamPage}/>
        		<Route component={SplashPage}/>
        	</Switch>
        </Body>
      </div>
    );
  }
}

export default withRouter(Page);
