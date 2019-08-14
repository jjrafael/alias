import React from 'react';

class HeaderCenter extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div className="header-center">
        <div className="header-logo">ALIAS</div>
        {children}
      </div>
    );
  }
}

export default HeaderCenter;