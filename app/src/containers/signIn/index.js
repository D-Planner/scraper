import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signinUser, validateAccessCode } from '../../actions';
import { emailCheckRegex } from '../../constants';
import ErrorMessageSpacer from '../../components/errorMessageSpacer';
import DefaultButton from '../../components/defaultButton';
import { advancedTesterFormLink } from '../signUp';

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
      setErrorMessage(null);
      props.signinUser({ email, password }, props.history).catch((error) => {
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
    if (accessCode === '') {
      setErrorMessage('Please fill all required fields! (*)');
    } else {
      setErrorMessage(null);
      props.validateAccessCode(accessCode, props.history).then(() => {
        props.history.push('/tutorial/0');
      }).catch((error) => {
        setErrorMessage(error.response.data);
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      signin();
    }
  };

  // if (signedIn) {
  //   return (
  //     <div className="formContainer">
  //       {props.removeTitle === true ? null : <div className="greeting">Join D-Planner today.</div>}
  //       <div className="spacer">Thank you for signing up! You have been placed on the waitlist for early access, and we will notify you when we go live.</div>
  //       <div className="spacer"> If you are a D-Planner advanced tester and have been given an access code, please enter it in the form below.</div>
  //       <div className="spacer"> If you would like to apply to become a D-Planner advanced tester, <a href={advancedTesterFormLink}>follow this link.</a></div>
  //       <div className="row" />
  //       <div className="row">
  //         <input className="landing-input" id="firstName" value={accessCode} placeholder="Access code" onKeyPress={e => (e.key === 'Enter' ? sendAccessCode() : null)} onChange={e => setAccessCode(e.target.value)} />
  //       </div>
  //       <ErrorMessageSpacer errorMessage={errorMessage} />
  //       <DefaultButton click={sendAccessCode} label="Submit" />
  //       <div className="spacer" />
  //       {/* <button type="button" className="sign-in" onClick={props.switchToSignUp}>
  //         <div className="button-cover"><div className="button-text">Sign Up</div></div>
  //       </button> */}
  //       <div role="button" tabIndex={-1} className="switch-text" onClick={props.switchToSignUp}>Need an account? Sign up</div>
  //     </div>
  //   );
  // } else {
  return (
    <div className="formContainer">
      <form>
        {props.removeTitle === true ? null : <div className="greeting">Welcome back.</div>}
        <div className="row">
          <input className="landing-input" id="email" type="email" value={email} placeholder="Email*" onKeyPress={e => handleKeyPress(e)} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="row">
          <input className="landing-input" id="password" type="password" value={password} placeholder="Password*" onKeyPress={e => handleKeyPress(e)} onChange={e => setPassword(e.target.value)} required />
        </div>
        <ErrorMessageSpacer errorMessage={errorMessage} />
        <button type="button" className="sign-up" onClick={signin}>
          <div className="button-cover"><div className="button-text">Sign In</div></div>
        </button>
        <div className="spacer" />
        {/* {props.showSignUp ? <DefaultButton click={props.switchToSignUp} label="Sign Up" /> : null} */}
        <div role="button" tabIndex={-1} className="switch-text" onClick={props.switchToSignUp}>Need an account? Sign up</div>
        <a className="switch-text" href="/reset/pass">Forgot password?</a>
      </form>
    </div>
  );
  // }
}));

export default SignInForm;
