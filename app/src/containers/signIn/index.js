import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signinUser } from '../../actions';

const SignInForm = withRouter(connect(null, { signinUser })((props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [permitted, setPermitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);


  const signin = () => {
    if (email === '' || password === '') {
      setErrorMessage('Please fill all required fields! (*)');
    } else {
      props.signinUser({ email, password }, props.history).catch(() => {
        props.checkAuth('Your email and password do not match');
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      signin();
    }
  };

  // const signup = () => {
  //   window.location.href = '/signup';
  // };

  useEffect(() => {
    if (email && password) {
      setErrorMessage(null);
      setPermitted(true);
    } else {
      setPermitted(false);
    }
  }, [email, password]);


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
        <div className="spacer">{errorMessage}</div>
        <button type="button" className="sign-in" onClick={signin}>
          <div className="button-cover" disabled={!permitted}><div className="button-text">Sign In</div></div>
        </button>
        <div className="spacer" />
        <button type="button" className="sign-up" onClick={props.switchToSignUp}>Sign Up</button>
      </form>
    </div>
  );
}));

export default SignInForm;
