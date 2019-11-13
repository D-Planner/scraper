import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signupUser } from '../../actions';
import './signUp.scss';

const SignUpForm = withRouter(connect(null, { signupUser })((props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [college, setCollege] = useState('');
  const [grad, setGrad] = useState(2023);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [permitted, setPermitted] = useState(false);

  useEffect(() => {
    if (email && grad && password) {
      setPermitted(true);
    } else setPermitted(false);
  }, [email, password, grad]);

  const signup = () => {
    props.signupUser(email, password, firstName, lastName, college, grad, props.history).catch(() => {
      props.checkAuth('That email is already associated to an account');
    });
  };

  // const signin = () => {
  //   window.location.href = '/signin';
  // };

  return (
    <div className="formContainer">

      <form>
        <div className="greeting">Join D-Planner today.</div>
        <div className="spacer" />
        <div className="row">
          <input id="firstName" value={firstName} placeholder="First name" onChange={e => setFirstName(e.target.value)} />
        </div>
        <div className="row">
          <input id="lastName" value={lastName} placeholder="Last name" onChange={e => setLastName(e.target.value)} />
        </div>
        <div className="row">
          <input id="college" value={college} placeholder="College" onChange={e => setCollege(e.target.value)} />
        </div>
        <div className="row">
          <input id="grad" type="number" value={grad} placeholder="2023" onChange={e => setGrad(e.target.value)} />
        </div>
        <div className="row">
          <input id="email" type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="row">
          <input id="password" type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="spacer" />
        <button type="button" disabled={!permitted} className="sign-up" onClick={signup}>Sign Up</button>
        <div className="spacer" />
        <button type="button" className="sign-in" onClick={props.switchToSignIn}>
          <div className="button-cover" disabled={!permitted}><div className="button-text">Sign In</div></div>
        </button>
      </form>
    </div>
  );
}));

export default SignUpForm;
