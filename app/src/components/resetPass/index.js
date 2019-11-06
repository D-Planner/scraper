import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { ROOT_URL } from '../../constants';
import SignIn from '../../containers/signIn';
import logo from '../../style/logo.svg';
import { updateUser, fetchUser, sendResetPass } from '../../actions';
import './resetPass.scss';

// TODO: Improve security in saving a new user in the frontend with plain text password

class ResetPass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: null,
      newPassword: '', // First field
      newPasswordDuplicate: '', // Check field (for error checking)
      errorMessage: null, // What to tell the user (also determines whether the message field is displayed)
    };

    this.props.fetchUser().then(() => {
      this.newUser = this.props.user;
    }).catch((error) => {
      console.error(error);
    });

    this.sendPasswordReset = this.sendPasswordReset.bind(this);
  }

  // FIX THIS ONE UP
  componentWillMount() {
    this.props.fetchUser().then(() => {
      if (this.props.user.passwordVerificationKey === '-1') {
        console.log('already verified');
        return (this.props.history.push('/'));
      }
      axios.post(`${ROOT_URL}/auth/verify/pass/`, { userID: this.props.user._id, key: this.props.match.params.key }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then((response) => {
        this.setState({ verified: response.data.passResetAuthorized });
        console.log('verified: ', response.data.passResetAuthorized);
        this.props.fetchUser();
      }).catch((error) => {
        console.error(error);
      });
      return null;
    });
  }

  componentDidMount() {
    console.log('URL param:', this.props.match.params.key);
  }

  sendPasswordReset() {
    if (this.state.newPassword === this.state.newPasswordDuplicate) {
      if (this.state.newPassword.length < 8 || this.state.newPasswordDuplicate.length < 8) {
        this.setState({ errorMessage: 'Your password needs to have more than 8 characters!' });
      } else {
        console.log('sending password info to backend');
        this.setState({ errorMessage: null });

        axios.post(`${ROOT_URL}/auth/verify/pass/reset`, { userID: this.props.user._id, key: this.props.match.params.key, pass: this.state.newPassword }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then((response) => {
          console.log('response', response);
          console.log('resetting password in backend');
          this.props.fetchUser().then(() => {
            // Security feature, reset all data
            this.setState({
              newPassword: '',
              newPasswordDuplicate: '',
              verified: null,
            });
            console.log('pushing to \'/\'');
            this.props.history.push('/');
          });
        }).catch((error) => {
          console.log('catching error');
          console.error(error);
        });
      }
    } else {
      this.setState({ errorMessage: 'The passwords you entered don\'t match!' });
    }
  }

  render() {
    if (this.props.authenticated) {
      // if (this.state.verified === undefined) {
      if (this.state.verified !== null && this.props.user.passwordVerificationKeyTimeout - Date.now() >= 0) { // Verified
        return (
          <div className="reset-pass-email">
            <img alt="logo" className="logo" src={logo} />
            <div className="message-reset-pass">
                Reset your password here!
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
      } else if (this.props.user && this.props.user.passwordVerificationKeyTimeout - Date.now() < 0) { // Key timeout
        return (
          <div className="reset-pass-email">
            <img alt="logo" className="logo" src={logo} />
            <div className="message-reset-pass">
                Uh oh, your password reset request timed out!
            </div>
            <div className="error-message-reset-pass">
                To request a new password reset link, click below and we&apos;d be happy to oblige!<br /> If you believe this is an error, please reach out to us at <a href="mailto:info@d-planner.com">info@d-planner.com</a>
            </div>
            <button type="button"
              className="reset-pass-action-button big"
              onClick={() => {
                this.props.fetchUser().then(() => this.props.sendResetPass(this.props.user._id));
                this.props.history.push('/');
              }}
            >
              <div className="button-cover"><div className="button-text">Send Again</div></div>
            </button>
          </div>
        );
      } else { // Not verifed (for whatever reason)
        return (
          <div className="reset-pass-email">
            <img alt="logo" className="logo" src={logo} />
            <div className="message-reset-pass">
              Uh oh, we couldn&apos;t reset your password!
            </div>
            <div className="error-message-reset-pass">
                This could be because you&apos;ve been sent a more recent verification code, or because of an error on our end.<br /> If you believe this is an error, please reach out to us at <a href="mailto:info@d-planner.com">info@d-planner.com</a> {/* Add standard email address here */}
            </div>
            <button type="button"
              className="reset-pass-action-button"
              onClick={() => {
                this.props.fetchUser().then(() => this.props.sendResetPass(this.props.user._id));
                this.props.history.push('/');
              }}
            >
              <div className="button-cover"><div className="button-text">Go Home</div></div>
            </button>
          </div>
        );
      }
      // } else {
      //   return null;
      // // TODO: Add loading component
      // }
    } else { // User not signed in
      return (
        <>
          <div className="reset-pass-email">
            <div className="message-reset-pass">To finish resetting your password, sign in here!</div>
          </div>
          <div className="reset-pass-signin-container">
            <SignIn callback={() => { // Push back to same URL for re-authentication
              this.props.history.push(`/pass/${this.props.match.params.key}`);
            }}
            />
          </div>
        </>
      );
    }
  }
}

const mapStateToProps = state => ({
  user: state.user.current,
  authenticated: state.auth.authenticated,
});

export default connect(mapStateToProps, {
  updateUser, fetchUser, sendResetPass,
})(ResetPass);
