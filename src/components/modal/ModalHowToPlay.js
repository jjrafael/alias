import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Modal from './index';
import Button from '../common/Button';

//articles
import HowToPlay from '../articles/HowToPlay';

//actions
import { toggleHowToPlayModal } from '../../actions/app';

const mapStateToProps = state => {
  return {
    showModal: state.app.showModalHowToPlay,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleHowToPlayModal,
    },
    dispatch
  )
}

class ModalHowToPlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCount: 3,
      page: 1,
    }
  }

  closeModal() {
    this.props.toggleHowToPlayModal(false);
  }

  goToPage(page){
    const { pageCount } = this.state;
    const toPage = page > pageCount ? pageCount
      : ( page < 0 ? 1 : page )
    
    this.setState({ page: toPage });
  }

  renderHeader(){
    const { page } = this.state;
    let html = null;

    switch(page){
      case 1:
        html = 'Overview';
      break;
      case 2:
        html = HowToPlay.part1.header
      break;
      case 3:
        html = HowToPlay.part2.header
      break;
      default:
      break;
    }

    return html;
  }

  renderContent() {
    const { page } = this.state;
    let html = null;

    switch(page){
      case 1:
        html = this.renderOverview();
      break;
      case 2: 
        const Part1 = HowToPlay.part1.content;
        html = <Part1 />
      break;
      case 3: 
        const Part2 = HowToPlay.part2.content;
        html = <Part2 />
      break;
      default:
      break;
    }

    return html;
  }

  renderOverview() {
    return (
      <div className="article-overview">
        <ul>
          <li onClick={() => this.goToPage(2)}>How To Play</li>
          <li onClick={() => this.goToPage(4)}>Grid Anatomy</li>
          <li onClick={() => this.goToPage(5)}>Alias Rules</li>
          <li onClick={() => this.goToPage(6)}>Jinx</li>
          <li onClick={() => this.goToPage(7)}>How To Win</li>
        </ul>
      </div>
    )
  }

  render() {
    const { showModal } = this.props;
    const { page, pageCount } = this.state;
    const lastPage = pageCount;
    const cx = {
      back: `--plain ${page === 1 ? '--disabled' : ''}`,
      next: `--plain ${page === lastPage ? '--disabled' : ''}`,
    }
    
    if(showModal){
      return (
        <Modal
          className="--flipping --confirmation" 
          cxOverlay="howToModal" 
          size="xl"
          id="howToModal">
          <div className="modal__inner">
            <div className="modal__header">
              <i className="icon icon-menu"></i>
              {this.renderHeader()}
            </div>
            <div className="modal__body">
              {this.renderContent()}
            </div>
            <div className="modal__footer --three-buttons --divider">
              <Button text="Back" className={cx.back} onClick={() => this.goToPage(page - 1)}/>
              <Button text="Got it!" className="--plain" onClick={() => this.closeModal()}/>
              <Button text="Next" className={cx.next} onClick={() => this.goToPage(page + 1)}/>
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