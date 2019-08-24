import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signinUser } from '../../actions';

export const SignInForm = withRouter(connect(null, { signinUser })((props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [permitted, setPermitted] = useState(false);


  const signin = () => {
    props.signinUser({ email, password }, props.history);
  };

  const signup = () => {
    window.location.href = '/signup';
  };

  useEffect(() => {
    if (email && password) setPermitted(true);
    else setPermitted(false);
  }, [email, password]);


  return (
    <div className="formContainer">
      <form>
        <div className="row">
          <input id="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="row">
          <input id="password" type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="spacer" />
        <button type="button" disabled={!permitted} className="sign-up" onClick={signin}>Sign In</button>
        <button type="button" className="sign-in" onClick={signup}>Sign Up</button>
      </form>
    </div>
  );
}));

const SignIn = () => {
  return (
    <div className="container">
      <div className="signInContainer">
        <div className="title">
        Welcome Back.
        </div>
        <SignInForm />
      </div>
    </div>
  );
};

export default SignIn;
