/* eslint-disable react/sort-comp */
/* eslint-disable eqeqeq */
import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import {
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor, getRandomCourse, fetchPlan, updateUser, addAllUserInterests, removeAllUserInterests, createPlan, addCourseToPlacements, removeCourseFromPlacements,
} from '../../actions';
import { ROOT_URL } from '../../constants';

import HeaderMenu from '../headerMenu';
import VideoEmbed from '../videoEmbed';
import InterestTile from '../interestTile/interestTile';
import LoadingWheel from '../loadingWheel';
import NewPlanPage from './pages/newPlanPage';
import { emptyPlan } from '../../services/empty_plan';
import { parseQuery } from '../../containers/sidebar/searchPane';

import right from '../../style/right-arrow.svg';
import left from '../../style/left-arrow.svg';
import './tutorial.scss';
import ErrorMessageSpacer from '../errorMessageSpacer';

const MAX_ADDED_CONTRIBUTORS = 6;
// const MAX_ADDED_PLACEMENT_COURSES = 6;
const MAX_ADDED_AP_PLACEMENTS = 99;
const MAX_SUGGESTIONS_LENGTH = 8;
const LOADED_OPTION_TEXT = ' - Added';
const AP_SCORES = [0, 1, 2, 3, 4, 5];

// function getInterestById(id) {
//   return new Promise((resolve, reject) => {
//     const headers = {
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//     };
//     axios.get(`${ROOT_URL}/interests/${id}`, { headers }).then((response) => {
//       resolve(response.data);
//     }).catch((error) => {
//       reject(error);
//     });
//   });
// }

function searchForCourse(query) {
  return new Promise(((resolve, reject) => {
    axios.get(`${ROOT_URL}/courses/search`, {
      params: query,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then((response) => {
      // there are some weird courses like "ECON 0" coming back, so I'm filtering them out for now
      console.log('search for course', response.data);
      resolve(response.data);
    }).catch((error) => {
      console.log(error);
      reject();
    });
  }));
}

// function getAdvisorById(id) {
//   console.log('getAdvisorById', id);
//   if (id !== null) {
//     return new Promise((resolve, reject) => {
//       const headers = {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       };
//       axios.get(`${ROOT_URL}/advisors/${id}`, { headers }).then((response) => {
//         resolve(response.data);
//       }).catch((error) => {
//         reject(error);
//       });
//     });
//   } else return null;
// }

function findOrCreateAdvisor(collectedInfo) {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    axios.post(`${ROOT_URL}/advisors/`, { collectedInfo }, { headers }).then((response) => {
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

function createAPPlacement(test, score) {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    axios.post(`${ROOT_URL}/auth/ap/`, { test, score }, { headers }).then((response) => {
      resolve(response.data);
    }).catch((error) => {
      reject(error);
    });
  });
}

function getAPPlacement(id) {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    axios.get(`${ROOT_URL}/auth/ap/${id}/`, { headers }).then((response) => {
      resolve(response.data);
    }).catch((error) => {
      reject(error);
    });
  });
}

function updateAPPlacement(id, change) {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    axios.post(`${ROOT_URL}/auth/ap/${id}/`, { change }, { headers }).then((response) => {
      resolve(response.data);
    }).catch((error) => {
      reject(error);
    });
  });
}

