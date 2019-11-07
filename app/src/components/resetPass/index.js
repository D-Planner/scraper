import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { ROOT_URL } from '../../constants';
import SignIn from '../../containers/signIn';
import logo from '../../style/logo.svg';
import {
  updateUser, fetchUser, sendResetPass, signinUser,
} from '../../actions';
import './resetPass.scss';

function getUserByKey(key) {
  return new Promise((resolve, reject) => {
    axios.get(`${ROOT_URL}/auth/verify/pass/bykey?key=${key}`).then((response) => {
      console.log('response', response.data);
      resolve(response.data);
    }).catch((error) => {
      console.log(error);
      reject(error);
    });
  });
}

class ResetPass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: null,
      newPassword: '', // First field
      newPasswordDuplicate: '', // Check field (for error checking)
      errorMessage: null, // What to tell the user (also determines whether the message field is displayed)
      fetchedUser: null, // User grabbed from the backend by finding key
    };

    this.sendPasswordReset = this.sendPasswordReset.bind(this);
  }

  componentDidMount() {
    console.log('urlparam', this.props.match.params.key);
    getUserByKey(this.props.match.params.key)
      .then((user) => {
        this.setState({ fetchedUser: user });

        if (user.passwordVerificationKey === '-1') {
          console.log('already verified');
          return (this.props.history.push('/'));
        }
        console.log('user._id', user._id);
        console.log('key', this.props.match.params.key);
        axios.post(`${ROOT_URL}/auth/verify/pass/`, { userID: user._id, key: this.props.match.params.key })
          .then((response) => {
            this.setState({ verified: response.data.passResetAuthorized });
            console.log('verified: ', response.data.passResetAuthorized);
          }).catch((error) => {
            console.error(error);
          });
        return null;
      }).catch((error) => {
        console.log('error getting user');
        console.error(error);
      });
  }

  componentWillUnmount() {
    // Security feature, reset all data
    this.setState({
      newPassword: '',
      newPasswordDuplicate: '',
      verified: null,
    });
  }

  sendPasswordReset() {
    if (this.state.newPassword === this.state.newPasswordDuplicate) {
      if (this.state.newPassword.length < 8 || this.state.newPasswordDuplicate.length < 8) {
        this.setState({ errorMessage: 'Your password needs to have more than 8 characters' });
      } else {
        console.log('sending password info to backend');
        this.setState({ errorMessage: null });

        axios.post(`${ROOT_URL}/auth/verify/pass/reset`, { userID: this.state.fetchedUser._id, key: this.props.match.params.key, pass: this.state.newPassword })
          .then((response) => {
            console.log('response', response);
            console.log('resetting password in backend');

            this.props.signinUser({ email: this.state.fetchedUser.email, password: this.state.newPassword }, this.props.history).then(() => {
              console.log('pushing to \'/\'');
              this.props.history.push('/');
            });
          }).catch((error) => {
            console.log('catching error');
            console.error(error);
          });
      }
    } else {
      this.setState({ errorMessage: 'The passwords you entered don\'t match' });
    }
  }

  render() {
    if (this.state.fetchedUser && this.state.verified !== null) {
      if (this.state.verified !== null && this.state.fetchedUser.passwordVerificationKeyTimeout - Date.now() >= 0) { // Verified
        console.log('verified');
        return (
          <div className="reset-pass-email">
            <img alt="logo" className="logo" src={logo} />
            <div className="message-reset-pass">
              Reset your password here
            </div>
            <div className="reset-pass-form">
              <form>
                <div className="row">
                  <input id="new-pass"
                    type="password"
                    value={this.state.newPassword}
                    placeholder="New Password"
                    onChange={(e) => {
                      this.setState({ newPassword: e.target.value });
                    }}
                  />
                </div>
                <div className="row">
                  <input id="new-pass-duplicate"
                    type="password"
                    value={this.state.newPasswordDuplicate}
                    placeholder="New Password"
                    onChange={(e) => {
                      this.setState({ newPasswordDuplicate: e.target.value });
                    }}
                  />
                </div>
              </form>
            </div>
            <div className="error-message-reset-pass">
              {this.state.errorMessage}
            </div>
            <button type="button"
              className="reset-pass-action-button big"
              onClick={() => this.sendPasswordReset()}
            >
              <div className="button-cover"><div className="button-text">Reset Password</div></div>
            </button>
          </div>
        );
      } else { // if (this.state.fetchedUser.passwordVerificationKeyTimeout - Date.now() < 0) { // Key timeout
        console.log('key timeout');
        return (
          <div className="reset-pass-email">
            <img alt="logo" className="logo" src={logo} />
            <div className="message-reset-pass">
              Uh oh, your password reset request timed out
            </div>
            <div className="error-message-reset-pass">
              To request a new password reset link, click below.<br /> If you believe this is an error, please reach out to us at <a href="mailto:info@d-planner.com">info@d-planner.com</a>
            </div>
            <button type="button"
              className="reset-pass-action-button big"
              onClick={() => {
                this.props.fetchUser().then(() => this.props.sendResetPass(this.state.fetchedUser._id));
                this.props.history.push('/');
              }}
            >
              <div className="button-cover"><div className="button-text">Send Again</div></div>
            </button>
          </div>
        );
      }
    } else {
      // ADD LOADING COMPONENT
      console.log('not verified');
      return (
        <div className="reset-pass-email">
          <img alt="logo" className="logo" src={logo} />
          <div className="message-reset-pass">
            Uh oh, we couldn&apos;t reset your password
          </div>
          <div className="error-message-reset-pass">
            This could be because you&apos;ve been sent a more recent verification code, or because of an error on our end.<br /> If you believe this is an error, please reach out to us at <a href="mailto:info@d-planner.com">info@d-planner.com</a> {/* Add standard email address here */}
          </div>
          <button type="button"
            className="reset-pass-action-button"
            onClick={() => {
              this.props.fetchUser().then(() => this.props.sendResetPass(this.state.fetchedUser._id));
              this.props.history.push('/');
            }}
          >
            <div className="button-cover"><div className="button-text">Go Home</div></div>
          </button>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  // user: state.user.current,
  // authenticated: state.auth.authenticated,
});

export default connect(mapStateToProps, {
  updateUser, fetchUser, sendResetPass, signinUser,
})(ResetPass);
