import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signupUser } from '../../actions';
import { emailCheckRegex } from '../../constants';
import './signUp.scss';

const SignUpForm = withRouter(connect(null, { signupUser })((props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [college, setCollege] = useState('');
  const [grad, setGrad] = useState(2023);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const signup = () => {
    if (email === '' || grad === '' || password === '') {
      setErrorMessage('Please fill all required fields! (*)');
    } else if (!emailCheckRegex.test(email)) {
      setErrorMessage('Invalid email address');
    } else {
      props.signupUser(email, password, firstName, lastName, college, grad, props.history).catch((error) => {
        setErrorMessage(error.response.data);
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      signup();
    }
  };

  return (
    <div className="formContainer">
      <form>
        <div className="greeting">Join D-Planner today.</div>
        <div className="spacer" />
        <div className="row">
          <input id="firstName" value={firstName} placeholder="First name*" onKeyPress={e => handleKeyPress(e)} onChange={e => setFirstName(e.target.value)} />
        </div>
        <div className="row">
          <input id="lastName" value={lastName} placeholder="Last name" onKeyPress={e => handleKeyPress(e)} onChange={e => setLastName(e.target.value)} />
        </div>
        <div className="row">
          <input id="college" value={college} placeholder="College" onKeyPress={e => handleKeyPress(e)} onChange={e => setCollege(e.target.value)} />
        </div>
        <div className="row">
          <input id="grad" type="number" value={grad} placeholder="2023*" onKeyPress={e => handleKeyPress(e)} onChange={e => setGrad(e.target.value)} />
        </div>
        <div className="row">
          <input id="email" type="email" value={email} placeholder="Email*" onKeyPress={e => handleKeyPress(e)} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="row">
          <input id="password" type="password" value={password} placeholder="Password*" onKeyPress={e => handleKeyPress(e)} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="spacer">{errorMessage}</div>
        <button type="button" className="sign-up" onClick={signup}>Sign Up</button>
        <div className="spacer" />
        <button type="button" className="sign-in" onClick={props.switchToSignIn}>
          <div className="button-cover"><div className="button-text">Sign In</div></div>
        </button>
      </form>
    </div>
  );
}));

export default SignUpForm;
