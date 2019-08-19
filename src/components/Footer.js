import React from 'react';

class Footer extends React.Component {
  render() {
    const { className, copyright, options } = this.props;
    const { main, left, right } = options;

    return (
      <footer className={`app-footer ${className || ''}`}>
        <div className={`footer__options ${main ? '--have-main' : ''}`}>
          { left &&
            <div className="footer__options--left" onClick={() => left.onClick()}>{left.text}</div>
          }
          { main &&
            <div className="footer__options--main" onClick={() => main.onClick()}>{main.text}</div>
          }
          { right &&
            <div className="footer__options--right" onClick={() => right.onClick()}>{right.text}</div>
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