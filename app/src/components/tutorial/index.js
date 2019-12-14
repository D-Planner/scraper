/* eslint-disable eqeqeq */
import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import {
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor, getRandomCourse, fetchPlan, updateUser, addAllUserInterests, removeAllUserInterests,
} from '../../actions';
import { ROOT_URL } from '../../constants';

import HeaderMenu from '../headerMenu';
import VideoEmbed from '../videoEmbed';
import InterestTile from '../interestTile/interestTile';
import LoadingWheel from '../loadingWheel';
import NewPlanPage from './pages/newPlanPage';

import right from '../../style/right-arrow.svg';
import left from '../../style/left-arrow.svg';
import './tutorial.scss';

const tutorialData = [
  {
    title: 'Welcome to D-Planner!',
    text: 'We are the future of academic planning. Here’s a little bit about us.',
  },
  {
    title: 'Let\'s get you started.',
    text: 'D-Planner offers cutting-edge academic planning tools. To start, tell us what interests you.',
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

const END_TUTORIAL_TEXT = 'Continue';
const MAX_ADDED_CONTRIBUTORS = 6;

function getInterestById(id) {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    axios.get(`${ROOT_URL}/interests/${id}`, { headers }).then((response) => {
      resolve('interestById', response.data);
    }).catch((error) => {
      reject(error);
    });
  });
}

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
      addedOtherEmailCount: 0,
    };

    this.getInterests = this.getInterests.bind(this);
    this.updateUserInterest = this.updateUserInterest.bind(this);
    this.updateUserInterests = this.updateUserInterests.bind(this);
    this.addNewContributor = this.addNewContributor.bind(this);
    this.removeContributor = this.removeContributor.bind(this);

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
        this.setState({ nextButtonLabel: END_TUTORIAL_TEXT });
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
        this.setState({ nextButtonLabel: END_TUTORIAL_TEXT });
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
          <>
            <div className="tutorial-interests-container">
              {this.state.interests.length === 0 ? 'Interests not loaded...'
                : this.state.interests.map((interest) => {
                  if (this.props.user.interest_profile) {
                    return (
                      <InterestTile
                        active={this.props.user.interest_profile && this.props.user.interest_profile.findIndex(id => id === interest._id) !== -1}
                        user={this.props.user}
                        interest={interest}
                        click={this.updateUserInterest}
                      />
                    );
                  } else {
                    return null;
                  }
                })}
            </div>
            <div className="tutorial-selectors">
              <button className="tutorial-select"
                type="button"
                onClick={() => {
                  this.props.addAllUserInterests(this.props.user._id);
                  this.forceUpdate();
                }}
              >Select All
              </button>
              <button className="tutorial-select"
                type="button"
                onClick={() => {
                  this.props.removeAllUserInterests(this.props.user._id);
                  this.forceUpdate();
                }}
              >
                Select None
              </button>
            </div>
          </>
        );
      }
    } else {
      return (null);
    }
  };

  addNewContributor() {
    if (this.state.addedOtherEmailCount < MAX_ADDED_CONTRIBUTORS) {
      this.setState(prevState => ({ addedOtherEmailCount: prevState.addedOtherEmailCount + 1 }));
    }
  }

  removeContributor() {
    if (this.state.addedOtherEmailCount > 0) {
      this.setState(prevState => ({ addedOtherEmailCount: prevState.addedOtherEmailCount - 1 }));
    }
  }

  renderAddedOtherEmails() {
    if (this.state.addedOtherEmailCount) {
      const addedOtherEmailList = [];
      for (let i = 0; i < this.state.addedOtherEmailCount; i += 1) {
        addedOtherEmailList.push(<input className="tutorial-input" type="email" placeholder="Other - name@college.edu" value={this.state[`otherEmail${i}`]} onChange={e => this.setState({ [`otherEmail${i}`]: e.target.value })} />);
      }
      return addedOtherEmailList;
    } else {
      return null;
    }
  }

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
            {this.renderAddedOtherEmails()}
            <div className="contributor-modify-container">
              {this.state.addedOtherEmailCount < MAX_ADDED_CONTRIBUTORS ? <div className="contributor-modify" onClick={this.addNewContributor}>+ Add another contributor</div> : null}
              {this.state.addedOtherEmailCount > 0 ? <div className="contributor-modify" onClick={this.removeContributor}>- Remove contributor</div> : null}
            </div>
          </form>
        );
      case 3:
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
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor, getRandomCourse, fetchPlan, updateUser, addAllUserInterests, removeAllUserInterests,
})(Tutorial);
