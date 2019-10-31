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
    // this.props.fetchUser();
    this.props.fetchUser().then(() => {
      console.log('verfying email');
      // this.props.verifyEmail(this.props.user._id, '985207728361654');
      axios.post(`${ROOT_URL}/auth/verify/email/`, { userID: this.props.user._id, key: this.props.match.params.key }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }).then((response) => {
        console.log('action response');
        console.log(response.data.emailVerified);
        this.setState({ verified: response.data.emailVerified });
      }).catch((error) => {
        console.log('action error');
        console.log(error);
      });
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
              Uh oh, it looks like there&apos;s been an error in your verification...
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
