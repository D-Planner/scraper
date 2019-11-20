import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signinUser, validateAccessCode } from '../../actions';
import { emailCheckRegex } from '../../constants';
import ErrorMessageSpacer from '../../components/errorMessageSpacer';

const SignInForm = withRouter(connect(null, { signinUser, validateAccessCode })((props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [accessCode, setAccessCode] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  const signin = () => {
    if (email === '' || password === '') {
      setErrorMessage('Please fill all required fields! (*)');
    } else if (!emailCheckRegex.test(email)) {
      setErrorMessage('Invalid email address');
    } else {
      props.signinUser({ email, password }, props.history).catch((error) => {
        console.log(error.response.data);
        if (error.response.data === 'Unauthorized') {
          setErrorMessage('Email and password combination not recognized');
        } else if (error.response.status === 403) {
          setSignedIn(true);
        } else {
          setErrorMessage(error.response.data);
        }
      });
    }
  };

  const sendAccessCode = () => {
    console.log('sending code');
    if (accessCode === '') {
      setErrorMessage('Please fill all required fields! (*)');
    } else {
      props.validateAccessCode(accessCode, props.history).catch((error) => {
        setErrorMessage(error.response.data);
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      signin();
    }
  };

  if (signedIn) {
    return (
      <div className="formContainer">
        <div className="greeting">Join D-Planner today.</div>
        <div className="spacer" />
        <div className="row" />
        <div className="row">
          <input id="firstName" value={accessCode} placeholder="Access code" onKeyPress={e => (e.key === 'Enter' ? sendAccessCode() : null)} onChange={e => setAccessCode(e.target.value)} />
        </div>
        <ErrorMessageSpacer errorMessage={errorMessage} />
        <button type="button" className="sign-up" onClick={sendAccessCode}>
          <div className="button-cover"><div className="button-text">Submit</div></div>
        </button>
        <div className="spacer" />
        <button type="button" className="sign-in" onClick={props.switchToSignUp}>
          <div className="button-cover"><div className="button-text">Sign Up</div></div>
        </button>
      </div>
    );
  } else {
    return (
      <div className="formContainer">
        <form>
          <div className="greeting">Welcome back.</div>
          <div className="spacer" />
          <div className="row">
            <input id="email" type="email" value={email} placeholder="Email*" onKeyPress={e => handleKeyPress(e)} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="row">
            <input id="password" type="password" value={password} placeholder="Password*" onKeyPress={e => handleKeyPress(e)} onChange={e => setPassword(e.target.value)} required />
          </div>
          <a className="homepage-pass-reset" href="/reset/pass">Forgot password?</a>
          <ErrorMessageSpacer errorMessage={errorMessage} />
          <button type="button" className="sign-in" onClick={signin}>
            <div className="button-cover"><div className="button-text">Sign In</div></div>
          </button>
          <div className="spacer" />
          {props.showSignUp ? <button type="button" className="sign-up" onClick={props.switchToSignUp}>Sign Up</button> : null}
        </form>
      </div>
    );
  }
}));

export default SignInForm;
