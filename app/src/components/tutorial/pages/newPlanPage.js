import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import InterestTile from '../../interestTile/interestTile';
import LoadingWheel from '../../loadingWheel';
import { ROOT_URL } from '../../../constants';
import { createPlan, fetchPlan } from '../../../actions';
import './newPlanPage.scss';

// Make this into an action
/**
 * Gets interests from given user
 * @param {*} userID
 */
function getUserInterests(userID) {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    axios.get(`${ROOT_URL}/auth/${userID}/interests`, { headers }).then((response) => {
      resolve(response.data);
    }).catch((error) => {
      console.error('error', error);
      reject(error);
    });
  });
}

class NewPlanPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filledInterests: [],
      fetchedInterests: false,
      relevantInterests: new Set(),
      // planName: '',
      // planDescription: '',
      // planMajor: '',
    };

    this.addInterestToSet = this.addInterestToSet.bind(this);
    this.removeInterestFromSet = this.removeInterestFromSet.bind(this);
  }

  /**
   * Get interests from backend if not fetched yet
   */
  componentDidUpdate() {
    if (this.state.fetchedInterests === false) {
      getUserInterests(this.props.user._id).then((interests) => {
        this.setState({ filledInterests: interests, fetchedInterests: true });
      }).catch(error => console.error(error));
    }
  }

  /**
   * Returns whether an interest is contained in plan's relevant interests
   * @param {*} interest
   */
  getInterestCheckedStatus(interest) {
    return this.state.relevantInterests.has(interest);
  }

  /**
   * Adds an interest to a plan's relevant interests
   * @param {*} interest
   */
  addInterestToSet(interest) {
    this.state.relevantInterests.add(interest);
    this.handleStateChange('relevantInterests', this.state.relevantInterests.add(interest));
  }

  /**
   * Removes an interest from a plan's relevant interests
   * @param {*} interest
   */
  removeInterestFromSet(interest) {
    this.state.relevantInterests.delete(interest);
    this.handleStateChange('relevantInterests', this.state.relevantInterests);
  }

  /**
   * Coordinates state changes with higher-level tutorial component
   * @param {*} key
   * @param {*} value
   */
  handleStateChange(key, value) {
    this.setState({ [key]: value });
    this.props.handleStateChange(key, value);
  }

  render() {
    return (
      <form>
        {this.props.renderTutorialInput('planName', 'Give your plan a short name', null, null, undefined, true, false, e => this.handleStateChange('planName', e.target.value))}
        {this.props.renderTutorialInput('planDescription', 'Give a short description about this plan', null, null, undefined, true, false, e => this.handleStateChange('planDescription', e.target.value))}
        {/* {this.props.renderTutorialInput('planMajor', 'Select a major for this plan', null, null, undefined, true, false, e => this.handleStateChange('planMajor', e.target.value))} */}
        <div className="tutorial-input-container"><div className="tutorial-input">Which of your interests will this plan focus on?</div></div>
        <div className="plan-interests-container">
          {this.state.fetchedInterests === true ? this.state.filledInterests.map((interest) => {
            if (interest !== null) {
              const interestActive = this.getInterestCheckedStatus(interest._id);
              return (
                <InterestTile
                  key={interest._id}
                  active={interestActive}
                  user={this.props.user}
                  interest={interest}
                  click={(interestID, userID, active) => {
                    if (interestActive === false) {
                      this.addInterestToSet(interestID);
                    } else {
                      this.removeInterestFromSet(interestID);
                    }
                  }}
                />
              );
            } else return null;
          }) : <LoadingWheel />}
        </div>
        <div style={{ color: 'white', textAlign: 'center', marginBottom: '18px' }}>{this.state.fetchedInterests && this.state.filledInterests.length === 0 ? 'You didn\'t select any interests when you got started. Go back and do that now!' : null}
        </div>
      </form>
    );
  }
}

export default withRouter(connect(null, { createPlan, fetchPlan })(NewPlanPage));
