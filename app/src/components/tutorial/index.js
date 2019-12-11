/* eslint-disable eqeqeq */
import React from 'react';
import { connect } from 'react-redux';

import HeaderMenu from '../headerMenu';

import Term from '../../containers/term';
import Courses from '../../containers/courses';
import SearchPane from '../../containers/sidebar/searchPane';
import RequirementsPane from '../../containers/sidebar/requirementsPane';
import DraggableCourse from '../draggableCourse';

import {
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor, getRandomCourse, fetchPlan,
} from '../../actions';

import './tutorial.scss';

import feature1 from '../../style/dplanner-19.png';
import requirementBubbles from '../../style/requirement_bubbles.png';
import emptyTerm from '../../style/empty_term.png';
import filledTerm from '../../style/filled_term.png';

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
    graphic: requirementBubbles,
    text: '1',
  },
  {
    title: 'Course Items.',
    isInteractable: false,
    graphic: emptyTerm,
    text: '2',
  },
  {
    title: 'Course Items.',
    isInteractable: false,
    graphic: filledTerm,
    text: '3',
  },
  {
    title: 'Term Modules.',
    isInteractable: false,
    graphic: feature1,
    text: '4',
  },
  {
    title: 'Finding Classes.',
    isInteractable: false,
    graphic: feature1,
    text: '5',
  },
  {
    title: 'Your Degree.',
    isInteractable: false,
    graphic: feature1,
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
      courseLocation: {
        termOne: {},
        termTwo: {},
      },
    };

    this.test = this.test.bind(this);
  }

  componentWillMount() {
    this.props.getRandomCourse();
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

  test = (action) => {
    if (action === 'to19F') {
      console.log('moving course to 19F');
      this.setState({
        courseLocation: {
          '19F': [this.props.randomCourse],
          '20W': [],
        },
      });
    } else {
      console.log('moving course to 20W');
      this.setState({
        courseLocation: {
          '19F': [],
          '20W': [this.props.randomCourse],
        },
      });
    }
    return new Promise((resolve, reject) => {
      console.log('test function');
    });
  }

  renderComponent = (component) => {
    if (component != null && this.props.randomCourse !== undefined) {
      if (component.isInteractable) {
        console.log(component.graphic);
        switch (component.graphic) {
          case 'term':
            return (
              <>
                <Term
                  plan={{}}
                  time={{ currTerm: '19F' }}
                  term={{ name: '19F', courses: [{ course: this.state.courseLocation.termOne }] }}
                  key="19F"
                  addCourseToTerm={() => this.test('to19F')}
                  removeCourseFromTerm={() => this.test('to20W')}
                  setDraggingFulfilledStatus={() => console.log('setting dragging fulfilled status placeholder')}
                />
                <Term
                  plan={{}}
                  time={{ currTerm: '20W' }}
                  term={{ name: '20W', courses: [{ course: this.state.courseLocation.termTwo }] }}
                  key="20W"
                  addCourseToTerm={() => this.test('to20W')}
                  removeCourseFromTerm={() => this.test('to19F')}
                  setDraggingFulfilledStatus={() => console.log('setting dragging fulfilled status placeholder')}
                />
              </>
            );

          case 'course':
            return (
              <DraggableCourse
                size="lg"
                key={this.props.randomCourse.id}
                catalogCourse={this.props.randomCourse}
                course={this.props.randomCourse}
                currTerm={{ year: 2019 }}
                removeCourseFromTerm={() => console.log('remove course from term placeholder')}
                setDraggingFulfilledStatus={() => console.log('setting dragging fulfilled status placeholder')}
              />
            );

          case 'search':
            return (
              <div id="test-pane">
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
                  currTerm={{ year: 2019 }}
                  showDialog={this.props.showDialog}
                  // style={{ 'box-shadow': '-3px 5px 20px rgba(0, 0, 0, 0.15) !important' }}
                  // style={{ 'background-color': 'red' }}
                />
              </div>
            );

          case 'degree':
            return (<div id="test-pane"><RequirementsPane className="graphic" /></div>);

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
        <HeaderMenu />
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
  randomCourse: state.courses.random_course,
});

export default connect(mapStateToProps, {
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor, getRandomCourse, fetchPlan,
})(Tutorial);
