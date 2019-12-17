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
import ErrorMessageSpacer from '../errorMessageSpacer';

const MAX_ADDED_CONTRIBUTORS = 6;
const MAX_SUGGESTIONS_LENGTH = 8;

function getInterestById(id) {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    axios.get(`${ROOT_URL}/interests/${id}`, { headers }).then((response) => {
      resolve(response.data);
    }).catch((error) => {
      reject(error);
    });
  });
}

function findOrCreateAdvisor(collectedInfo) {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    axios.post(`${ROOT_URL}/advisors/`, { collectedInfo }, { headers }).then((response) => {
      console.log('advisor', response.data);
      resolve(response.data);
    }).catch((error) => {
      reject(error);
    });
  });
}

function checkAdvisor(query) {
  return new Promise((resolve, reject) => {
    axios.get(`https://api-lookup.dartmouth.edu/v1/lookup?q=${query}&field=displayName&includeAlum=false&field=eduPersonPrimaryAffiliation&field=mail&field=eduPersonNickname&field=dcDeptclass&field=dcAffiliation&field=telephoneNumber&field=dcHinmanaddr`).then((response) => {
      resolve(response.data);
    }).catch((error) => {
      reject(error);
    });
  });
}

class Tutorial extends React.Component {
  /**
 * Holds all data to display tutorial pages
 * NOTE: Length of this array determines number of pages and when tutorial ends
 *
 * Title: Header text
 * Text: Subheader text
 * neededToContinue: What state values need to be filled to continue to next page (NOT go back)
 */
  tutorialData = [
    {
      title: 'Welcome to D-Planner!',
      text: 'We are the future of academic planning. Here’s a little bit about us.',
      neededToContinue: [],
      onContinue: null,
    },
    {
      title: 'Let\'s get you started.',
      text: 'D-Planner offers cutting-edge academic planning tools. To start, tell us what interests you.',
      neededToContinue: [],
      onContinue: null,
    },
    {
      title: 'Add plan advisors.',
      text: 'Invite academic professionals to review your plans and give personalized feedback.',
      neededToContinue: [
        { name: 'deanEmail', errorMessage: 'Please enter the name of your dean' },
        { name: 'advisorEmail', errorMessage: 'Please enter the name of your advisor' },
      ],
      onContinue: null,
    },
    {
      title: 'Here\'s to your first plan!',
      text: 'A plan is a window into a potential path through college. Imagine your future now!',
      neededToContinue: [
        { name: 'planName', errorMessage: 'Please give your plan a name' },
        { name: 'planDescription', errorMessage: 'Please give a short description of your plan' },
      // { name: 'planMajor', errorMessage: 'Please select a major for your plan' },
      ],
      onContinue: null,
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      tutorialPage: 0,
      interests: null,
      tempUserInterests: [],
      addedOtherEmailCount: 0,
      errorMessage: null,
    };

    this.getInterests = this.getInterests.bind(this);
    this.updateUserInterest = this.updateUserInterest.bind(this);
    this.updateUserInterests = this.updateUserInterests.bind(this);
    this.addNewContributor = this.addNewContributor.bind(this);
    this.removeContributor = this.removeContributor.bind(this);
    this.onInputUpdate = this.onInputUpdate.bind(this);
    this.handleBackgroundClick = this.handleBackgroundClick.bind(this);

    this.getInterests().then(() => {
      this.props.fetchUser();
    });
  }

  componentDidMount() {
    this.setState({
      tutorialPage: parseInt(this.props.match.params.page, 10),
    });
    window.addEventListener('click', this.handleBackgroundClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleBackgroundClick);
  }

  prev = () => {
    if (this.state.tutorialPage - 1 >= 0) {
      this.setState((prevState) => {
        return ({
          tutorialPage: parseInt(prevState.tutorialPage, 10) - 1,
          errorMessage: null,
        });
      }, () => { this.props.history.push(`/tutorial/${this.state.tutorialPage}`); });
    }
  }

  next = () => {
    // Check if the user has filled out all the required info, throws error if not
    let canContinue = true;

    this.tutorialData[this.state.tutorialPage].neededToContinue.forEach((element) => {
      if (canContinue === true && !this.state[element.name]) {
        this.setState({ errorMessage: element.errorMessage });
        canContinue = false;
      }
    });

    // Push
    if (canContinue) {
      this.setState({ errorMessage: null });
      if (this.state.tutorialPage < this.tutorialData.length - 1) { // Within data range
        this.setState((prevState) => { return ({ tutorialPage: parseInt(prevState.tutorialPage, 10) + 1 }); },
          () => { this.props.history.push(`/tutorial/${this.state.tutorialPage}`); });
      } else if (this.state.tutorialPage >= this.tutorialData.length - 1) { // Final tutorial page
        this.endTutorial();
      }
    }
  }

