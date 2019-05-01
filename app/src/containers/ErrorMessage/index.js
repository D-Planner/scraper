import React from 'react';
import './errorMessage.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearError } from '../../actions';
import GotIt from '../../../assets/buttons/got-it.png';

class ErrorMessage extends React.Component {
  ifMessageNotNull = () => {
    if (this.props.errorMessage.message !== null) {
      return (
        <p>{this.props.errorMessage.message}</p>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <div id="error-message">
        <div id="error-box">
          <h1>Oh no!</h1>
          {this.ifMessageNotNull()}
          <div id="button-container">
            <img src={GotIt} alt="Dismiss Error" onClick={this.props.clearError} />
          </div>
          {/* <button type="button" onClick={this.props.clearError}>Got it!</button> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    errorMessage: state.plans.errorMessage,
  }
);

export default withRouter(connect(mapStateToProps, { clearError })(ErrorMessage));
