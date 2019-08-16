import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signupUser } from '../../actions';
import './signUp.scss';

export const SignUpForm = withRouter(connect(null, { signupUser })((props) => {
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
    props.signupUser(email, password, firstName, lastName, college, grad, props.history);
  };

  const signin = () => {
    window.location.href = '/signin';
  };

  return (
    <div className="formContainer">
      <form>
        <div className="row">
          <input id="firstName" value={firstName} placeholder="First Name" onChange={e => setFirstName(e.target.value)} />
          <input id="lastName" value={lastName} placeholder="Last Name" onChange={e => setLastName(e.target.value)} />
        </div>
        <div className="row">
          <input id="college" value={college} placeholder="College / University" onChange={e => setCollege(e.target.value)} />
          <input id="grad" type="number" value={grad} placeholder="2023" onChange={e => setGrad(e.target.value)} />
        </div>
        <div className="spacer" />
        <div className="row">
          <input id="email" value={email} placeholder="College Email" onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="row">
          <input id="password" type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="spacer" />
        <button type="button" disabled={!permitted} className="sign-up" onClick={signup}>Sign Up</button>
        <button type="button" className="sign-in" onClick={signin}>Have an account? Sign in</button>
      </form>
    </div>
  );
}));

const SignUp = (props) => {
  return (
    <div className="container">
      <div className="signInContainer">
        <div className="title">
          Create Your Account.
        </div>
        <SignUpForm />
      </div>
    </div>

  );
};

export default SignUp;
