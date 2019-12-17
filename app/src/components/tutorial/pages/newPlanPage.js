import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import InterestTile from '../../interestTile/interestTile';
import LoadingWheel from '../../loadingWheel';
import { ROOT_URL } from '../../../constants';
import { createPlan, fetchPlan } from '../../../actions';
import { emptyPlan } from '../../../services/empty_plan';
import './newPlanPage.scss';

// Make this into an action
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
      planName: '',
      planDescription: '',
      // planMajor: '',
    };

    this.addInterestToSet = this.addInterestToSet.bind(this);
    this.removeInterestFromSet = this.removeInterestFromSet.bind(this);
    // this.createTutorialPlan = this.createTutorialPlan.bind(this);
  }

  componentDidUpdate() {
    if (this.state.fetchedInterests === false) {
      getUserInterests(this.props.user._id).then((interests) => {
        this.setState({ filledInterests: interests, fetchedInterests: true });
      }).catch(error => console.error(error));
    }
  }

  handleStateChange(key, value) {
    this.setState({ [key]: value });
    this.props.handleStateChange(key, value);
  }

  getInterestCheckedStatus(interest) {
    return this.state.relevantInterests.has(interest);
  }

  addInterestToSet(interest) {
    this.state.relevantInterests.add(interest);
    this.handleStateChange('relevantInterests', this.state.relevantInterests.add(interest));
  }

  removeInterestFromSet(interest) {
    this.state.relevantInterests.delete(interest);
    this.handleStateChange('relevantInterests', this.state.relevantInterests);
  }

  // createTutorialPlan() {
  //   if (this.props.createPlan) {
  //     const terms = ['F', 'W', 'S', 'X'];
  //     let currYear = this.props.user.graduationYear - 4;
  //     let currQuarter = -1;
  //     this.props.createPlan({
  //       terms: emptyPlan.terms.map((term) => {
  //         if (currQuarter === 3) currYear += 1;
  //         currQuarter = (currQuarter + 1) % 4;
  //         return { ...term, year: currYear, quarter: terms[currQuarter] };
  //       }),
  //       name: this.state.planName,
  //       relevant_interests: Array.from(this.state.relevantInterests),
  //       description: this.state.planDescription,
  //       // major: this.state.planMajor,
  //     }, (planID) => {
  //       this.props.fetchPlan(planID).then(() => {
  //         this.props.history.push('/');
  //       });
  //     });
  //   }
  // }

  render() {
    return (
      <form>
        <input className="tutorial-input" type="text" placeholder="Give your plan a short name" value={this.state.planName} onChange={e => this.handleStateChange('planName', e.target.value)} />
        <input className="tutorial-input" type="text" placeholder="Give a short blurb about this plan" value={this.state.planDescription} onChange={e => this.handleStateChange('planDescription', e.target.value)} />
        {/* <input className="tutorial-input" type="text" placeholder="Pick a major for this plan" value={this.state.planMajor} onChange={e => this.handleStateChange('planMajor', e.target.value)} /> */}
        <div className="tutorial-input">Which of your interests does this plan relate to?</div>
        <div className="plan-interests-container">
          {this.state.fetchedInterests ? this.state.filledInterests.map((interest) => {
            const interestActive = this.getInterestCheckedStatus(interest._id);
            return (
              <InterestTile
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
          }) : <LoadingWheel />}
          {/* <ProgressBar percentage={60} /> */}
        </div>
        <div style={{ color: 'white', textAlign: 'center', marginBottom: '18px' }}>{this.state.fetchedInterests && this.state.filledInterests.length === 0 ? 'You didn\'t select any interests when you got started. Go back and do that now!' : null}
          {/* <div onClick={this.createTutorialPlan} role="button" tabIndex={-1}>Click me!</div> */}
        </div>
      </form>
    );
  }
}

export default withRouter(connect(null, { createPlan, fetchPlan })(NewPlanPage));
