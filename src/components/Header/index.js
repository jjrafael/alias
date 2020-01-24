import React from 'react';
import { connect } from 'react-redux';

//components
import HeaderCenter from './HeaderCenter';
import Menu from './Menu';

//misc
import { minToMsec } from '../../utils';

const mapStateToProps = state => {
  return {
    settings: state.session.settings,
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: minToMsec(this.props.settings.timer),
      activeRound: null,
      newAlias: null,
      isMenu: false,
    }
    this.timeFunc = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.settings.timer !== this.props.settings.timer){
      this.setState({ timer: minToMsec(this.props.settings.timer) });
    }
  }

  toggleMenu(value) {
    this.setState({ isMenu: value });
  }

  render() {
    const { 
      className,
      headerProps,
    } = this.props;
    const { timer, isMenu } = this.state;
    
    return (
      <header className={`app-header ${className || ''}`}>
        <HeaderCenter
          timer={timer} 
          className={isMenu ? '--open' : '--close'}>
          <Menu {...headerProps}/>
          <div className="menu__toggle">
            { !isMenu ?
              <i className="icon icon-menu"
                onClick={() => this.toggleMenu(true)}></i>
              : <i className="icon icon-clearclose"
                onClick={() => this.toggleMenu(false)}></i>
            }
          </div>
        </HeaderCenter>
      </header>
    );
  }
}

export default connect(mapStateToProps)(Header);
