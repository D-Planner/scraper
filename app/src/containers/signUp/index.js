import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signupUser } from '../../actions';
import { ROOT_URL, emailCheckRegex } from '../../constants';
import ErrorMessageSpacer from '../../components/errorMessageSpacer';
import './signUp.scss';

const SignUpForm = withRouter(connect(null, { signupUser })((props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [college, setCollege] = useState('');
  const [grad, setGrad] = useState(2023);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const [netID, setnetID] = useState('');

  const signup = () => {
    // if (email === '' || grad === '' || password === '' || college === '') {
    if (grad === '' || password === '' || netID === '') {
      setErrorMessage('Please fill all required fields! (*)');
    // } else if (!emailCheckRegex.test(email)) {
    //   setErrorMessage('Invalid email address');
    } else {
      props.signupUser(email, password, firstName, lastName, college, grad, props.history)
        .then(() => {
          // console.log('pushing to new address');
          // props.history.push(`${ROOT_URL}/auth/cas`);
        }).catch((error) => {
          console.log(error);
          setErrorMessage(error.response.data);
        });

      // console.log('signup');
      // props.signupUser(email, password, firstName, lastName, college, grad, props.history)
      //   .then(() => {
      //     console.log('pushing to new address');
      //     props.history.push(`${ROOT_URL}/auth/cas`);
      //   })
      //   .catch(() => {
      //     props.checkAuth('That email is already associated to an account');
      //   });
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
        {/* <div className="row">
          <input id="firstName" value={firstName} placeholder="First name" onKeyPress={e => handleKeyPress(e)} onChange={e => setFirstName(e.target.value)} />
        </div>
        <div className="row">
          <input id="lastName" value={lastName} placeholder="Last name" onKeyPress={e => handleKeyPress(e)} onChange={e => setLastName(e.target.value)} />
        </div> */}
        {/* <div className="row">
          <input id="college" value={college} placeholder="College*" onKeyPress={e => handleKeyPress(e)} onChange={e => setCollege(e.target.value)} />
        </div> */}

        <div className="row">
          <input id="netid" value={netID} placeholder="NetID*" onKeyPress={e => handleKeyPress(e)} onChange={e => setnetID(e.target.value)} />
        </div>
        {/* <div className="row">
          <input id="email" type="email" value={email} placeholder="Email*" onKeyPress={e => handleKeyPress(e)} onChange={e => setEmail(e.target.value)} />
        </div> */}
        <div className="row">
          <input id="password" type="password" value={password} placeholder="Password*" onKeyPress={e => handleKeyPress(e)} onChange={e => setPassword(e.target.value)} />
        </div>

        <div className="row">
          <input id="grad" type="number" value={grad} placeholder="Graduation Year*" onKeyPress={e => handleKeyPress(e)} onChange={e => setGrad(e.target.value)} />
        </div>
        <div className="spacer" />

        {/* <button type="button" className="sign-up" onClick={() => signup()}>
          <div className="button-cover" disabled={!permitted}><div className="button-text">Sign Up</div></div>
        </button> */}

        {/* <button type="button" className="sign-up" onClick={() => { document.location.href = 'http://localhost:9090/auth/cas'; }}>
          <div className="button-cover"><div className="button-text">Use Duo</div></div>
        </button> */}

        {/* <button type="button" disabled={!permitted} className="sign-up" onClick={signup}>Sign Up</button> */}
        {/* <div className="spacer">{errorMessage}</div> */}
        <ErrorMessageSpacer errorMessage={errorMessage} />
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
