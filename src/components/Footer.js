import React from 'react';

class Footer extends React.Component {
  render() {
    const { className, copyright, options } = this.props;
    const haveMainOption = options && options.main;

    return (
      <footer className={`app-footer ${className || ''}`}>
        <div className={`footer__options ${haveMainOption ? '--have-main' : ''}`}>
          <div className="footer__options--left">{options.left.text}</div>
          { haveMainOption &&
            <div className="footer__options--main">{options.main.text}</div>
          }
          <div className="footer__options--right">{options.right.text}</div>
        </div>
        { copyright &&
          <div className="footer__copyright"></div>
        }
      </footer>
    );
  }
}

export default Footer;
