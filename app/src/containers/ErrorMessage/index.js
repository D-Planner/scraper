import React from 'react';
import './errorMessage.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearError } from '../../actions';

const ErrorMessage = (props) => {
  return (
    <div id="error-message">
      <div id="error-box">
        <h1>Oh no!</h1>
        <p>{props.errorMessage}</p>
        <button type="button" onClick={props.clearError}>Got it!</button>
      </div>
    </div>
  );
};

const mapStateToProps = state => (
  {
    errorMessage: state.plans.errorMessage,
  }
);

export default withRouter(connect(mapStateToProps, { clearError })(ErrorMessage));