  // Get state change from subpage components
  handleUpdate = input => (e) => {
    this.setState({ [input]: e.target.value });
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

  renderTutorialInput(stateName, placeholder) {
    return (
      <>
        <input className="tutorial-input" placeholder={placeholder} value={this.state[stateName]} onChange={e => this.onInputUpdate(e.target.value, stateName)} />
        {this.renderSuggestedDropdownMenu(stateName)}
      </>
    );
  }

  renderAddedOtherEmails() {
    if (this.state.addedOtherEmailCount) {
      const addedOtherEmailList = [];
      for (let i = 0; i < this.state.addedOtherEmailCount; i += 1) {
        // addedOtherEmailList.push(<input className="tutorial-input" type="email" placeholder="Other - name@yourcollege.edu" value={this.state[`otherEmail${i}`]} onChange={e => this.setState({ [`otherEmail${i}`]: e.target.value })} />);
        addedOtherEmailList.push(this.renderTutorialInput(`otherEmail${i}`, 'Enter Other Contributor Name'));
      }
      return addedOtherEmailList;
    } else {
      return null;
    }
  }

  // Input onChange callback handler
  onInputUpdate(value, stateName) {
    this.setState({ [stateName]: value, dropdownClosed: false }, () => {
      this.fetchSuggestions(value, stateName);
    });
  }

  // Get suggestions based on query and save to stateName
  fetchSuggestions(query, stateName) {
    checkAdvisor(query).then((results) => {
      this.setState((prevState) => {
        if (prevState.deanSuggestions !== results.users) {
          return ({ [`${stateName}Suggestions`]: results.users });
        } else return null;
      });
    }).catch(error => console.error(error));
  }

  // Handles a user click on a suggestion
  handleSuggestionSelect(stateName, suggestion) {
    this.setState({ [stateName]: suggestion.displayName, dropdownClosed: true }, () => {
      const json = suggestion;
      delete json.dcHinmanaddr;
      delete json.telephoneNumber;
      delete json.eduPersonNickname;
      console.log('json', json);
      findOrCreateAdvisor(json);
    });
  }

  // Close menu if user clicks outside
  handleBackgroundClick(e) {
    if (e.target.className !== 'tutorial-dropdown-element') {
      this.setState({ dropdownClosed: true });
    }
  }

  // Render suggestions from passed state array name
  renderSuggestedDropdownMenu(stateName) {
    // Check if the user already selected an option
    if (this.state.dropdownClosed === false) {
      // Initialize "{stateName}Suggestions"
      if (this.state[`${stateName}Suggestions`]) {
        // Check if results length is within length requirements
        if (this.state[`${stateName}Suggestions`].length > MAX_SUGGESTIONS_LENGTH) { // Outside length requirements
          return (
            <div className="dropdown-content">
              {this.state[`${stateName}Suggestions`].slice(0, MAX_SUGGESTIONS_LENGTH - 1).map((user) => {
                return <p className="tutorial-dropdown-element" key={user.displayName} onClick={() => this.handleSuggestionSelect(stateName, user)}>{user.displayName}</p>;
              })}
              <p className="tutorial-dropdown-element">+ {this.state[`${stateName}Suggestions`].length - MAX_SUGGESTIONS_LENGTH + 1} more...</p>
            </div>
          );
        } else { // Within length requirements
          return (
            <div className="dropdown-content">
              {this.state[`${stateName}Suggestions`].map((user) => {
                return <p className="tutorial-dropdown-element" key={user.displayName} onClick={() => this.handleSuggestionSelect(stateName, user)}>{user.displayName}</p>;
              })}
            </div>
          );
        }
      } else {
        return this.setState({ [`${stateName}Suggestions`]: [] });
      }
    } else if (this.state[`${stateName}Suggestions`] && this.state[`${stateName}Suggestions`].length > 0) { // If component is mounted
      return this.setState({ [`${stateName}Suggestions`]: [] });
    } else return null;
  }

  renderTutorialPage = (page) => {
    switch (page) {
      case 0:
        return <VideoEmbed youtubeID="rbasThWVb-c" />;
      case 1:
        return <div>{this.renderUserInterests()}</div>;
      case 2:
        return (
          <form>
            {this.renderTutorialInput('deanEmail', 'Enter Dean Name')}
            {this.renderTutorialInput('advisorEmail', 'Enter Advisor Name')}
            {this.renderAddedOtherEmails()}
            <div className="contributor-modify-container">
              <div className={`contributor-modify${this.state.addedOtherEmailCount >= MAX_ADDED_CONTRIBUTORS ? ' inactive' : ''}`} onClick={this.addNewContributor} role="button" tabIndex={-1}>+ Add another contributor</div>
              <div className={`contributor-modify${this.state.addedOtherEmailCount == 0 ? ' inactive' : ''}`} onClick={this.removeContributor} role="button" tabIndex={-1}>- Remove contributor</div>
            </div>
          </form>
        );
      case 3:
        return <NewPlanPage handleUpdate={this.handleUpdate} user={this.props.user} />;
      default:
        return <div>Error...</div>;
    }
  }

  render() {
    return (
      <div className="tutorial-container">
        <HeaderMenu menuOptions={[]} graphic={{ type: 'progress-bar', data: (100 * (this.state.tutorialPage / (this.tutorialData.length - 1))) }} />
        <div className="arrow-container">
          <img src={left} alt="left" onClick={this.state.tutorialPage === 0 ? null : this.prev} className={`tutorial-arrow left${this.state.tutorialPage === 0 ? ' disabled' : ''}`} />
          <div className="tutorial-content">
            <div className="title">{this.tutorialData[this.state.tutorialPage].title}</div>
            <div className="subtitle">{this.tutorialData[this.state.tutorialPage].text}</div>
            <ErrorMessageSpacer errorMessage={this.state.errorMessage} />
            <div className="rowContainer">
              {this.renderTutorialPage(this.state.tutorialPage)}
            </div>
          </div>
          <img src={right} alt="right" onClick={this.next} className="tutorial-arrow right" />
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
