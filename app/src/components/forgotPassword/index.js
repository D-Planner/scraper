import React, { Component } from 'react';
import axios from 'axios';
import { ROOT_URL } from '../../constants';
import logo from '../../style/logo.svg';
import './forgotPassword.scss';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enteredEmail: '',
    };
  }

  sendPasswordReset() {
    console.log('sending password info to backend');
    this.setState({ errorMessage: null });

    axios.post(`${ROOT_URL}/auth/verify/pass/byemail`, { email: this.state.enteredEmail })
      .then((response) => {
        console.log('response', response.data.info.accepted[0]);
        if (response.data.info.accepted[0] === this.state.enteredEmail) {
          this.setState({ message: 'A password reset link has been sent to the specified email', sentEmail: response.data.sentEmail });
        } else {
          this.setState({ errorMessage: 'Could not find an account associated with that email address' });
        }
      }).catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <div className="reset-pass-email">
        <img alt="logo" className="logo" src={logo} />
        <div className="message-reset-pass">
          Enter your account email address
        </div>
        <div className="reset-pass-form">
          <form>
            <div className="row">
              <input
                type="email"
                value={this.state.enteredEmail}
                placeholder="Enter your email"
                onChange={(e) => {
                  this.setState({ enteredEmail: e.target.value });
                }}
              />
            </div>
          </form>
        </div>
        <div className={`error-message-reset-pass${this.state.message ? ' generic' : ''}`}>
          {this.state.errorMessage}
          {this.state.errorMessage ? null : this.state.message}
        </div>
        <button type="button"
          className="reset-pass-action-button big"
          onClick={() => {
            if (this.state.sentEmail) {
              this.props.history.push('/');
            } else {
              this.sendPasswordReset();
            }
          }
            }
        >
          <div className="button-cover"><div className="button-text">{this.state.sentEmail ? 'Go Home' : 'Reset Password'}</div></div>
        </button>
      </div>
    );
  }
}

export default ForgotPassword;
