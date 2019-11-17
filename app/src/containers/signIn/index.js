import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signinUser } from '../../actions';

const SignInForm = withRouter(connect(null, { signinUser })((props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [permitted, setPermitted] = useState(false);


  const signin = () => {
    props.signinUser({ email, password }, props.history).then(() => {
      if (props.callback) { props.callback(); }
    }).catch(() => {
      props.checkAuth('Your email and password do not match');
    });
  };

  // const signup = () => {
  //   window.location.href = '/signup';
  // };

  useEffect(() => {
    if (email && password) setPermitted(true);
    else setPermitted(false);
  }, [email, password]);


  return (
    <div className="formContainer">
      <form>
        <div className="greeting">Welcome back.</div>
        <div className="spacer" />
        <div className="row">
          <input id="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="row">
          <input id="password" type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="spacer" />
        <button type="button"
          className="sign-in"
          onClick={() => {
            signin();
          }}
        >
          <div className="button-cover" disabled={!permitted}><div className="button-text">Sign In</div></div>
        </button>
        <div className="spacer" />
        {props.disableSignUp ? null : <button type="button" className="sign-up" onClick={props.switchToSignUp}>Sign Up</button>}
      </form>
    </div>
  );
}));

export default SignInForm;
