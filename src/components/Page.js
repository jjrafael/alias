import React from 'react';
import Header from './Header';

class Page extends React.Component {
  render() {
    return (
      <div className="page" id="MainPage">
        <Header className="app-header" />
      </div>
    );
  }
}

export default Page;
