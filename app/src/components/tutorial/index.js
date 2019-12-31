/* eslint-disable no-lonely-if */
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



/**
 * Update profile display after tutorial
 * Add possible suggestion options in const
 */



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

/**
 * Searches for course in DB and returns array of results
 * @param {*} query
 */
function searchForCourse(query) {
  return new Promise(((resolve, reject) => {
    axios.get(`${ROOT_URL}/courses/search`, {
      params: query,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then((response) => {
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

/**
 * Sees if an advisor document based on given info has been created.
 * If not, it creates one, returns advisor id
 * @param {*} collectedInfo
 */
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

/**
 * Uses query to lookup potential advisors
 * @param {*} query
 */
function checkAdvisor(query) {
  return new Promise((resolve, reject) => {
    axios.get(`https://api-lookup.dartmouth.edu/v1/lookup?q=${query}&field=displayName&includeAlum=false&field=eduPersonPrimaryAffiliation&field=mail&field=eduPersonNickname&field=dcDeptclass&field=dcAffiliation&field=telephoneNumber&field=dcHinmanaddr`).then((response) => {
      resolve(response.data);
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * Creates an AP placement score with the given parameters
 * Returns id of document
 * @param {*} test
 * @param {*} score
 */
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

// function getAPPlacement(id) {
//   return new Promise((resolve, reject) => {
//     const headers = {
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//     };
//     axios.get(`${ROOT_URL}/auth/ap/${id}/`, { headers }).then((response) => {
//       resolve(response.data);
//     }).catch((error) => {
//       reject(error);
//     });
//   });
// }


/**
 * Updates AP placement document with given change
 * @param {*} id
 * @param {*} change
 */
function updateAPPlacement(id, change) {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    axios.post(`${ROOT_URL}/auth/ap/${id}/`, { change }, { headers }).then((response) => {
      // console.log('response', response);
      resolve(fetchUser());
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * Deletes given AP placement document
 * @param {*} id
 */
function removeAPPlacement(id) {
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
 * title: Header text
 * text: Subheader text
 * subtext: smaller text displayed under "text" and "title"
 * neededToContinue: What state values need to be defined to continue to next page (NOT go back)
 * onContinue: function called on "next" arrow click
 * toRender: what to display in content field of tutorial
 */
  tutorialData = [
    {
      title: 'Before we begin...',
      text: 'Please review the terms and conditions that we operate under.',
      subtext: null,
      neededToContinue: [
        { name: 'tcAccepted', errorMessage: 'Please accept the terms and conditions' },
      ],
      onContinue: () => { },
      toRender: () => (
        <div className="tc-accept">
          <a className="policy-link" href="/policies/termsandconditions" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
          <p className="policy-spacer" />
          <a className="policy-link" href="/policies/privacypolicy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <div className="tc-checkbox-container">
            <div>Please accept our terms and conditions</div>
            {this.props.user.tc_accepted != undefined ? (
              <input
                type="checkbox"
                checked={this.state.tcAccepted || false}
                onChange={(e) => {
                  const check = e.target.checked;
                  this.props.updateUser({ tc_accepted: check === true }).then(() => {
                    this.setState({ tcAccepted: check === true ? true : undefined });
                  });
                }}
              />
            ) : null}
          </div>
        </div>
      ),
    },
    {
      title: 'Welcome to D-Planner!',
      text: 'We are the future of academic planning. Here’s a little bit about us.',
      subtext: null,
      neededToContinue: [],
      onContinue: () => { },
      toRender: () => <VideoEmbed youtubeID="rbasThWVb-c" />,
    },
    {
      title: 'Let\'s get started.',
      text: 'D-Planner offers cutting-edge academic planning tools. To start, tell us what interests you.',
      subtext: 'Please select at least four interests so we can improve our suggestion features in the future',
      neededToContinue: [],
      onContinue: () => { },
      toRender: () => <div>{this.renderUserInterests()}</div>,
    },
    {
      title: 'What AP tests have you taken?',
      text: 'Enter the AP tests you have taken and the score you received.',
      subtext: null,
      neededToContinue: [],
      onContinue: () => { },
      toRender: () => (
        <form>
          {this.renderAPPlacementScores()}
          <div className="contributor-modify-container">
            <div className={`contributor-modify${this.state.addedAPPlacementCount >= MAX_ADDED_AP_PLACEMENTS ? ' inactive' : ''}`} onClick={this.addAPPlacement} role="button" tabIndex={-1}>+ Add AP score</div>
            <div className={`contributor-modify${this.state.addedAPPlacementCount == 0 ? ' inactive' : ''}`} onClick={this.removeAPPlacement} role="button" tabIndex={-1}>- Remove AP score</div>
          </div>
        </form>
      ),
    },
    // DO NOT DELETE, placement course option instead of AP placement
    // {
    //   title: 'What have you already completed?',
    //   text: 'Search for and select which classes you have placed out of.',
    //   subtext: null,
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
      title: 'Add plan advisors.',
      text: 'Invite academic professionals to review your plans and give personalized feedback.',
      subtext: 'Don\'t worry, we won\'t share your information to these people without your permission!',
      neededToContinue: [
        { name: 'deanAdvisorID', errorMessage: 'Please enter the name of your dean in the form below' },
        { name: 'facultyAdvisorID', errorMessage: 'Please enter the name of your faculty advisor in the form below' },
      ],
      onContinue: () => { },
      toRender: () => (
        <form>
          {this.renderTutorialInput('deanAdvisor', 'Enter Dean Name', 'checkAdvisor', 'displayName', ['eduPersonPrimaryAffiliation', 'dcDeptclass'], false, true)}
          {this.renderTutorialInput('facultyAdvisor', 'Enter Advisor Name', 'checkAdvisor', 'displayName', ['eduPersonPrimaryAffiliation', 'dcDeptclass'], false, true)}
          {this.renderOtherContributors()}
          <div className="contributor-modify-container">
            <div className={`contributor-modify${this.state.addedOtherContributorCount >= MAX_ADDED_CONTRIBUTORS ? ' inactive' : ''}`} onClick={this.addNewContributor} role="button" tabIndex={-1}>+ Add another contributor</div>
            <div className={`contributor-modify${this.state.addedOtherContributorCount == 0 ? ' inactive' : ''}`} onClick={this.removeContributor} role="button" tabIndex={-1}>- Remove contributor</div>
          </div>
        </form>
      ),
    },
    {
      title: 'Here\'s to your first plan!',
      text: 'A plan is a window into a potential path through college. Imagine your future now!',
      subtext: null,
      neededToContinue: [
        { name: 'planName', errorMessage: 'Please give your plan a name' },
        { name: 'planDescription', errorMessage: 'Please give a short description of your plan' },
        // { name: 'planMajor', errorMessage: 'Please select a major for your plan' },
      ],
      onContinue: () => this.createTutorialPlan(),
      toRender: () => <NewPlanPage handleStateChange={this.handleNewPlanPageUpdate} renderTutorialInput={this.renderTutorialInput} user={this.props.user} />,
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      tutorialPage: 0,
      interests: null,
      tempUserInterests: [],
      addedOtherContributorCount: 0,
      // addedPlacementCourseCount: 0,
      addedAPPlacementCount: 0,
      errorMessages: [],
      loading: true,
    };

    this.getInterests = this.getInterests.bind(this);
    this.updateUserInterest = this.updateUserInterest.bind(this);
    // this.updateUserInterests = this.updateUserInterests.bind(this);

    this.addNewContributor = this.addNewContributor.bind(this);
    this.removeContributor = this.removeContributor.bind(this);
    // this.addPlacementCourse = this.addPlacementCourse.bind(this);
    // this.removePlacementCourse = this.removePlacementCourse.bind(this);
    this.addAPPlacement = this.addAPPlacement.bind(this);
    this.removeAPPlacement = this.removeAPPlacement.bind(this);

    this.onInputUpdate = this.onInputUpdate.bind(this);
    this.onDropdownUpdate = this.onDropdownUpdate.bind(this);

    this.handleBackgroundClick = this.handleBackgroundClick.bind(this);
    this.handleNewPlanPageUpdate = this.handleNewPlanPageUpdate.bind(this);
    this.createTutorialPlan = this.createTutorialPlan.bind(this);
    this.canContinue = this.canContinue.bind(this);
    this.renderTutorialInput = this.renderTutorialInput.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);

    this.getInterests().then(() => {
      this.props.fetchUser().then(() => {
        this.props.updateUser({});
      });
    });

    this.getAPPlacements();
  }

  componentDidMount() {
    // Get current page from URL
    this.setState({
      tutorialPage: parseInt(this.props.match.params.page, 10),
    });

    window.addEventListener('click', this.handleBackgroundClick);

    /**
     * Get all data from props after 1 second on load
     * Only waits for arrays loaded into the top "if" statement
     */
    new Promise((resolve, reject) => {
      this.setState({
        timeoutKey: setTimeout(() => {
        // Add all props to be loaded HERE (only arrays can be guaranteed to be defined as [])
          if (this.props.user.other_advisors && this.props.user.placement_courses && this.props.user.ap_profile) {
            resolve();
          } else {
            reject();
          }
        }, 1000),
      });
    }).then(() => {
      // Load whether the user has accepted terms and conditions
      if (this.props.user.tc_accepted) {
        this.setState({ tcAccepted: this.props.user.tc_accepted });
      }

      // Load user's dean
      if (this.props.user.dean) {
        this.loadElement('deanAdvisor', this.props.user.dean.full_name, this.props.user.dean._id);
      }

      // Load user's faculty advisor
      if (this.props.user.faculty_advisor) {
        this.loadElement('facultyAdvisor', this.props.user.faculty_advisor.full_name, this.props.user.faculty_advisor._id);
      }

      // Load any other of user's advisors
      let advisorImportCount = 0;
      this.props.user.other_advisors.forEach((savedAdvisor) => {
        if (savedAdvisor !== null) {
          this.loadElement(`otherAdvisor${advisorImportCount}`, savedAdvisor.full_name, savedAdvisor._id);
          this.setState({ addedOtherContributorCount: advisorImportCount + 1 });
          advisorImportCount += 1;
        }
      });

      // Load any placement courses
      // let placementCourseImportCount = 0;
      // this.props.user.placement_courses.forEach((savedCourse) => {
      //   if (savedCourse !== null) {
      //     this.loadElement(`placementCourse${placementCourseImportCount}`, `${savedCourse.department} ${savedCourse.number}`, savedCourse._id);
      //     this.setState({ addedPlacementCourseCount: placementCourseImportCount + 1 });
      //     placementCourseImportCount += 1;
      //   }
      // });

      // Load any AP placements
      let apProfileImportCount = 0;
      this.props.user.ap_profile.forEach((profileElement) => {
        if (profileElement !== null) {
          this.loadElement(`APPlacement${apProfileImportCount}`, profileElement.name, profileElement._id, profileElement.score, true);
          this.setState({ addedAPPlacementCount: apProfileImportCount + 1 });
          apProfileImportCount += 1;
        }
      });
    }).then(() => {
      this.setState({ loading: false });
    }).catch(error => console.log(error));
  }

  componentDidUpdate() {
    // console.log('this.state', this.state);
    // console.log('this.props.user', this.props.user);

    // Update displayed error messages
    this.canContinue();
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleBackgroundClick);
    clearTimeout(this.state.timeoutKey);
  }

  /**
   * Move one page back in tutorial (updates URL)
   * Reset all error messages
   */
  prev = () => {
    if (this.state.tutorialPage - 1 >= 0) {
      this.setState((prevState) => {
        return ({
          tutorialPage: parseInt(prevState.tutorialPage, 10) - 1,
          errorMessages: [],
        });
      }, () => { this.props.history.push(`/tutorial/${this.state.tutorialPage}`); });
    }
  }

  /**
   * Check if user can proceed to the next page
   * Checks whether all fields that need to be defined are
   * If not, pushes to "errorMessages" state field
   */
  canContinue() {
    let canContinue = true;

    this.tutorialData[this.state.tutorialPage].neededToContinue.forEach((element, index) => {
      // If a required state field is undefined and its corresponding error hasn't already been thrown
      if (!this.state[element.name] && this.state.errorMessages.indexOf(element.errorMessage) === -1) {
        // Push an error message
        this.setState((prevState) => {
          return { errorMessages: prevState.errorMessages.concat(element.errorMessage) };
        });
        canContinue = false;

      // If a required element is defined but still has an error meesage loaded
      } else if (this.state[element.name] && this.state.errorMessages.indexOf(element.errorMessage) !== -1) {
        // Remove corresponding error message
        this.setState((prevState) => {
          const arr = prevState.errorMessages;
          arr.splice(prevState.errorMessages.indexOf(element.errorMessage), 1);
          return { errorMessages: arr };
        });

      // Catchall, if any errors are present
      } else if (this.state.errorMessages.length !== 0) {
        // Block continuing if error message has already been set (blocks second, third... click on "next" allowing user to continue)
        canContinue = false;
      } else {
        // Don't do anything
      }
    });

    return canContinue;
  }

  /**
   * Move one page forward in tutorial (updates URL)
   * Reset all remaining error messages
   */
  next = () => {
    // Check if the user has filled out all the required info
    const canContinue = this.canContinue();

    if (canContinue) {
      // Call onContinue from current page
      this.tutorialData[this.state.tutorialPage].onContinue();
      this.setState({ errorMessages: [] });

      // If current page is not the final page
      if (this.state.tutorialPage < this.tutorialData.length - 1) {
        this.setState((prevState) => { return ({ tutorialPage: parseInt(prevState.tutorialPage, 10) + 1 }); },
          () => { this.props.history.push(`/tutorial/${this.state.tutorialPage}`); });

      // If current page is final page
      } else if (this.state.tutorialPage >= this.tutorialData.length - 1) { // Final tutorial page
        this.endTutorial();

      // Catch error, back to page 0
      } else {
        this.setState({ tutorialPage: 0 });
      }
    }
  }

  /**
   * Callback from newPlanPage to set top-level state
   * @param {*} key
   * @param {*} value
   */
  handleNewPlanPageUpdate(key, value) {
    this.setState({ [key]: value });
  }

  /**
   * Pushes back to homepage on tutorial completion
   */
  endTutorial = () => {
    this.props.history.push('/');
  }

  /**
   * Get all possible interests from backend
   */
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

  /**
   * Get all possible AP placements from backend
   */
  getAPPlacements() {
    return new Promise((resolve, reject) => {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };
      axios.get(`${ROOT_URL}/data/ap`, { headers }).then((response) => {
        this.setState({ APPlacements: response.data.data, APPlacementsLink: response.data.link }, () => resolve());
      });
    });
  }

  /**
   * Add given interest to user's interest profile
   * @param {*} interestID
   */
  updateUserInterest(interestID) {
    this.props.updateUser({ interest_profile: interestID })
      .catch((error) => {
        console.error(error);
      });
  }

  // UNUSED
  // updateUserInterests(interestString) {
  //   this.props.fetchUser().then(() => {
  //     if (this.state.tempUserInterests) {
  //       let toRemove = false;
  //       let toRemoveIndex = -1;

  //       Promise.all(
  //         this.state.tempUserInterests.map((e, i) => {
  //           return new Promise((resolve, reject) => {
  //             if (e.name === interestString) {
  //               toRemove = true;
  //               toRemoveIndex = i;
  //             }
  //             resolve();
  //           });
  //         }),
  //       ).then((r) => {
  //         if (toRemove) {
  //           this.setState((prevState) => {
  //             prevState.tempUserInterests.splice(toRemoveIndex, 1);
  //             return ({ tempUserInterests: prevState.tempUserInterests });
  //           });
  //         } else {
  //           this.setState((prevState) => {
  //             prevState.tempUserInterests.push({ name: interestString });
  //             return ({ name: prevState.tempUserInterests });
  //           });
  //         }

  //         this.props.updateUser({
  //           interest_profile: this.state.tempUserInterests,
  //         }).then((res) => {
  //           this.props.fetchUser().then(() => {
  //             this.setState({ tempUserInterests: res.interest_profile });
  //           });
  //         });
  //       });
  //     }
  //   });
  // }

  /**
   * Display all possible user interests and allow user to add them to "interest_profile"
   */
  renderUserInterests = () => {
    if (this.props.user) {
      if (!this.state.interests) {
        return <LoadingWheel />;
      } else {
        return (
          <>
            {/* Render all possible interests */}
            <div className="tutorial-interests-container">
              {this.state.interests.length === 0 ? 'Interests not loaded...'
                : this.state.interests.map((interest) => {
                  if (this.props.user.interest_profile) {
                    return (
                      <InterestTile
                        key={interest._id}
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
              {/* Select all option */}
              <button className="tutorial-select"
                type="button"
                onClick={() => {
                  this.props.addAllUserInterests(this.props.user._id);
                  this.forceUpdate();
                }}
              >Select All
              </button>
              {/* Select none option */}
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

  /**
   * Render a tutorial input
   * @param {*} stateName - which state field to update
   * @param {*} placeholder - what text to show before input
   * @param {*} suggestionLocation - where to get suggestions from
   * @param {*} displayParameterPrimary - what param to show for suggestions (eg name)
   * @param {*} displayParametersSecondary - what additional info to show beside primary parameter
   * @param {*} disableClearInput - hide input clearing
   * @param {*} requireID - require `${[stateName]}ID` instead of [stateName] to continue to next page
   * @param {*} change - what to call when input updates
   */
  renderTutorialInput(stateName, placeholder, suggestionLocation, displayParameterPrimary, displayParametersSecondary = undefined, disableClearInput = false, requireID = false, change = e => this.onInputUpdate(e.target.value, stateName, suggestionLocation)) {
    if (this.state[stateName] === '') {
      this.handleClearClick(stateName);
    }
    return (
      <div className="tutorial-input-container">
        <input
          className={`tutorial-input${this.tutorialData[this.state.tutorialPage].neededToContinue.some(e => (e.name === (requireID === true ? `${stateName}ID` : stateName))) && (requireID === true ? !this.state[`${stateName}ID`] : !this.state[stateName]) ? ' error' : ''}`}
          placeholder={placeholder}
          value={this.state[stateName] || ''}
          onChange={change}
        />
        {this.renderSuggestedDropdownMenu(stateName, suggestionLocation, displayParameterPrimary, displayParametersSecondary)}
        {disableClearInput === false ? (
          <div
            className="tutorial-input-action"
            role="button"
            tabIndex="-1"
            onClick={() => this.handleClearClick(stateName)}
          >
            Clear Saved Input
          </div>
        ) : null}
      </div>
    );
  }

  /**
   * Clear input information from user document in backend
   * @param {*} stateName
   */
  handleClearClick = (stateName) => {
    if (stateName === 'deanAdvisor') {
      this.props.updateUser({ dean: null }).then(() => {
        this.clearElement(stateName);
      });
    } else if (stateName === 'facultyAdvisor') {
      this.props.updateUser({ faculty_advisor: null }).then(() => {
        this.clearElement(stateName);
      });
    } else if (stateName.substring(0, stateName.length - 1) === 'otherAdvisor') {
      this.removeContributor(stateName, false);
    } else {
      this.clearElement(stateName);
    }
  }

  /**
   * Renders AP course information for placement
   * Possible tests, score fields, additional info
   * @param {*} stateName
   */
  renderTutorialAPDropdown(stateName) {
    const APIndex = this.findIndexInAPPlacements(this.state[stateName]);
    const score = this.state[`${stateName}Score`];

    let max_passed_score = -1;
    let max_passed_score_index = -1;

    for (let i = 0; i < this.state.APPlacements[APIndex].options.length; i += 1) {
      if (score >= this.state.APPlacements[APIndex].options[i].min_score && this.state.APPlacements[APIndex].options[i].min_score >= max_passed_score) {
        max_passed_score = this.state.APPlacements[APIndex].options[i].min_score;
        max_passed_score_index = i;
      }
    }

    return (
      <div className="tutorial-option-dropdown-container" key={stateName}>
        <div>
          <select className="ap-course-dropdown tutorial-input" defaultValue={this.state[`${stateName}`]} onChange={e => this.onDropdownUpdate(e.target.value, 'name', stateName, APIndex, max_passed_score_index)}>
            {this.state.APPlacements.map(placement => <option className="tutorial-option-element" key={placement.name}>{placement.name}</option>)}
          </select>
          <select className="ap-score-dropdown tutorial-input" defaultValue={score} onChange={e => this.onDropdownUpdate(e.target.value, 'score', stateName, APIndex, max_passed_score_index)}>
            {AP_SCORES.map(possibleScore => <option key={possibleScore}>{possibleScore}</option>)}
          </select>
        </div>
        {this.renderAdditionalAPInformation(APIndex, score, max_passed_score, max_passed_score_index)}
      </div>
    );
  }

  /**
   * Finds "name" in all possible AP placements, returns index in array of all AP placements
   * @param {*} name
   */
  findIndexInAPPlacements(name) {
    for (let i = 0; i < this.state.APPlacements.length; i += 1) {
      if (name === this.state.APPlacements[i].name) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Renders all additional information from college on AP placement at "index" based on "score"
   * @param {*} index
   * @param {*} score
   */
  renderAdditionalAPInformation(APIndex, score, max_passed_score, max_passed_score_index) {
    // If test is in array (validation)
    if (APIndex !== -1) {
      // Check for highest matching information (eg. with info for scores of 4 and 5 and user score of 5, will pick highest that is still equal to score [5 and not 4])
      if (score > 0 && score <= 5) {

        // If the user met any of the possible requirements for credit with given score
        if (max_passed_score !== -1 && max_passed_score_index !== -1) {
          return Object.entries(this.state.APPlacements[APIndex].options[max_passed_score_index]).map(([k, v]) => {
            return (
              <div className="tutorial-ap-text" key={k}>
                {this.apKeyToTextLookup(k)}
                {': '}
                {typeof v === 'object' ? this.separateArray(v) : v}
              </div>
            );
          });

        // If not, score is below limit for credit
        } else {
          return <div className="tutorial-ap-text">Unfortunately, your score is below the threshold required by Dartmouth College to receive course credit from this exam.</div>;
        }
      } else if (score === 0) {
        return <div className="tutorial-ap-text">Please select a score for {this.state.APPlacements[APIndex].name}</div>;
      } else {
        return <div className="tutorial-ap-text">Invalid score</div>;
      }
    } else {
      return <div className="tutorial-ap-text">Invalid index</div>;
    }
  }

  /**
   * Based on keys in AP placement object, return text to render
   * @param {*} key
   */
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

  /**
   * Separate an array into a user-readable string
   * @param {*} arr
   * @param {*} separator
   * @param {*} subParam - uses [arrayElement.subparam] instead of [arrayElement]
   * @param {*} superParam - uses [superParam.arrayElement] instead of [arrayElement]
   */
  // eslint-disable-next-line class-methods-use-this
  separateArray(arr, separator = ', ', subParam = undefined, superParam = undefined) {
    let returnString = '';
    for (let i = 0; i < arr.length; i += 1) {
      if (subParam) {
        if (i < arr.length - 1) {
          returnString += arr[i][subParam] + separator;
        } else {
          returnString += arr[i][subParam];
        }
      } else if (superParam) {
        if (i < arr.length - 1) {
          returnString += superParam[arr[i]] + separator;
        } else {
          returnString += superParam[arr[i]];
        }
      } else {
        if (i < arr.length - 1) {
          returnString += arr[i] + separator;
        } else {
          returnString += arr[i];
        }
      }
    }
    return returnString;
  }

  /**
   * Adds a new "otherAdvisor" to user document
   */
  addNewContributor() {
    if (this.state.addedOtherContributorCount < MAX_ADDED_CONTRIBUTORS) {
      this.props.updateUser({ other_advisor: this.state[`otherAdvisor${this.state.addedOtherContributorCount - 1}`] });
      this.setState(prevState => ({ addedOtherContributorCount: prevState.addedOtherContributorCount + 1 }));
    }
  }

  /**
   * Removes a contributor from "other_advisors"
   * @param {*} stateName
   * @param {*} remove - whether or not to simply cleanse [stateName] and not remove input
   */
  removeContributor(stateName = undefined, remove = true) {
    if (this.state.addedOtherContributorCount > 0) {
      this.props.updateUser({ other_advisor: this.state[`${stateName}ID`] || this.state[`otherAdvisor${this.state.addedOtherContributorCount - 1}ID`] }).then(() => {
        // FOR REMOVING A NON-FINAL CONTRIBUTOR IN LIST, DON'T REMOVE
        // const removedIndex = stateName[stateName.length - 1];
        // if (removedIndex !== this.state.addedOtherContributorCount - 1) {
        //   for (let i = this.state.addedOtherContributorCount; i > removedIndex; i -= 1) {
        //     let breakLoop = false;
        //     while (breakLoop === false) {
        //       this.clearElement(stateName).then((breakLoop = true));
        //     }
        //   }
        // }
        this.clearElement(stateName || `otherAdvisor${this.state.addedOtherContributorCount - 1}`);
        if (remove === true) {
          this.setState(prevState => ({ addedOtherContributorCount: prevState.addedOtherContributorCount - 1 }));
        }
      });
    }
  }

  /**
   * Render all other contributors besides "dean" and "facultyAdvisor"
   */
  renderOtherContributors() {
    if (this.state.addedOtherContributorCount) {
      const addedOtherEmailList = [];
      for (let i = 0; i < this.state.addedOtherContributorCount; i += 1) {
        addedOtherEmailList.push(this.renderTutorialInput(`otherAdvisor${i}`, 'Enter Other Contributor Name', 'checkAdvisor', 'displayName', ['eduPersonPrimaryAffiliation', 'dcDeptclass']));
      }
      return addedOtherEmailList;
    } else {
      return null;
    }
  }

  // /**
  //  * Increment "addedPlacementCourseCount"
  //  */
  // addPlacementCourse() {
  //   if (this.state.addedPlacementCourseCount < MAX_ADDED_CONTRIBUTORS) {
  //     this.setState(prevState => ({ addedPlacementCourseCount: prevState.addedPlacementCourseCount + 1 }));
  //   }
  // }

  // /**
  //  * Decrement "addedPlacementCourseCount" and remove associated info from final contributor
  //  */
  // removePlacementCourse() {
  //   if (this.state.addedPlacementCourseCount > 0) {
  //     this.props.removeCourseFromPlacements(this.state[`placementCourse${this.state.addedPlacementCourseCount - 1}ID`]);
  //     this.clearElement(`placementCourse${this.state.addedPlacementCourseCount - 1}`);
  //     this.setState(prevState => ({ addedPlacementCourseCount: prevState.addedPlacementCourseCount - 1 }));
  //   }
  // }

  // /**
  //  * Render all placement courses
  //  */
  // renderAddedPlacementCourses() {
  //   if (this.state.addedPlacementCourseCount) {
  //     const addedPlacementCourseList = [];
  //     for (let i = 0; i < this.state.addedPlacementCourseCount; i += 1) {
  //       addedPlacementCourseList.push(this.renderTutorialInput(`placementCourse${i}`, 'Enter Placement Course Name', 'courseSearch', 'title'));
  //     }
  //     return addedPlacementCourseList;
  //   } else {
  //     return null;
  //   }
  // }

  /**
   * Increment "addedAPPlacementCount", load corresponding info from default AP placement
   */
  addAPPlacement() {
    if (this.state.addedAPPlacementCount < MAX_ADDED_AP_PLACEMENTS) {
      createAPPlacement(this.state.APPlacements[0].name, 0).then((response) => {
        this.props.updateUser({ ap_profile: response._id }).then(() => {
          this.setState(prevState => ({
            [`APPlacement${prevState.addedAPPlacementCount}`]: response.name,
            [`APPlacement${prevState.addedAPPlacementCount}ID`]: response._id,
            [`APPlacement${prevState.addedAPPlacementCount}Score`]: response.score,
            addedAPPlacementCount: prevState.addedAPPlacementCount + 1,
          }));
        });
      });
    }
  }

  /**
   * Decrement "addedAPPlacementCount", remove associated info from final AP placement
   */
  removeAPPlacement() {
    if (this.state.addedAPPlacementCount > 0) {
      removeAPPlacement(this.state[`APPlacement${this.state.addedAPPlacementCount - 1}ID`]).then((response) => {
        this.props.updateUser({ ap_profile: this.state[`APPlacement${this.state.addedAPPlacementCount - 1}ID`] }).then(() => {
          this.clearElement(`APPlacement${this.state.addedAPPlacementCount - 1}`);
          this.setState(prevState => ({ addedAPPlacementCount: prevState.addedAPPlacementCount - 1 }));
        });
      });
    }
  }

  /**
   * Render all user AP placement information
   */
  renderAPPlacementScores() {
    if (this.state.addedAPPlacementCount) {
      const addedAPPlacementList = [];
      addedAPPlacementList.push(<div className="tutorial-AP-source">Information Source: <a href={this.state.APPlacementsLink} target="_blank" rel="noopener noreferrer">Dartmouth College</a></div>);
      for (let i = 0; i < this.state.addedAPPlacementCount; i += 1) {
        addedAPPlacementList.push(this.renderTutorialAPDropdown(`APPlacement${i}`, 'Select AP Test', 'Score', 'APPlacement', 'title'));
      }
      return addedAPPlacementList;
    } else {
      return null;
    }
  }

  /**
   * Automatically loads all required fields from user prop for a given element
   * @param {*} stateName - what name to store info under
   * @param {*} elementName
   * @param {*} elementID
   * @param {*} elementScore
   * @param {*} disableLoadedText - disables "LOADED_OPTION_TEXT" in addition to "elementName" on suggestionSelect
   */
  loadElement(stateName, elementName, elementID, elementScore = undefined, disableLoadedText = false) {
    return new Promise((resolve, reject) => {
      this.setState({
        [stateName]: (elementName ? elementName + (disableLoadedText === false ? LOADED_OPTION_TEXT : '') : undefined),
        [`${stateName}ID`]: elementID,
        [`${stateName}Suggestions`]: [],
        [`${stateName}Score`]: elementScore,
      }, () => resolve());
    });
  }

  /**
   * Automatically clears all states associated with "stateName"
   * @param {*} stateName
   */
  clearElement(stateName) {
    return new Promise((resolve, reject) => {
      this.setState({
        [stateName]: undefined,
        [`${stateName}ID`]: undefined,
        [`${stateName}Suggestions`]: undefined,
        [`${stateName}Score`]: undefined,
      }, () => resolve());
    });
  }

  /**
   * Updates state and fetches suggestions based on stateName
   * @param {*} value - what to update "stateName" to
   * @param {*} stateName
   * @param {*} suggestionLocation - where to fetch suggestions from
   */
  onInputUpdate(value, stateName, suggestionLocation) {
    this.setState({ [stateName]: value, dropdownClosed: false }, () => {
      this.fetchSuggestions(value, stateName, suggestionLocation);
    });
  }

  /**
   * Updates AP placement information based on "value" and "location" (name or score)
   * @param {*} value
   * @param {*} location
   * @param {*} stateName
   * @param {*} APIndex - for locating corresponding AP placement in state
   */
  onDropdownUpdate(value, location, stateName, APIndex, max_passed_score_index) {
    this.props.fetchUser(this.props.user._id).then(() => {
      new Promise((resolve, reject) => {
        if (location === 'score') {
          const intValue = parseInt(value, 10);
          this.setState({ [`${stateName}Score`]: intValue }, () => resolve());
        } else {
          this.setState({ [stateName]: value }, () => resolve());
        }
      }).then(() => {
        let updateValue;
        if (location === 'score') {
          updateValue = this.state[`${stateName}Score`];
        } else {
          updateValue = this.state[stateName];
        }
        console.log('stateName', stateName, this.state.APPlacements[APIndex].options);

        console.log(this.state.APPlacements[APIndex].options[max_passed_score_index]);
        const element = this.state.APPlacements[APIndex].options[max_passed_score_index];
        console.log('element', stateName, location, element);
        let exemptions = [];
        let credit_given = [];

        if (element) {
          if (element.exemption) {
            console.log('exemption', element.exemption);
            exemptions = Array.from(element.exemption);
          } else if (element.credit_given) {
            console.log('credit_given', element.credit_given);
            // eslint-disable-next-line prefer-destructuring
            credit_given = Array.from(element.credit_given);
          }
        }

        console.log('arrays', exemptions, credit_given);

        // if (exemptions.length > 0) {

        // }

        if (credit_given.length > 0) {
          credit_given.forEach((el) => {
            console.log('searching for', el);
            return new Promise((resolve, reject) => {
              searchForCourse(parseQuery(el)).then((results) => {
                console.log('results', results);
                if (results.length != 1) {
                  console.log(`[Tutorial.js] Results for query ${el} of length ${results.length}`);
                }
                this.props.addCourseToPlacements(results[0]._id);
                resolve();
              });
            }).then(() => this.props.fetchUser());
          });
        }

        updateAPPlacement(this.state[`${stateName}ID`], { [location]: updateValue });
      });
    });
  }

  /**
   * Get suggestions based on "query" and save to "stateName" from "suggestionLocation"
   * @param {*} query
   * @param {*} stateName
   * @param {*} suggestionLocation
   */
  fetchSuggestions(query, stateName, suggestionLocation) {
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
        searchForCourse(parseQuery(this.state[stateName])).then((results) => {
          this.setState({ [`${stateName}Suggestions`]: results });
        });
        break;
      default:
        break;
    }
  }

  /**
   * Handles a user click on a given advisor suggestion
   * @param {*} stateName
   * @param {*} suggestion
   */
  handleAdvisorSuggestionSelect(stateName, suggestion) {
    this.setState({ [stateName]: (suggestion.displayName + LOADED_OPTION_TEXT), dropdownClosed: true }, () => {
      const json = suggestion;
      delete json.dcHinmanaddr;
      delete json.telephoneNumber;
      delete json.eduPersonNickname;
      findOrCreateAdvisor(json).then((advisorID) => {
        // Check which type of advisor to update in backend
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

  /**
   * Handles a user click on a course suggestion
   * @param {*} stateName
   * @param {*} suggestion
   */
  handlePlacementCourseSuggestionSelect(stateName, suggestion) {
    this.setState({
      [stateName]: (`${suggestion.department} ${suggestion.number} ${LOADED_OPTION_TEXT}`),
      [`${stateName}ID`]: suggestion._id,
      dropdownClosed: true,
    }, () => {
      if (this.props.user.placement_courses.indexOf(suggestion._id) !== -1) {
        this.props.removeCourseFromPlacements(suggestion._id);
      } else {
        this.props.addCourseToPlacements(suggestion._id);
      }
    });
  }

  /**
   * Close a dropdown menu if user clicks outside
   * @param {*} e - event
   */
  handleBackgroundClick(e) {
    if (e.target.className !== 'tutorial-dropdown-element') {
      this.setState({ dropdownClosed: true });
    }
  }

  /**
   * Creates a tutorial plan based on state fields on final page of tutorial
   */
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

  /**
   * Render suggestions from passed state array name
   * @param {*} stateName
   * @param {*} sugestionLocation
   * @param {*} displayParameterPrimary - primary info to display (eg name)
   * @param {*} displayParametersSecondary - additional info to display after primary info
   */
  renderSuggestedDropdownMenu(stateName, sugestionLocation, displayParameterPrimary, displayParametersSecondary) {
    let click = () => { };

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
              {this.state[`${stateName}Suggestions`].slice(0, (MAX_SUGGESTIONS_LENGTH - 1)).map((element) => {
                return <p className="tutorial-dropdown-element" key={element[displayParameterPrimary]} onClick={() => click(stateName, element)}>{element[displayParameterPrimary]}{displayParametersSecondary ? ` - ${this.separateArray(displayParametersSecondary, ', ', undefined, element)}` : ''}</p>;
              })}
              <p className="tutorial-dropdown-element">+ {this.state[`${stateName}Suggestions`].length - MAX_SUGGESTIONS_LENGTH + 1} more...</p>
            </div>
          );
        } else { // Within length requirements
          return (
            <div className="dropdown-content">
              {this.state[`${stateName}Suggestions`].map((element) => {
                return <p className="tutorial-dropdown-element" key={element[displayParameterPrimary]} onClick={() => click(stateName, element)}>{element[displayParameterPrimary]}{displayParametersSecondary ? ` - ${this.separateArray(displayParametersSecondary, ', ', undefined, element)}` : ''}</p>;
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

  /**
   * Renders the given tutorial page
   * @param {*} page
   */
  renderTutorialPage = (page) => {
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
            <div className="text">{this.tutorialData[this.state.tutorialPage].text}</div>
            <div className="subtext">{this.tutorialData[this.state.tutorialPage].subtext}</div>
            {this.state.loading === true ? <LoadingWheel /> : <ErrorMessageSpacer errorMessage={this.state.errorMessages[0]} />}
            <div className="rowContainer">
              {this.renderTutorialPage(this.state.tutorialPage)}
            </div>
          </div>
          <img src={right} alt="right" onClick={this.next} className={`tutorial-arrow right${this.state.errorMessages.length !== 0 ? ' disabled' : ''}`} />
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
