import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Modal from './index';
import Button from '../common/Button';

//actions
import { toggleAboutDevModal } from '../../actions/app';

const mapStateToProps = state => {
  return {
    showModal: state.app.showModalAboutDev,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleAboutDevModal,
    },
    dispatch
  )
}

class ModalHowToPlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socials: [
        {
          icon: 'jjr',
          label: 'Portfolio',
          link: 'https://jjrafael.github.io'
        },
        {
          icon: 'github',
          label: 'Github',
          link: 'https://github.com/jjrafael'
        },
        {
          icon: 'instagram',
          label: 'Instagram',
          link: 'https://instagram.com/jessiejrafael'
        },
        {
          icon: 'facebook',
          label: 'Facebook',
          link: 'https://facebook.com/jessiejamesrafael'
        },
        {
          icon: 'document',
          label: 'Download Resume',
          link: ''
        },
      ]
    }
  }

  closeModal() {
    this.props.toggleAboutDevModal(false);
  }

  renderIcons() {
    const { socials } = this.state;
    let html = [];

    socials.forEach((d, i) => {
      html.push(
        <a key={i} href={d.link || '/'} target="_blank" rel="noopener noreferrer">
          <div className={`social-item icon icon-${d.icon}`} title={d.label}></div>
        </a>
      )
    })

    return html;
  }

  render() {
    const { showModal } = this.props;
    
    if(showModal){
      return (
        <Modal
          className="--flipping --confirmation" 
          cxOverlay="aboutDevModal" 
          size="xl"
          id="aboutDevModal">
          <div className="modal__inner">
            <div className="modal__header hide"></div>
            <div className="modal__body --no-header">
              <div className="jjr-photo">
                <div className="jjr-emblem icon icon-jjr_outline"></div>
              </div>
              <div className="jjr-content">
                <h5>Hello, Im the developer of this app!</h5>
                <h3>JJ Rafael</h3>
                <p>
                  I'm a fulltime front-end enthusiast and part-time illustrator. 
                  I loved playing tabletop games with my friends and coincidentally 
                  had enought time to explore with my current development stack.
                  Ended up writing this game for everyone!
                </p>
                <p>
                  Interested on working with me?<br></br>
                  Shoot a message, I'd love to collaborate with you!
                </p>
                 <p className="--center">
                  <i>jessiejamesrafael@gmail.com</i>
                </p>
                <div className="jjr-socials">
                  {this.renderIcons()}
                </div>
              </div>
            </div>
            <div className="modal__footer --single-button">
              <Button text="Got it!" className="--plain" onClick={() => this.closeModal()}/>
            </div>
          </div>
        </Modal>
      );
    }else{
      return <div className="modal--blank"></div>;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalHowToPlay);