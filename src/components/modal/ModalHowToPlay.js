import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//components
import Modal from './index';
import Button from '../common/Button';

//articles
import HowToPlay from '../articles/HowToPlay';
import GridAnatomy from '../articles/GridAnatomy';
import AliasRules from '../articles/AliasRules';
import MakingDeck from '../articles/MakingDeck';
import HowToWin from '../articles/HowToWin';

//actions
import { toggleHowToPlayModal } from '../../actions/session';

const mapStateToProps = state => {
  return {
    showModal: state.session.showModalHowToPlay,
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
      pageCount: 9,
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
      case 4:
        html = GridAnatomy.part1.header
      break;
      case 5:
        html = GridAnatomy.part2.header
      break;
      case 6:
        html = AliasRules.part1.header
      break;
      case 7:
        html = AliasRules.part2.header
      break;
      case 8:
        html = MakingDeck.header
      break;
      case 9:
        html = HowToWin.header
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
        const HowToPlayPart1 = HowToPlay.part1.content;
        html = <HowToPlayPart1 />
      break;
      case 3: 
        const HowToPlayPart2 = HowToPlay.part2.content;
        html = <HowToPlayPart2 />
      break;
      case 4: 
        const GridAnatomyPart1 = GridAnatomy.part1.content;
        html = <GridAnatomyPart1 />
      break;
      case 5: 
        const GridAnatomyPart2 = GridAnatomy.part2.content;
        html = <GridAnatomyPart2 />
      break;
      case 6: 
        const AliasRulesPart1 = AliasRules.part1.content;
        html = <AliasRulesPart1 />
      break;
      case 7: 
        const AliasRulesPart2 = AliasRules.part2.content;
        html = <AliasRulesPart2 />
      break;
      case 8: 
        const MakingDeckArticle = MakingDeck.content;
        html = <MakingDeckArticle />
      break;
      case 9: 
        const HowToWinArticle = HowToWin.content;
        html = <HowToWinArticle />
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
          <li onClick={() => this.goToPage(6)}>Alias Rules</li>
          <li onClick={() => this.goToPage(8)}>Making A Deck</li>
          <li onClick={() => this.goToPage(9)}>How To Win</li>
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
              { page !== 1 ?
                <i className="icon icon-list_alt icon--left"
                onClick={() => this.goToPage(1)}></i> : ''
              }
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