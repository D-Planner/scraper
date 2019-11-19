import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signinUser } from '../../actions';
import { emailCheckRegex } from '../../constants';
import ErrorMessageSpacer from '../../components/errorMessageSpacer';

const SignInForm = withRouter(connect(null, { signinUser })((props) => {
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const [NetID, setNetID] = useState('');

  const signin = () => {
    // if (email === '' || password === '') {
    if (NetID === '' || password === '') {
      setErrorMessage('Please fill all required fields! (*)');
    // } else if (!emailCheckRegex.test(email)) {
    //   setErrorMessage('Invalid email address');
    } else {
      // props.signinUser({ email, password }, props.history).catch((error) => {
      props.signinUser(NetID, password, props.history).catch((error) => {
        if (error.response.data === 'Unauthorized') {
          setErrorMessage('Email and password combination not recognized');
        } else {
          setErrorMessage(error.response.data);
        }
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      signin();
    }
  };

  return (
    <div className="formContainer">
      <form>
        <div className="greeting">Welcome back.</div>
        <div className="spacer" />
        {/* <div className="row">
          <input id="email" type="email" value={email} placeholder="Email*" onKeyPress={e => handleKeyPress(e)} onChange={e => setEmail(e.target.value)} required />
        </div> */}
        <div className="row">
          <input id="NetID" value={NetID} placeholder="NetID*" onKeyPress={e => handleKeyPress(e)} onChange={e => setNetID(e.target.value)} required />
        </div>
        <div className="row">
          <input id="password" type="password" value={password} placeholder="Password*" onKeyPress={e => handleKeyPress(e)} onChange={e => setPassword(e.target.value)} required />
        </div>
        <ErrorMessageSpacer errorMessage={errorMessage} />
        <button type="button" className="sign-in" onClick={signin}>
          <div className="button-cover"><div className="button-text">Sign In</div></div>
        </button>
        <div className="spacer" />
        {props.showSignUp ? <button type="button" className="sign-up" onClick={props.switchToSignUp}>Sign Up</button> : null}
      </form>
    </div>
  );
}));

export default SignInForm;
