import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  fetchUser, updateUser, showDialog,
} from '../../actions';
import DialogWrapper from '../dialogWrapper';
import { ROOT_URL } from '../../constants';
import InterestTile from '../../components/interestTile/interestTile';
import './interestProfile.scss';

class InterestProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interests: null,
      tempUserInterests: [],
    };
    this.getInterests = this.getInterests.bind(this);
    this.updateUserInterest = this.updateUserInterest.bind(this);
    this.updateUserInterests = this.updateUserInterests.bind(this);

    this.getInterests().then(() => {
    // console.log('interests', this.state.interests);
      this.props.fetchUser();
    });
  }

  getInterests() {
    return new Promise((resolve, reject) => {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };
      axios.get(`${ROOT_URL}/interests/`, { headers }).then((response) => {
        console.log('interests', response.data);
        this.setState({ interests: response.data }, resolve());
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  updateUserInterest(interestID, userID, active) {
    console.log(`updating user interest with id ${interestID}`);
    this.props.updateUser({ interest_profile: interestID }).then((user) => {
      console.log('user', user);
    }).catch((error) => {
      console.error(error);
    });
    console.log('after updateUser');

  // return new Promise((resolve, reject) => {
  //   const headers = {
  //     Authorization: `Bearer ${localStorage.getItem('token')}`,
  //   };
  //   axios.post(`${ROOT_URL}/interests/update`, { interestID, userID, active }, { headers })
  //     .then((response) => {
  //       console.log(response.data);
  //       resolve(response.data);
  //     });
  // });
  }

  updateUserInterests(interestString) {
  // this.props.fetchUser().then(() => {
  //   this.setState({ tempUserInterests: this.props.user.interest_profile }, () => {

    //   });
    // });

    this.props.fetchUser().then(() => {
      if (this.state.tempUserInterests) {
        console.log('fetched user');
        console.log('user interest profile');
        console.log('this.state.tempUserInterests', this.state.tempUserInterests);
        let toRemove = false;
        let toRemoveIndex = -1;

        console.log(this.state.tempUserInterests);

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
            console.log('remove');
            console.log(interestString);
            console.log('to inactive');

            console.log(this.state.tempUserInterests);
          } else {
            console.log('add');
            console.log(interestString);
            this.setState((prevState) => {
              prevState.tempUserInterests.push({ name: interestString });
              return ({ name: prevState.tempUserInterests });
            });
            console.log(this.state.tempUserInterests);
            console.log('to active');
          }

          console.log('updating user');
          console.log(this.state.tempUserInterests);
          this.props.updateUser({
            interest_profile: this.state.tempUserInterests,
          }).then((res) => {
            this.props.fetchUser().then(() => {
              console.log('response');
              console.log('fetchUser response', res);
              this.setState({ tempUserInterests: res.interest_profile });
            });
          });
        });
      }
    });
  }

  renderUserInterests = () => {
    if (this.props.user) {
      return (
        <div className="container">
          {!this.state.interests ? 'Interests not loaded...'
            : this.state.interests.map((interest) => {
            // console.log(i.name);
            // console.log(interest.name);

              if (this.props.user.interest_profile.findIndex(id => id === interest._id) !== -1) {
                console.log('active', interest.name);
                return (
                // TODO: ADD KEYPRESS
                // eslint-disable-next-line jsx-a11y/interactive-supports-focus
                  <InterestTile active user={this.props.user} interest={interest} updateUserInterests={this.updateUserInterest} />
                );
              } else {
              // console.log('inactive', interest.name);
                return (
                // TODO: ADD KEYPRESS
                // eslint-disable-next-line jsx-a11y/interactive-supports-focus
                  <InterestTile active={false} user={this.props.user} interest={interest} updateUserInterests={this.updateUserInterest} />
                );
              }
            })}
        </div>
      );
    } else {
      return (null);
    }
  };

  render() {
    return (
      <DialogWrapper {...this.props}>
        {this.renderUserInterests()}
      </DialogWrapper>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.current,
});

export default (connect(mapStateToProps, {
  fetchUser, updateUser, showDialog,
})(InterestProfile));