function deleteAPPlacement(id) {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    axios.delete(`${ROOT_URL}/auth/ap/${id}/`, { headers }).then((response) => {
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
      onContinue: () => {},
      toRender: () => <VideoEmbed youtubeID="rbasThWVb-c" />,
    },
    {
      /**
       * Add minimum number of interests to select
       */
      title: 'Let\'s get started.',
      text: 'D-Planner offers cutting-edge academic planning tools. To start, tell us what interests you.',
      neededToContinue: [],
      onContinue: () => {},
      toRender: () => <div>{this.renderUserInterests()}</div>,
    },
    {
      /**
       * Add search for AP courses
       */
      title: 'What AP tests have you taken?',
      text: 'Enter the AP tests you have taken and the score you received.',
      neededToContinue: [],
      onContinue: () => {},
      toRender: () => (
        <form>
          {this.renderAPPlacementScores()}
          <div className="contributor-modify-container">
            <div className={`contributor-modify${this.state.addedAPPlacementCount >= MAX_ADDED_AP_PLACEMENTS ? ' inactive' : ''}`} onClick={this.addAPPlacementScore} role="button" tabIndex={-1}>+ Add AP score</div>
            <div className={`contributor-modify${this.state.addedAPPlacementCount == 0 ? ' inactive' : ''}`} onClick={this.removeAPPlacementScore} role="button" tabIndex={-1}>- Remove AP score</div>
          </div>
        </form>
      ),
    },
    // {
    //   /**
    //    * Add description on hover
    //    * Add search for AP courses
    //    * Add department key for users
    //    */
    //   title: 'What have you already completed?',
    //   text: 'Search for and select which classes you have placed out of.',
    //   neededToContinue: [],
    //   onContinue: () => {},
    //   toRender: () => (
    //     <form>
    //       {this.renderAddedPlacementCourses()}
    //       <div className="contributor-modify-container">
    //         <div className={`contributor-modify${this.state.addedPlacementCourseCount >= MAX_ADDED_PLACEMENT_COURSES ? ' inactive' : ''}`} onClick={this.addPlacementCourse} role="button" tabIndex={-1}>+ Add another placement course</div>
    //         <div className={`contributor-modify${this.state.addedPlacementCourseCount == 0 ? ' inactive' : ''}`} onClick={this.removePlacementCourse} role="button" tabIndex={-1}>- Remove placement course</div>
    //       </div>
    //     </form>
    //   ),
    // },
    {
      /**
       * Add affiliation at dartmouth on hover
       * Add nickname search and class year
       */
      title: 'Add plan advisors.',
      text: 'Invite academic professionals to review your plans and give personalized feedback.',
      neededToContinue: [
        { name: 'deanAdvisor', errorMessage: 'Please select the name of your dean from the dropdown' },
        { name: 'facultyAdvisor', errorMessage: 'Please select the name of your faculty advisor from the dropdown' },
      ],
      onContinue: () => {},
      toRender: () => (
        <form>
          {this.renderTutorialInput('deanAdvisor', 'Enter Dean Name', 'checkAdvisor', 'displayName')}
          {this.renderTutorialInput('facultyAdvisor', 'Enter Advisor Name', 'checkAdvisor', 'displayName')}
          {this.renderAddedOtherEmails()}
          <div className="contributor-modify-container">
            <div className={`contributor-modify${this.state.addedOtherEmailCount >= MAX_ADDED_CONTRIBUTORS ? ' inactive' : ''}`} onClick={this.addNewContributor} role="button" tabIndex={-1}>+ Add another contributor</div>
            <div className={`contributor-modify${this.state.addedOtherEmailCount == 0 ? ' inactive' : ''}`} onClick={this.removeContributor} role="button" tabIndex={-1}>- Remove contributor</div>
          </div>
        </form>
      ),
    },
    {
      title: 'Here\'s to your first plan!',
      text: 'A plan is a window into a potential path through college. Imagine your future now!',
      neededToContinue: [
        { name: 'planName', errorMessage: 'Please give your plan a name' },
        { name: 'planDescription', errorMessage: 'Please give a short description of your plan' },
      // { name: 'planMajor', errorMessage: 'Please select a major for your plan' },
      ],
      onContinue: () => this.createTutorialPlan(),
      toRender: () => <NewPlanPage handleStateChange={this.handleNewPlanPageUpdate} user={this.props.user} />,
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      tutorialPage: 0,
      interests: null,
      tempUserInterests: [],
      addedOtherEmailCount: 0,
      // addedPlacementCourseCount: 0,
      addedAPPlacementCount: 0,
      errorMessage: null,
    };

    this.getInterests = this.getInterests.bind(this);
    this.updateUserInterest = this.updateUserInterest.bind(this);
    this.updateUserInterests = this.updateUserInterests.bind(this);

    this.addNewContributor = this.addNewContributor.bind(this);
    this.removeContributor = this.removeContributor.bind(this);
    // this.addPlacementCourse = this.addPlacementCourse.bind(this);
    // this.removePlacementCourse = this.removePlacementCourse.bind(this);
    this.addAPPlacementScore = this.addAPPlacementScore.bind(this);
    this.removeAPPlacementScore = this.removeAPPlacementScore.bind(this);

    this.onInputUpdate = this.onInputUpdate.bind(this);
    this.onDropdownUpdate = this.onDropdownUpdate.bind(this);

    this.handleBackgroundClick = this.handleBackgroundClick.bind(this);
    this.handleNewPlanPageUpdate = this.handleNewPlanPageUpdate.bind(this);
    this.createTutorialPlan = this.createTutorialPlan.bind(this);

    this.getInterests().then(() => {
      this.props.fetchUser().then(() => {
        this.props.updateUser({});
      });
    });

    this.getAPPlacements();

    createAPPlacement('test', 5).then((response1) => {
      console.log('response1', response1);
      updateAPPlacement(response1._id, { name: 'Test 2' }).then((response4) => {
        console.log('response4', response4);
        getAPPlacement(response4._id).then((response2) => {
          console.log('response2', response2);
          deleteAPPlacement(response2._id).then((response3) => {
            console.log('response3', response3);
          });
        });
      });
    });
  }

  componentDidMount() {
    this.setState({
      tutorialPage: parseInt(this.props.match.params.page, 10),
    });
    window.addEventListener('click', this.handleBackgroundClick);

    // Load in all data from props arrays when loaded
    new Promise((resolve, reject) => {
      setTimeout(() => {
        // Add all props to be loaded HERE (only arrays can be guaranteed to be defined as [])
        if (this.props.user.other_advisors && this.props.user.placement_courses) {
          resolve();
        }
      }, 1000);
    }).then(() => {
      if (this.props.user.dean) {
        console.log('dean', this.props.user.dean);
        this.loadElement('deanAdvisor', this.props.user.dean.full_name, this.props.user.dean._id);
      }

      if (this.props.user.faculty_advisor) {
        console.log('faculty advisor', this.props.user.faculty_advisor);
        this.loadElement('facultyAdvisor', this.props.user.faculty_advisor.full_name, this.props.user.faculty_advisor._id);
      }

      console.log('other advisors', this.props.user.other_advisors);
      let advisorImportCount = 0;
      this.props.user.other_advisors.forEach((savedAdvisor) => {
        console.log('savedAdvisor', savedAdvisor);
        this.loadElement(`otherAdvisor${advisorImportCount}`, savedAdvisor.full_name, savedAdvisor._id);
        this.setState({ addedOtherEmailCount: advisorImportCount + 1 });
        advisorImportCount += 1;
        console.log('advisorImportCount', advisorImportCount);
      });

      console.log('placement courses');
      let placementCourseImportCount = 0;
      console.log('user placements', this.props.user.placement_courses);
      this.props.user.placement_courses.forEach((savedCourse) => {
        if (savedCourse !== null) {
          console.log('savedCourse', savedCourse);
          this.loadElement(`placementCourse${placementCourseImportCount}`, `${savedCourse.department} ${savedCourse.number}`, savedCourse._id);
          this.setState({ addedPlacementCourseCount: placementCourseImportCount + 1 });
          placementCourseImportCount += 1;
        }
      });

      console.log('ap profile');
      let apProfileImportCount = 0;
      console.log('user ap_profile', this.props.user.ap_profile);
      this.props.user.ap_profile.forEach((profileElement) => {
        if (profileElement !== null) {
          console.log('profileElement', profileElement);
          this.loadElement(`placementCourse${placementCourseImportCount}`, `${profileElement.department} ${profileElement.number}`, profileElement._id);
          this.setState({ addedAPPlacementCount: apProfileImportCount + 1 });
          apProfileImportCount += 1;
        }
      });
    });
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
      this.tutorialData[this.state.tutorialPage].onContinue();
      this.setState({ errorMessage: null });
      if (this.state.tutorialPage < this.tutorialData.length - 1) { // Within data range
        this.setState((prevState) => { return ({ tutorialPage: parseInt(prevState.tutorialPage, 10) + 1 }); },
          () => { this.props.history.push(`/tutorial/${this.state.tutorialPage}`); });
      } else if (this.state.tutorialPage >= this.tutorialData.length - 1) { // Final tutorial page
        this.endTutorial();
      } else {
        this.setState({ tutorialPage: 0 }); // Catch error
      }
    }
  }

  // Get state change from subpage components
  handleNewPlanPageUpdate(key, value) {
    this.setState({ [key]: value });
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

  getAPPlacements() {
    return new Promise((resolve, reject) => {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };
      axios.get(`${ROOT_URL}/data/ap`, { headers }).then((response) => {
        console.log('AP Placements', response.data);
        this.setState({ APPlacements: response.data.data }, () => resolve());
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
      console.log('interest_profile', this.props.user.interest_profile);
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

  renderTutorialInput(stateName, placeholder, suggestionLocation, displayParameter) {
    return (
      <>
        <input className="tutorial-input" placeholder={placeholder} value={this.state[stateName]} onChange={e => this.onInputUpdate(e.target.value, stateName, suggestionLocation)} />
        {this.renderSuggestedDropdownMenu(stateName, suggestionLocation, displayParameter)}
      </>
    );
  }

  renderTutorialAPDropdown(stateName, coursePlaceholder, scorePlaceholder, suggestionLocation, displayParameter) {
    return (
      <div className="tutorial-option-dropdown-container">
        <div>
          <select className="ap-course-dropdown tutorial-input" name={coursePlaceholder} onChange={e => this.onDropdownUpdate(e.target.value, stateName)}>
            {this.state.APPlacements.map(placement => <option className="tutorial-option-element">{placement.name}</option>)}
          </select>
          <select className="ap-score-dropdown tutorial-input" name={scorePlaceholder} onChange={e => this.onDropdownUpdate(e.target.value, stateName)}>
            {AP_SCORES.map(possibleScore => <option>{possibleScore}</option>)}
          </select>
        </div>
        {this.renderAdditionalAPInformation(8, 5)}
      </div>
    );
  }

  renderAdditionalAPInformation(index, score) {
    if (score > 0 && score <= 5) {
      let max_passed_score = -1;
      let max_passed_score_index = -1;

      for (let i = 0; i < this.state.APPlacements[index].options.length; i += 1) {
        if (score >= this.state.APPlacements[index].options[i].min_score && this.state.APPlacements[index].options[i].min_score >= max_passed_score) {
          max_passed_score = this.state.APPlacements[index].options[i].min_score;
          max_passed_score_index = i;
        }
      }

      if (max_passed_score !== -1 && max_passed_score_index !== -1) {
        return Object.entries(this.state.APPlacements[index].options[max_passed_score_index]).map(([k, v]) => {
          return (<div className="tutorial-ap-text">{this.apKeyToTextLookup(k)}: {typeof v === 'object' ? this.separateArray(v) : v}</div>);
        });
      } else {
        return <div className="tutorial-ap-text">Unfortunately, your score is below the threshold required by Dartmouth College to receive course credit from this exam.</div>;
      }
    } else if (score === 0) {
      return <div className="tutorial-ap-text">Please select a score for {this.state.APPlacements[index].name}</div>;
    } else {
      return <div className="tutorial-ap-text">Invalid score</div>;
    }
  }

  // Converts a string (key) to text to display
  // eslint-disable-next-line class-methods-use-this
  apKeyToTextLookup(key) {
    switch (key.toLowerCase()) {
      case 'min_score':
        return 'Score required';
      case 'credit_given':
        return 'Credit received';
      case 'placement':
        return 'Placement received';
      case 'placement_message':
        return 'Additional placement information';
      case 'language_fulfilled':
        return 'Language fulfilled';
      case 'exemption':
        return 'Exemption received';
      case 'credit_message':
        return 'Additional credit information';
      default:
        return '';
    }
  }

  // eslint-disable-next-line class-methods-use-this
  separateArray(arr, separator = ', ') {
    let returnString = '';
    for (let i = 0; i < arr.length; i += 1) {
      if (i < arr.length - 1) {
        returnString += arr[i] + separator;
      } else {
        returnString += arr[i];
      }
    }
    return returnString;
  }

  // Advisors and contributors
  addNewContributor() {
    if (this.state.addedOtherEmailCount < MAX_ADDED_CONTRIBUTORS) {
      this.props.updateUser({ other_advisor: this.state[`otherAdvisor${this.state.addedOtherEmailCount - 1}`] });
      this.setState(prevState => ({ addedOtherEmailCount: prevState.addedOtherEmailCount + 1 }));
    }
  }

  removeContributor() {
    if (this.state.addedOtherEmailCount > 0) {
      console.log('other_advisors on removeContributor', this.props.user.other_advisors);
      console.log('removing', this.state[`otherAdvisor${this.state.addedOtherEmailCount - 1}ID`], this.state.addedOtherEmailCount);
      this.props.updateUser({ other_advisor: this.state[`otherAdvisor${this.state.addedOtherEmailCount - 1}ID`] }).then(() => {
        this.clearElement(`otherAdvisor${this.state.addedOtherEmailCount - 1}`);
        this.setState(prevState => ({ addedOtherEmailCount: prevState.addedOtherEmailCount - 1 }));
      });
    }
  }

  renderAddedOtherEmails() {
    if (this.state.addedOtherEmailCount) {
      const addedOtherEmailList = [];
      for (let i = 0; i < this.state.addedOtherEmailCount; i += 1) {
        addedOtherEmailList.push(this.renderTutorialInput(`otherAdvisor${i}`, 'Enter Other Contributor Name', 'checkAdvisor', 'displayName'));
      }
      return addedOtherEmailList;
    } else {
      return null;
    }
  }

  // Placement Courses
  addPlacementCourse() {
    if (this.state.addedPlacementCourseCount < MAX_ADDED_CONTRIBUTORS) {
      this.setState(prevState => ({ addedPlacementCourseCount: prevState.addedPlacementCourseCount + 1 }));
    }
  }

  removePlacementCourse() {
    if (this.state.addedPlacementCourseCount > 0) {
      console.log('count', this.state.addedPlacementCourseCount);
      this.props.removeCourseFromPlacements(this.state[`placementCourse${this.state.addedPlacementCourseCount - 1}ID`]);
      this.clearElement(`placementCourse${this.state.addedPlacementCourseCount - 1}`);
      this.setState(prevState => ({ addedPlacementCourseCount: prevState.addedPlacementCourseCount - 1 }));
    }
  }

  renderAddedPlacementCourses() {
    if (this.state.addedPlacementCourseCount) {
      const addedPlacementCourseList = [];
      for (let i = 0; i < this.state.addedPlacementCourseCount; i += 1) {
        addedPlacementCourseList.push(this.renderTutorialInput(`placementCourse${i}`, 'Enter Placement Course Name', 'courseSearch', 'title'));
      }
      return addedPlacementCourseList;
    } else {
      return null;
    }
  }

  // Placement Courses
  addAPPlacementScore() {
    if (this.state.addedAPPlacementCount < MAX_ADDED_AP_PLACEMENTS) {
      this.setState(prevState => ({ addedAPPlacementCount: prevState.addedAPPlacementCount + 1 }));
    }
  }

  removeAPPlacementScore() {
    if (this.state.addedAPPlacementCount > 0) {
      console.log('AP count', this.state.addedAPPlacementCount);
      // this.props.removeCourseFromPlacements(this.state[`APPlacement${this.state.addedAPPlacementCount - 1}ID`]);
      this.clearElement(`APPlacement${this.state.addedAPPlacementCount - 1}`);
      this.setState(prevState => ({ addedAPPlacementCount: prevState.addedAPPlacementCount - 1 }));
    }
  }

  renderAPPlacementScores() {
    if (this.state.addedAPPlacementCount) {
      const addedAPPlacementList = [];
      for (let i = 0; i < this.state.addedAPPlacementCount; i += 1) {
        addedAPPlacementList.push(this.renderTutorialAPDropdown(`APPlacement${i}`, 'Select AP Test', 'Score', 'APPlacement', 'title'));
      }
      return addedAPPlacementList;
    } else {
      return null;
    }
  }

  // Automatically loads all required fields from user prop
  loadElement(stateName, elementName, elementID) {
    this.setState({
      [stateName]: elementName + LOADED_OPTION_TEXT,
      [`${stateName}ID`]: elementID,
      [`${stateName}Suggestions`]: [],
    });
  }

  // Automatically clears all states associated with 'stateName'
  clearElement(stateName) {
    console.log('clearing', stateName);
    this.setState({
      [stateName]: undefined,
      [`${stateName}ID`]: undefined,
      [`${stateName}Suggestions`]: undefined,
    });
  }

  // Input onChange callback handler
  onInputUpdate(value, stateName, suggestionLocation) {
    this.setState({ [stateName]: value, dropdownClosed: false }, () => {
      this.fetchSuggestions(value, stateName, suggestionLocation);
      console.log(this.state);
    });
  }

  // Dropdown onChange callback handler
  onDropdownUpdate(value, stateName) {
    this.setState({ [stateName]: value }, () => console.log(value, '=>', this.state[stateName]));
  }

  // Get suggestions based on query and save to stateName
  fetchSuggestions(query, stateName, suggestionLocation) {
    console.log('suggestionLocation', suggestionLocation);
    switch (suggestionLocation) {
      case 'checkAdvisor':
        checkAdvisor(query).then((results) => {
          this.setState((prevState) => {
            if (prevState[`${stateName}Suggestions`] !== results.users) {
              return ({ [`${stateName}Suggestions`]: results.users });
            } else return null;
          });
        }).catch(error => console.error(error));
        break;
      case 'courseSearch':
        console.log('query', this.state[stateName]);
        searchForCourse(parseQuery(this.state[stateName])).then((results) => {
          console.log('results', results);
          this.setState({ [`${stateName}Suggestions`]: results }, () => console.log(this.state[`${stateName}Suggestions`]));
        });
        break;
      default:
        break;
    }
  }

  // Handles a user click on an advisor suggestion
  handleAdvisorSuggestionSelect(stateName, suggestion) {
    this.setState({ [stateName]: (suggestion.displayName + LOADED_OPTION_TEXT), dropdownClosed: true, errorMessage: null }, () => {
      const json = suggestion;
      delete json.dcHinmanaddr;
      delete json.telephoneNumber;
      delete json.eduPersonNickname;
      findOrCreateAdvisor(json).then((advisorID) => {
        // Check which advisor to update in backend
        let advisorIdentifier;

        if (stateName === 'deanAdvisor') {
          advisorIdentifier = 'dean';
        } else if (stateName === 'facultyAdvisor') {
          advisorIdentifier = 'faculty_advisor';
        } else if (stateName.slice(0, stateName.length - 1) === 'otherAdvisor') {
          advisorIdentifier = 'other_advisor';
        } else {
          advisorIdentifier = undefined;
        }

        this.setState({ [`${stateName}ID`]: advisorID });

        if (advisorIdentifier) {
          this.props.updateUser({ [advisorIdentifier]: advisorID });
        }
      });
    });
  }

  // Handles a user click on a course suggestion
  handlePlacementCourseSuggestionSelect(stateName, suggestion) {
    console.log('suggestion befpre', suggestion, suggestion._id);
    this.setState({
      [stateName]: (`${suggestion.department} ${suggestion.number} ${LOADED_OPTION_TEXT}`),
      [`${stateName}ID`]: suggestion._id,
      dropdownClosed: true,
      errorMessage: null,
    }, () => {
      if (this.props.user.placement_courses.indexOf(suggestion._id) !== -1) {
        console.log('removing from placements');
        this.props.removeCourseFromPlacements(suggestion._id).then(() => {
          console.log('user placements', this.props.user.placement_courses);
        });
      } else {
        console.log('adding to placements');
        this.props.addCourseToPlacements(suggestion._id).then(() => {
          console.log('user placements', this.props.user.placement_courses);
        });
      }
      console.log('suggestion', this.state[stateName], this.state[`${stateName}ID`]);
      console.log('user placement_courses', this.props.user.placement_courses);
    });
  }

  // Close menu if user clicks outside
  handleBackgroundClick(e) {
    if (e.target.className !== 'tutorial-dropdown-element') {
      this.setState({ dropdownClosed: true });
    }
  }

  createTutorialPlan() {
    if (this.props.createPlan) {
      const terms = ['F', 'W', 'S', 'X'];
      let currYear = this.props.user.graduationYear - 4;
      let currQuarter = -1;
      this.props.createPlan({
        terms: emptyPlan.terms.map((term) => {
          if (currQuarter === 3) currYear += 1;
          currQuarter = (currQuarter + 1) % 4;
          return { ...term, year: currYear, quarter: terms[currQuarter] };
        }),
        name: this.state.planName,
        relevant_interests: this.state.relevantInterests ? Array.from(this.state.relevantInterests) : null,
        description: this.state.planDescription,
        // major: this.state.planMajor,
      }, (planID) => {
        this.props.fetchPlan(planID).then(() => {
          // this.props.history.push('/');
        });
      });
    }
  }

  // Render suggestions from passed state array name
  renderSuggestedDropdownMenu(stateName, sugestionLocation, displayParameter) {
    // Function to be called on click of option
    let click = () => {};

    switch (sugestionLocation) {
      case 'checkAdvisor':
        click = (sn, el) => this.handleAdvisorSuggestionSelect(sn, el);
        break;
      case 'courseSearch':
        click = (sn, el) => {
          this.handlePlacementCourseSuggestionSelect(sn, el);
          this.setState({ [`${stateName}ID`]: el._id });
        };
        break;
      default:
        break;
    }

    // Check if the user already selected an option
    if (this.state.dropdownClosed === false) {
      // Initialize "{stateName}Suggestions"
      if (this.state[`${stateName}Suggestions`]) {
        // Check if results length is within length requirements
        if (this.state[`${stateName}Suggestions`].length > MAX_SUGGESTIONS_LENGTH) { // Outside length requirements
          return (
            <div className="dropdown-content">
              {this.state[`${stateName}Suggestions`].slice(0, MAX_SUGGESTIONS_LENGTH - 1).map((element) => {
                return <p className="tutorial-dropdown-element" key={element[displayParameter]} onClick={() => click(stateName, element)}>{element[displayParameter]}</p>;
              })}
              <p className="tutorial-dropdown-element">+ {this.state[`${stateName}Suggestions`].length - MAX_SUGGESTIONS_LENGTH + 1} more...</p>
            </div>
          );
        } else { // Within length requirements
          return (
            <div className="dropdown-content">
              {this.state[`${stateName}Suggestions`].map((element) => {
                return <p className="tutorial-dropdown-element" key={element[displayParameter]} onClick={() => click(stateName, element)}>{element[displayParameter]}</p>;
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
    // console.log('page', page);
    // console.log('toRender', this.tutorialData[page].toRender);
    return this.tutorialData[page].toRender();
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
  addCourseToFavorites, courseSearch, stampIncrement, fetchBookmarks, fetchUser, showDialog, declareMajor, getRandomCourse, fetchPlan, updateUser, addAllUserInterests, removeAllUserInterests, createPlan, addCourseToPlacements, removeCourseFromPlacements,
})(Tutorial);
