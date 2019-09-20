import React from 'react';
import './errorMessage.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearError } from '../../actions';
import GotIt from '../../../assets/buttons/got-it.png';

const errorMessageText = 'We seem to have ancountered an error on our end! If this is not the first time you&#39;ve seen this error, please report it to us and we&#39;ll do our best to fix it!';

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
          <div className="title">Oh no!</div>
          {this.ifMessageNotNull()}
          {/* <div className="message">{errorMessageText}</div> */}
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
