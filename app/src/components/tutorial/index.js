import React from 'react';
import { connect } from 'react-redux';

import Courses from '../../containers/courses';
import SearchPane from '../../containers/sidebar/searchPane';

import {
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor,
} from '../../actions';

import './tutorial.scss';

// Testing
import feature1 from '../../style/feature1.svg';

// Need to check authentication before allowing entry
// Allow for different components to be inserted into the tutorial

const tutorialData = [
  {
    title: 'Welcome to D-Planner!',
    isInteractable: false,
    graphic: feature1,
    text: '0',
  },
  {
    title: 'The  Basics.',
    isInteractable: false,
    graphic: feature1,
    text: '1',
  },
  {
    title: 'The  Basics.',
    isInteractable: true,
    graphic: 'term',
    text: '2',
  },
  {
    title: 'Advanced Topics.',
    isInteractable: true,
    graphic: 'search',
    text: '3',
  },
];

class Tutorial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tutorialPage: 0,
      prevButtonLabel: 'Previous',
      nextButtonLabel: 'Next',
      searchQuery: 'COSC 98',
    };
  }

  prev = () => {
    if (this.state.tutorialPage - 1 >= 0) {
      this.setState(prevState => ({
        tutorialPage: prevState.tutorialPage - 1,
        nextButtonLabel: 'Next',
      }));
    }
  }

  next = () => {
    if ((this.state.tutorialPage + 1) <= tutorialData.length - 1) {
      if (this.state.tutorialPage + 1 === tutorialData.length - 1) {
        this.setState({ nextButtonLabel: 'Continue' });
      }
      this.setState(prevState => ({ tutorialPage: prevState.tutorialPage + 1 }));
    } else if (this.state.tutorialPage + 1 === tutorialData.length) {
      this.endTutorial();
    }
  }

  renderComponent = (component) => {
    switch (component) {
      case 'term':
        return null;
        // return (<Term />);

      case 'course':
        return (<Courses />);

      case 'search':
        return (
          <SearchPane
            active
            activate={() => {}}
            setSearchQuery={quiery => this.setState({ searchQuery: quiery })}
            searchQuery={this.state.searchQuery}
            search={this.props.courseSearch}
            results={this.props.searchResults}
            resultStamp={this.props.resultStamp}
            stampIncrement={this.props.stampIncrement}
            setDraggingFulfilledStatus={this.props.setDraggingFulfilledStatus}
            currTerm={this.props.currTerm}
            showDialog={this.props.showDialog}
          />
        );

      default:
        break;
    }
    return <div>You should never see this!</div>;
  }

  // This is a very large security workaround, need to incorporate authentication
  endTutorial = () => {
    this.props.history.push('/');
  }

  render() {
    return (
      <div className="colContainer">
        <button type="button" className="skip" onClick={this.endTutorial}>Skip Tutorial</button>
        {/* <div>This is the tutorial! On page: {this.state.tutorialPage}</div> */}
        <div className="title">{tutorialData[this.state.tutorialPage].title}</div>
        <div className="rowContainer">
          <div>{this.renderComponent(tutorialData[this.state.tutorialPage].graphic)}</div>
          {/* <img src={tutorialData[this.state.tutorialPage].image} alt="feature-icon" /> */}
          <div className="paragraph">{tutorialData[this.state.tutorialPage].text}</div>
        </div>
        <button type="button" className="previous" onClick={this.prev}>{this.state.prevButtonLabel}</button>
        <button type="button" className="next" onClick={this.next}>{this.state.nextButtonLabel}</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  searchResults: state.courses.results,
  resultStamp: state.courses.resultStamp,
  currTerm: state.time.currTerm,
});

export default connect(mapStateToProps, {
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor,
})(Tutorial);
