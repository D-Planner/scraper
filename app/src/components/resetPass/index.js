import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import SignIn from '../../containers/signIn';
import logo from '../../style/logo.svg';
// import ResetPassForm from './resetPassForm';
import './resetPass.scss';

class ResetPass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: true, // REMOVE THIS, verified should be set by backend calls
      newPassword: '',
      newPasswordDuplicate: '',
      errorMessage: null,
    };
  }

  render() {
    if (this.props.authenticated) {
      if (this.state.verified !== undefined) {
        if (this.state.verified) { // Verified
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
                onClick={() => {
                  if (this.state.newPassword === this.state.newPasswordDuplicate) {
                    console.log('passwords match!');
                    // TODO: save new password
                    if (this.state.newPassword.length < 8 || this.state.newPasswordDuplicate.length < 8) {
                      this.setState({ errorMessage: 'Your password needs to have more than 8 characters!' });
                    } else {
                      this.setState({ errorMessage: null });
                    }
                  } else {
                    console.log('passwords do not match');
                    // TODO: throw error message
                    this.setState({ errorMessage: 'The passwords you entered don\'t match!' });
                  }
                  // this.props.history.push('/');
                }}
              >
                <div className="button-cover"><div className="button-text">Reset Password</div></div>
              </button>
            </div>
          );
        } else if (this.props.user && this.props.user.verificationKeyTimeout - Date.now() < 0) { // Key timeout
          return (
            <div className="reset-pass-email">
              <img alt="logo" className="logo" src={logo} />
              <div className="message-reset-pass">
                Uh oh, your password reset request timed out!
              </div>
              <div className="error-message-reset-pass">
                To request a new password reset link, click below and we&apos;d be happy to oblige!<br /> If you believe this is an error, please reach out to us at <a href="mailto:info@d-planner.com">info@d-planner.com</a>
              </div>
              <button type="button" className="reset-pass-action-button big" onClick={() => this.props.history.push('/')}>
                <div className="button-cover"><div className="button-text">Send Again</div></div>
              </button>
            </div>
          );
        } else { // Not verifed (for whatever reason)
          return (
            <div className="reset-pass">
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
                  this.props.fetchUser().then(() => this.props.verifyEmail(this.props.user._id));
                  this.props.history.push('/');
                }}
              >
                <div className="button-cover"><div className="button-text">Go Home</div></div>
              </button>
            </div>
          );
        }
      } else {
        return null;
      // TODO: Add loading component
      }
    } else { // User not signed in
      return (
        <>
          <div className="reset-pass">
            <div className="message-reset-pass">To finish resetting your password, sign in here!</div>
          </div>
          <div className="reset-pass-signin-container">
            <SignIn callback={() => { // Push back to same URL for re-authentication
              this.props.history.push(`/email/${this.props.match.params.key}`);
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

export default connect(mapStateToProps, {})(ResetPass);
