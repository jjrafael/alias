import React from 'react';

class HeaderCenter extends React.Component {
  render() {
    const { children, className } = this.props;
    const cx = className || '';
    return (
      <div className={`header-center ${cx}`}>
        <div className="header-logo">ALIAS</div>
        {children}
      </div>
    );
  }
}

export default HeaderCenter;