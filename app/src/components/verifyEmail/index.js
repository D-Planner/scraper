import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { sendVerifyEmail, fetchUser } from '../../actions';
import { ROOT_URL } from '../../constants';
import logo from '../../style/logo.svg';
import SignIn from '../../containers/signIn';
import './verifyEmail.scss';

class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount() {
    this.props.fetchUser().then(() => {
      if (this.props.user.emailVerified) {
        return (this.props.history.push('/'));
      }
      axios.post(`${ROOT_URL}/auth/verify/email/`, { userID: this.props.user._id, key: this.props.match.params.key }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then((response) => {
        this.props.fetchUser().then(() => {
          this.setState({ verified: response.data.emailVerified });
        });
      }).catch((error) => {
        console.error(error);
      });
      return null;
    });
  }

  render() {
    if (this.props.authenticated) {
      if (this.state.verified) { // Verified
        return (
          <div className="verify-email">
            <img alt="logo" className="logo" src={logo} />
            <div className="message-verify">
                Your email has been verified!
            </div>
            <button type="button" className="verify-action-button" onClick={() => this.props.history.push('/')}>
              <div className="button-cover"><div className="button-text">Go Home</div></div>
            </button>
          </div>
        );
      } else if (this.props.user && this.props.user.emailVerificationKeyTimeout - Date.now() < 0) { // Key timeout
        return (
          <div className="verify-email">
            <img alt="logo" className="logo" src={logo} />
            <div className="message-verify">
                Uh oh, your email request timed out!
            </div>
            <div className="error-message-verify">
                To request a new email verification link, click below and we&apos;d be happy to oblige!<br /> If you believe this is an error, please reach out to us at <a href="mailto:info@d-planner.com">info@d-planner.com</a>
            </div>
            <button type="button"
              className="verify-action-button big"
              onClick={() => {
                this.props.fetchUser().then(() => this.props.sendVerifyEmail(this.props.user._id));
                this.props.history.push('/');
              }}
            >
              <div className="button-cover"><div className="button-text">Send Again</div></div>
            </button>
          </div>
        );
      } else { // Not verifed (for whatever reason)
        return (
          <div className="verify-email">
            <img alt="logo" className="logo" src={logo} />
            <div className="message-verify">
              Uh oh, we couldn&apos;t verify your email!
            </div>
            <div className="error-message-verify">
                This could be because you&apos;ve been sent a more recent verification code, or because of an error on our end.<br /> If you believe this is an error, please reach out to us at <a href="mailto:info@d-planner.com">info@d-planner.com</a> {/* Add standard email address here */}
            </div>
            <button type="button"
              className="verify-action-button"
              onClick={() => {
                this.props.fetchUser().then(() => this.props.sendVerifyEmail(this.props.user._id));
                this.props.history.push('/');
              }}
            >
              <div className="button-cover"><div className="button-text">Go Home</div></div>
            </button>
          </div>
        );
      }
    } else { // User not signed in
      return (
        <>
          <div className="verify-email">
            <div className="message-verify">To finish verifying your email, sign in here!</div>
          </div>
          <div className="verify-signin-container">
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

export default connect(mapStateToProps, {
  sendVerifyEmail, fetchUser,
})(VerifyEmail);
