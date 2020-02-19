import React, { Component } from 'react';
import axios from 'axios';
import { HotKeys } from 'react-hotkeys';
import { ROOT_URL, errorLogging } from '../../constants';
import LoadingWheel from '../loadingWheel';
import logo from '../../style/logo.svg';
import './forgotPassword.scss';

const loggingErrorsInForgotPassword = (message) => {
  errorLogging('app/src/components/forgotPassword.js', message);
};

class ForgotPassword extends Component {
  keyMap = {
    OK: 'Enter',
    CLOSE: 'Escape',
  };

  handlers = {
    OK: () => this.onOk(),
    CLOSE: () => this.props.history.push('/'),
  };

  constructor(props) {
    super(props);
    this.state = {
      enteredEmail: '',
      loading: false,
    };

    this.onOk = this.onOk.bind(this);
  }

  onOk() {
    if (this.state.sentEmail) {
      this.props.history.push('/');
    } else {
      this.sendPasswordReset();
    }
  }

  sendPasswordReset() {
    this.setState({ errorMessage: null });
    axios.post(`${ROOT_URL}/auth/verify/pass/byemail`, { email: this.state.enteredEmail })
      .then((response) => {
        if (response.data.info.accepted[0] === this.state.enteredEmail) {
          this.setState({ message: 'A password reset link has been sent to the specified email', sentEmail: response.data.sentEmail, loading: false });
        } else {
          this.setState({ errorMessage: 'Could not find an account associated with that email address', loading: false });
        }
      }).catch((error) => {
        loggingErrorsInForgotPassword(error);
      });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.setState({ loading: true });
      e.preventDefault();
      e.stopPropagation();
      try {
        this.onOk();
      } catch (error) {
        loggingErrorsInForgotPassword(error);
      }
    } else if (e.key === 'Escape') {
      this.props.history.push('/');
    }
  }

  render() {
    return (
      <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
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
                  onKeyDown={(e) => {
                    this.handleKeyDown(e);
                  }}
                />
              </div>
            </form>
          </div>
          <div className={`error-message-reset-pass${this.state.message ? ' generic' : ''}`}>
            {this.state.errorMessage}
            {this.state.errorMessage ? null : this.state.message}
            {this.state.loading ? <LoadingWheel /> : null}
          </div>
          <button type="button"
            className="reset-pass-action-button big"
            onClick={() => {
              this.onOk();
            }}
          >
            <div className="button-cover"><div className="button-text">{this.state.sentEmail ? 'Go Home' : 'Reset Password'}</div></div>
          </button>
        </div>
      </HotKeys>
    );
  }
}

export default ForgotPassword;
