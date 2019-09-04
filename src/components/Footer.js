import React from 'react';

class Footer extends React.Component {
  render() {
    const { className, copyright, options } = this.props;
    const { main, left, right } = options;
    const cx = {
      left: `footer__options--left ${left ? left.cx : ''}`,
      main: `footer__options--main ${main ? main.cx : ''}`,
      right: `footer__options--right ${right ? right.cx : ''}`
    }

    return (
      <footer className={`app-footer ${className || ''}`}>
        <div className={`footer__options ${main ? '--have-main' : ''}`}>
          { left &&
            <div className={cx.left} onClick={() => left.onClick()}>{left.text}</div>
          }
          { main &&
            <div className={cx.main} onClick={() => main.onClick()}>{main.text}</div>
          }
          { right &&
            <div className={cx.right} onClick={() => right.onClick()}>{right.text}</div>
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