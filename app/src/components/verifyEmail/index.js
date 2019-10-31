import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { verifyEmail, fetchUser } from '../../actions';
import { ROOT_URL } from '../../constants';
import logo from '../../style/logo.svg';
import './verifyEmail.scss';

class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount() {
    this.props.fetchUser().then(() => {
      console.log(this.props);
      if (this.props.user.verificationKey === '-1' || this.props.user.emailVerified) {
        console.log('alreacy verified');
        return (this.props.history.push('/'));
      }
      axios.post(`${ROOT_URL}/auth/verify/email/`, { userID: this.props.user._id, key: this.props.match.params.key }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then((response) => {
        this.setState({ verified: response.data.emailVerified });
      }).catch((error) => {
        console.error(error);
      });
      return null;
    });
  }

  render() {
    if (this.state.verified !== undefined) {
      if (this.state.verified) {
        return (
          <div className="verify-email">
            <img alt="logo" className="logo" src={logo} />
            <div className="message-verify">
              Your email has been verified!
            </div>
            <button type="button" className="verify-action-button" onClick={() => this.props.history.push('/')}>
              <div className="button-cover"><div className="button-text">Go Home</div></div>
            </button>
          </div>
        );
      } else {
        return (
          <div className="verify-email">
            <img alt="logo" className="logo" src={logo} />
            <div className="message-verify">
              Uh oh, we couldn&apos;t verify your email!
            </div>
            <div className="error-message-verify">
              {`If you believe this is an error, please reach out to us at ${'info@d-planner.com'}`} {/* Add standard email address here */}
            </div>
            <button type="button" className="verify-action-button" onClick={() => this.props.history.push('/')}>
              <div className="button-cover"><div className="button-text">Go Home</div></div>
            </button>
          </div>
        );
      }
    } else {
      // return <div className="verify-email-loading">{`Verifying user '${this.props.user._id}' with verification key '${this.props.match.params.key}'...`}</div>;
      return null;
      // TODO: Add loading component
    }
  }
}

const mapStateToProps = state => ({
  user: state.user.current,
});

export default connect(mapStateToProps, {
  verifyEmail, fetchUser,
})(VerifyEmail);
