/* eslint-disable eqeqeq */
import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import HeaderMenu from '../headerMenu';
import VideoEmbed from '../videoEmbed';

import Term from '../../containers/term';
import Courses from '../../containers/courses';
import SearchPane from '../../containers/sidebar/searchPane';
import RequirementsPane from '../../containers/sidebar/requirementsPane';
import DraggableCourse from '../draggableCourse';

import right from '../../style/right-arrow.svg';
import left from '../../style/left-arrow.svg';

import {
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor, getRandomCourse, fetchPlan, updateUser,
} from '../../actions';

import { ROOT_URL } from '../../constants';
import InterestTile from '../interestTile/interestTile';
import LoadingWheel from '../loadingWheel';

import './tutorial.scss';

import feature1 from '../../style/dplanner-19.png';
import requirementBubbles from '../../style/requirement_bubbles.png';
import emptyTerm from '../../style/empty_term.png';
import filledTerm from '../../style/filled_term.png';
import NewPlanPage from './pages/newPlanPage';

// const tutorialData = [
//   {
//     title: 'Welcome to D-Planner!',
//     isInteractable: false,
//     graphic: feature1,
//     text: '0',
//   },
//   {
//     title: 'The  Basics.',
//     isInteractable: false,
//     graphic: requirementBubbles,
//     text: '1',
//   },
//   {
//     title: 'Course Items.',
//     isInteractable: false,
//     graphic: emptyTerm,
//     text: '2',
//   },
//   {
//     title: 'Course Items.',
//     isInteractable: false,
//     graphic: filledTerm,
//     text: '3',
//   },
//   {
//     title: 'Term Modules.',
//     isInteractable: false,
//     graphic: feature1,
//     text: '4',
//   },
//   {
//     title: 'Finding Classes.',
//     isInteractable: false,
//     graphic: feature1,
//     text: '5',
//   },
//   {
//     title: 'Your Degree.',
//     isInteractable: false,
//     graphic: feature1,
//     text: '6',
//   },
// ];

const tutorialData = [
  {
    title: 'Welcome to D-Planner!',
    text: 'We are the future of academic planning. Here’s a video about us.',
  },
  {
    title: 'Let\'s get you started.',
    text: 'D-Planner offers cutting-edge academic planning tools. To start, tell us a bit about you.',
  },
  {
    title: 'Add plan collaborators.',
    text: 'Invite academic professionals to review your plans and give personalized feedback.',
  },
  {
    title: 'Here\'s to your first plan!',
    text: 'A plan is a window into a potential path through college. Imagine your future now!',
  },
];

const endTutorialText = 'Continue';

function getInterestById(id) {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    axios.get(`${ROOT_URL}/interests/${id}`, { headers }).then((response) => {
      console.log(response.data);
      resolve('interestById', response.data);
    }).catch((error) => {
      reject(error);
    });
  });
}

// // Make this into an action
// function getUserInterests(userID) {
//   return new Promise((resolve, reject) => {
//     const headers = {
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//     };
//     axios.get(`${ROOT_URL}/auth/${userID}/interests`, { headers }).then((response) => {
//       console.log('filledInterests', response.data);
//       resolve(response.data);
//     }).catch((error) => {
//       reject(error);
//     });
//   });
// }

