import React from 'react';
import axios from 'axios';

import InterestTile from '../../interestTile/interestTile';
import LoadingWheel from '../../loadingWheel';
import { ROOT_URL } from '../../../constants';
import './newPlanPage.scss';
import { addCourseToFavorites } from '../../../actions';

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
    };

    this.addInterestToSet = this.addInterestToSet.bind(this);
    this.removeInterestFromSet = this.removeInterestFromSet.bind(this);
  }

  componentDidUpdate() {
    if (this.state.fetchedInterests === false) {
      getUserInterests(this.props.user._id).then((interests) => {
        this.setState({ filledInterests: interests, fetchedInterests: true });
      }).catch(error => console.error(error));
    }
  }

  getInterestCheckedStatus(interest) {
    return this.state.relevantInterests.has(interest);
  }

  addInterestToSet(interest) {
    this.setState(({ relevantInterests }) => ({
      relevantInterests: new Set(relevantInterests).add(interest),
    }));
  }

  removeInterestFromSet(interest) {
    this.setState(({ relevantInterests }) => {
      const newChecked = new Set(relevantInterests);
      newChecked.delete(interest);

      return {
        relevantInterests: newChecked,
      };
    });
  }

  render() {
    return (
      <form>
        <input className="tutorial-input" type="text" placeholder="Give your plan a name" value={this.state.planName} onChange={e => this.setState({ planName: e.target.value })} />
        <input className="tutorial-input" type="text" placeholder="Give a short blurb about this plan" value={this.state.planDescription} onChange={e => this.setState({ planDescription: e.target.value })} />
        <input className="tutorial-input" type="text" placeholder="Pick a major for this plan" value={this.state.planMajor} onChange={e => this.setState({ planMajor: e.target.value })} />
        <div className="tutorial-input">Which of your interests does this plan relate to?</div>
        <div className="plan-interests-container">
          {this.state.fetchedInterests ? this.state.filledInterests.map((interest) => {
            const interestActive = this.state.relevantInterests.has(interest._id);
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
          <div style={{ color: 'white' }}>{this.state.fetchedInterests && this.state.filledInterests.length === 0 ? 'You didn\'t select any interests when you got started. Go back and do that now!' : null}
          </div>
        </div>
      </form>
    );
  }
}

export default NewPlanPage;
