/* eslint-disable eqeqeq */
import React from 'react';
import { connect } from 'react-redux';

import Term from '../../containers/term';
import Courses from '../../containers/courses';
import SearchPane from '../../containers/sidebar/searchPane';
import RequirementsPane from '../../containers/sidebar/requirementsPane';

import {
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor,
} from '../../actions';

import './tutorial.scss';
import feature1 from '../../style/dplanner-19.png';

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
    title: 'Course Items.',
    isInteractable: true,
    graphic: 'course',
    text: '2',
  },
  {
    title: 'Course Items.',
    isInteractable: true,
    graphic: 'course',
    text: '3',
  },
  {
    title: 'Term Modules.',
    isInteractable: true,
    graphic: 'term',
    text: '4',
  },
  {
    title: 'Finding Classes.',
    isInteractable: true,
    graphic: 'search',
    text: '5',
  },
  {
    title: 'Your Degree.',
    isInteractable: true,
    graphic: 'degree',
    text: '6',
  },
];

const endTutorialText = 'Continue';

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

  // Add check for loading directly into final page
  componentDidMount() {
    this.setState({
      tutorialPage: this.props.match.params.page,
    }, () => {
      if (this.state.tutorialPage == tutorialData.length - 1) {
        this.setState({ nextButtonLabel: endTutorialText });
      }
    });
  }

  prev = () => {
    if (this.state.tutorialPage - 1 >= 0) {
      this.setState((prevState) => {
        return ({
          tutorialPage: parseInt(prevState.tutorialPage, 10) - 1,
          nextButtonLabel: 'Next',
        });
      }, () => { this.props.history.push(`/tutorial/${this.state.tutorialPage}`); });
    }
  }

  next = () => {
    if (this.state.tutorialPage < tutorialData.length - 1) { // Within data range
      if (this.state.tutorialPage + 1 == tutorialData.length - 1) { // Final page
        this.setState({ nextButtonLabel: endTutorialText });
      }
      this.setState((prevState) => { return ({ tutorialPage: parseInt(prevState.tutorialPage, 10) + 1 }); },
        () => { this.props.history.push(`/tutorial/${this.state.tutorialPage}`); });
    } else if (this.state.tutorialPage >= tutorialData.length - 1) {
      this.endTutorial();
    }
  }

  endTutorial = () => {
    this.props.history.push('/');
  }

  renderComponent = (component) => {
    if (component != null) {
      if (component.isInteractable) {
        switch (component.graphic) {
          case 'term':
            return (<div className="graphic">Term graphic</div>);
            // return (<Term className="graphic" />);

          case 'course':
            // TODO: Add props
            return (<div className="graphic">Course graphic</div>);
            // return (<Courses className="graphic" />);

          case 'search':
            return (<div className="graphic">Search graphic</div>);
            // return (
            //   <SearchPane className="graphic"
            //     active
            //     activate={() => {}}
            //     setSearchQuery={quiery => this.setState({ searchQuery: quiery })}
            //     searchQuery={this.state.searchQuery}
            //     search={this.props.courseSearch}
            //     results={this.props.searchResults}
            //     resultStamp={this.props.resultStamp}
            //     stampIncrement={this.props.stampIncrement}
            //     setDraggingFulfilledStatus={this.props.setDraggingFulfilledStatus}
            //     currTerm={this.props.currTerm}
            //     showDialog={this.props.showDialog}
            //   />
            // );

          case 'degree':
            // TODO: Add props
            return (<div className="graphic">Degree graphic</div>);
            // return (<RequirementsPane className="graphic" />);

          default:
            return <div className="graphic">You should never see this!</div>;
        }
      } else {
        return (<img className="graphic" src={component.graphic} alt="tutorial-graphic" />);
      }
    } else {
      return <div className="graphic">You should never see this!</div>;
    }
  }

  render() {
    return (
      <div className="colContainer">
        <button type="button" className="skip-tutorial" onClick={this.endTutorial}>Skip Tutorial</button>
        <div className="title">{tutorialData[this.state.tutorialPage].title}</div>
        <div className="rowContainer">
          <div className="graphic">{this.renderComponent(tutorialData[this.state.tutorialPage])}</div>
          <div className="paragraph">{tutorialData[this.state.tutorialPage].text}</div>
        </div>
        <div className="button-container">
          <button type="button" className="next" onClick={this.next}>{this.state.nextButtonLabel}</button>
          <button type="button" className="previous" onClick={this.prev}>{this.state.prevButtonLabel}</button>
        </div>
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