class Tutorial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tutorialPage: 0,
      prevButtonLabel: 'Previous',
      nextButtonLabel: 'Next',
      interests: null,
      tempUserInterests: [],
      deanEmail: '',
      advisorEmail: '',
      otherEmail: '',
    };

    this.getInterests = this.getInterests.bind(this);
    this.updateUserInterest = this.updateUserInterest.bind(this);
    this.updateUserInterests = this.updateUserInterests.bind(this);

    this.getInterests().then(() => {
      this.props.fetchUser();
    });
  }

  componentWillMount() {
    this.props.getRandomCourse();
  }

  // Add check for loading directly into final page
  componentDidMount() {
    this.setState({
      tutorialPage: parseInt(this.props.match.params.page, 10),
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

  getInterests() {
    return new Promise((resolve, reject) => {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };
      axios.get(`${ROOT_URL}/interests/`, { headers }).then((response) => {
        this.setState({ interests: response.data }, resolve());
      });
    });
  }

  updateUserInterest(interestID) {
    this.props.updateUser({ interest_profile: interestID }).then((user) => {
    }).catch((error) => {
      console.error(error);
    });
  }

  updateUserInterests(interestString) {
    this.props.fetchUser().then(() => {
      if (this.state.tempUserInterests) {
        let toRemove = false;
        let toRemoveIndex = -1;

        Promise.all(
          this.state.tempUserInterests.map((e, i) => {
            return new Promise((resolve, reject) => {
              if (e.name === interestString) {
                toRemove = true;
                toRemoveIndex = i;
              }
              resolve();
            });
          }),
        ).then((r) => {
          if (toRemove) {
            this.setState((prevState) => {
              prevState.tempUserInterests.splice(toRemoveIndex, 1);
              return ({ tempUserInterests: prevState.tempUserInterests });
            });
          } else {
            this.setState((prevState) => {
              prevState.tempUserInterests.push({ name: interestString });
              return ({ name: prevState.tempUserInterests });
            });
          }

          this.props.updateUser({
            interest_profile: this.state.tempUserInterests,
          }).then((res) => {
            this.props.fetchUser().then(() => {
              this.setState({ tempUserInterests: res.interest_profile });
            });
          });
        });
      }
    });
  }

  renderUserInterests = () => {
    if (this.props.user) {
      if (!this.state.interests) {
        return <LoadingWheel />;
      } else {
        return (
          <div className="container">
            {this.state.interests.length === 0 ? 'Interests not loaded...'
              : this.state.interests.map((interest) => {
                if (this.props.user.interest_profile && this.props.user.interest_profile.findIndex(id => id === interest._id) !== -1) {
                  return (
                    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
                    <InterestTile active user={this.props.user} interest={interest} click={this.updateUserInterest} />
                  );
                } else {
                  return (
                    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
                    <InterestTile active={false} user={this.props.user} interest={interest} click={this.updateUserInterest} />
                  );
                }
              })}
          </div>
        );
      }
    } else {
      return (null);
    }
  };

  renderTutorialPage = (page) => {
    switch (page) {
      case 0:
        return <VideoEmbed youtubeID="vjhFsPNk6Po" />;
      case 1:
        return <div>{this.renderUserInterests()}</div>;
      case 2:
        return (
          <form>
            <input className="tutorial-input" type="email" placeholder="Dean - name@college.edu" value={this.state.deanEmail} onChange={e => this.setState({ deanEmail: e.target.value })} />
            <input className="tutorial-input" type="email" placeholder="Faculty Advisor - name@college.edu" value={this.state.advisorEmail} onChange={e => this.setState({ advisorEmail: e.target.value })} />
            <input className="tutorial-input" type="email" placeholder="Other - name@college.edu" value={this.state.otherEmail} onChange={e => this.setState({ otherEmail: e.target.value })} />
          </form>
        );
      case 3:
        console.log('user', this.props.user);
        return <NewPlanPage user={this.props.user} />;
      default:
        return <div>Error...</div>;
    }
  }

  render() {
    return (
      <div className="tutorial-container">
        <HeaderMenu menuOptions={[{ name: this.state.prevButtonLabel, callback: () => this.prev() }, { name: this.state.nextButtonLabel, callback: () => this.next() }]} />
        <div className="arrow-container">
          <img src={left} alt="right" onClick={this.prev} id="right-arrow" />
          <div className="tutorial-content">
            <div className="title">{tutorialData[this.state.tutorialPage].title}</div>
            <div className="subtitle">{tutorialData[this.state.tutorialPage].text}</div>
            <div className="rowContainer">
              {this.renderTutorialPage(this.state.tutorialPage)}
            </div>
          </div>
          <img src={right} alt="right" onClick={this.next} id="left-arrow" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  searchResults: state.courses.results,
  resultStamp: state.courses.resultStamp,
  randomCourse: state.courses.random_course,
  user: state.user.current,
});

export default connect(mapStateToProps, {
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor, getRandomCourse, fetchPlan, updateUser,
})(Tutorial);
