import React from 'react';

class Footer extends React.Component {
  render() {
    const { className, copyright, options } = this.props;

    return (
      <footer className={`app-footer ${className || ''}`}>
        <div className={`footer__options ${options.main ? '--have-main' : ''}`}>
          { options.left &&
            <div className="footer__options--left">{options.left.text}</div>
          }
          { options.main &&
            <div className="footer__options--main">{options.main.text}</div>
          }
          { options.right &&
            <div className="footer__options--right">{options.right.text}</div>
          }
        </div>
        { copyright &&
          <div className="footer__copyright"></div>
        }
      </footer>
    );
  }
}

export default Footer;