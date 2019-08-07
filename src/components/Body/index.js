import React from 'react';

class Header extends React.Component {
  render() {
    const {children} = this.props;
    return (
      <div className="default">
        {children}
      </div>
    );
  }
}

export default Header;
