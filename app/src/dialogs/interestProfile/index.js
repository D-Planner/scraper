import React, { Component, Fragment } from 'react';
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
      interests: [],
      tempUserInterests: this.props.user.interest_profile,
    };
    this.getInterests = this.getInterests.bind(this);
    this.updateUserInterests = this.updateUserInterests.bind(this);

    this.getInterests();
    this.props.fetchUser();
  }

  getInterests() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    axios.get(`${ROOT_URL}/interests/`, { headers }).then((r) => {
      this.setState({ interests: r.data.interests });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  updateUserInterests(interestString) {
    this.props.fetchUser().then(() => {
      if (this.state.tempUserInterests) {
        console.log('fetched user');
        console.log(this.props.user);
        console.log('user interest profile');
        console.log(this.state.tempUserInterests);
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
            console.log(console.log(interestString));
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
              console.log(res);
              this.setState({ tempUserInterests: res.interest_profile });
            });
          });
        });
      }
    });
  }

  renderUserInterests = () => {
    if (this.state.interests) {
      return (
        <div className="container">
          {this.state.interests.map((interest) => {
            // console.log(i.name);
            // console.log(interest.name);

            if (this.state.tempUserInterests.findIndex(e => e.name === interest.name) !== -1) {
              console.log('active');
              return (
              // TODO: ADD KEYPRESS
              // eslint-disable-next-line jsx-a11y/interactive-supports-focus
                <InterestTile active interest={interest.name} updateUserInterests={this.updateUserInterests} />
              );
            } else {
              console.log('inactive');
              return (
              // TODO: ADD KEYPRESS
              // eslint-disable-next-line jsx-a11y/interactive-supports-focus
                <InterestTile active={false} interest={interest.name} updateUserInterests={this.updateUserInterests} />
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
