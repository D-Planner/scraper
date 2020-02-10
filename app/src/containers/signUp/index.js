import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signupUser, validateAccessCode, checkUserByEmail } from '../../actions';
import { emailCheckRegex } from '../../constants';
import ErrorMessageSpacer from '../../components/errorMessageSpacer';
import DefaultButton from '../../components/defaultButton';
import './signUp.scss';

export const advancedTesterFormLink = 'https://docs.google.com/forms/d/e/1FAIpQLScsxerUDg1GczR0m0uc6TD3Df6m59bK40N9IUF2cJjmjknyKQ/viewform?usp=sf_link';

const SignUpForm = withRouter(connect(null, { signupUser, validateAccessCode, checkUserByEmail })((props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [college, setCollege] = useState('');
  const [grad, setGrad] = useState(2023);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [accessCode, setAccessCode] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  const signup = () => {
    if (email === '' || grad === '' || password === '' || college === '') {
      setErrorMessage('Please fill all required fields! (*)');
    } else if (!emailCheckRegex.test(email)) {
      setErrorMessage('Invalid email address');
    } else {
      setErrorMessage(null);
      props.signupUser(email, password, firstName, lastName, college, grad, props.history).then(() => {
        setSignedIn(true);
      }).catch((error) => {
        setErrorMessage(error.response.data);
      });
    }
  };

  // const sendAccessCode = () => {
  //   console.log('props', props);
  //   if (accessCode === '') {
  //     setErrorMessage('Please fill all required fields! (*)');
  //   } else {
  //     setErrorMessage(null);
  //     props.validateAccessCode(accessCode, props.history).then(() => {
  //       console.log('pushing to tutorial');
  //       props.history.push('/tutorial/0');
  //     }).catch((error) => {
  //       setErrorMessage(error.response.data);
  //     });
  //   }
  // };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      signup();
    }
  };

  // if (signedIn) {
  //   return (
  //     <div className="formContainer">
  //       <div className="greeting">Join D-Planner today.</div>
  //       <div className="spacer">Thank you for signing up! You have been placed on the waitlist for early access, and we will notify you when we go live.</div>
  //       <div className="spacer"> If you are a D-Planner advanced tester and have been given an access code, please enter it in the form below.</div>
  //       <div className="spacer"> If you would like to apply to become a D-Planner advanced tester, <a href={advancedTesterFormLink}>follow this link.</a></div>
  //       <div className="row" />
  //       <div className="row">
  //         <input id="firstName" value={accessCode} placeholder="Access code" onKeyPress={e => (e.key === 'Enter' ? sendAccessCode() : null)} onChange={e => setAccessCode(e.target.value)} />
  //       </div>
  //       <ErrorMessageSpacer errorMessage={errorMessage} />
  //       <DefaultButton click={sendAccessCode} label="Submit" />
  //       <div className="spacer" />
  //       <button type="button" className="sign-in" onClick={props.switchToSignIn}>
  //         <div className="button-cover"><div className="button-text">Sign In</div></div>
  //       </button>
  //     </div>
  //   );
  // } else {
  return (
    <div className="formContainer">
      <form>
        {props.removeTitle === true ? null : <div className="greeting">Join D-Planner today.</div>}
        {/* <div className="spacer">We are in pre-release, sign up below and you will be the first to know when we go live!</div> */}
        <div className="row">
          <input id="firstName" value={firstName} placeholder="First name" onKeyPress={e => handleKeyPress(e)} onChange={e => setFirstName(e.target.value)} />
        </div>
        <div className="row">
          <input id="lastName" value={lastName} placeholder="Last name" onKeyPress={e => handleKeyPress(e)} onChange={e => setLastName(e.target.value)} />
        </div>
        <div className="row">
          <input id="college" value={college} placeholder="College*" onKeyPress={e => handleKeyPress(e)} onChange={e => setCollege(e.target.value)} />
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
        <ErrorMessageSpacer errorMessage={errorMessage} />
        <DefaultButton click={signup} label="Sign Up" />
        <div className="spacer" />
        <div role="button" tabIndex={-1} className="switch-text" onClick={props.switchToSignIn}>Returning? Sign in</div>
        {/* <button type="button" className="sign-in" onClick={props.switchToSignIn}>
            <div className="button-cover"><div className="button-text">Sign In</div></div>
          </button> */}
      </form>
    </div>
  );
  // }
}));

export default SignUpForm;
