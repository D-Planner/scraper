import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  fetchUser, updateUser, showDialog,
} from '../../actions';
import DialogWrapper from '../dialogWrapper';
import { ROOT_URL } from '../../constants';
import InterestTile from '../../components/interestTile/interestTile';
import LoadingWheel from '../../components/loadingWheel';
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
      this.props.fetchUser();
    });
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
                if (this.props.user.interest_profile.findIndex(id => id === interest._id) !== -1) {
                  return (
                    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
                    <InterestTile active user={this.props.user} interest={interest} updateUserInterests={this.updateUserInterest} />
                  );
                } else {
                  return (
                    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
                    <InterestTile active={false} user={this.props.user} interest={interest} updateUserInterests={this.updateUserInterest} />
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
