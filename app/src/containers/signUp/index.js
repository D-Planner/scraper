import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signupUser } from '../../actions';
import { ROOT_URL } from '../../constants';
import ErrorMessageSpacer from '../../components/errorMessageSpacer';
import LoadingWheel from '../../components/loadingWheel';
import './signUp.scss';

const SignUpForm = withRouter(connect(null, { signupUser })((props) => {
  const [NetID, setNetID] = useState('');
  const [password, setPassword] = useState('');
  const [grad, setGrad] = useState(2023);

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const signup = () => {
    if (grad === '' || password === '' || NetID === '') {
      setErrorMessage('Please fill all required fields! (*)');
    } else {
      setLoading(true);
      setErrorMessage(null);
      props.signupUser(NetID, password, grad, props.history)
        .then(() => {
          setLoading(false);
          // console.log('pushing to new address');
          // props.history.push(`${ROOT_URL}/auth/cas`);
        }).catch((error) => {
          setLoading(false);
          setErrorMessage(error);
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
          <input id="netid" value={NetID} placeholder="NetID*" onKeyPress={e => handleKeyPress(e)} onChange={e => setNetID(e.target.value)} />
        </div>
        <div className="row">
          <input id="password" type="password" value={password} placeholder="Password*" onKeyPress={e => handleKeyPress(e)} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="row">
          <input id="grad" type="number" value={grad} placeholder="Graduation Year*" onKeyPress={e => handleKeyPress(e)} onChange={e => setGrad(e.target.value)} />
        </div>

        <LoadingWheel loading={loading} />
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
