import React from 'react';

class Header extends React.Component {
  render() {
    const {children} = this.props;
    return (
      <div className="page-body default">
        {children}
      </div>
    );
  }
}

export default Header;
