import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signinUser } from '../actions';

class signIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.signIn = this.signIn.bind(this);
    this.email = this.email.bind(this);
    this.password = this.password.bind(this);
  }

  email(event) {
    this.setState({ email: event.target.value });
  }

  password(event) {
    this.setState({ password: event.target.value });
  }


  signIn(event) {
    event.preventDefault();
    this.props.signinUser(this.state, this.props.history);
  }

  renderError() {
    if (this.props.error === null) {
      return <div />;
    } else {
      return <div className="error">{this.props.error}</div>;
    }
  }

  render() {
    return (
      <form>
        <div>Sign In</div>
        <input placeholder="Email" value={this.state.email} onChange={this.email} />
        <input placeholder="Password" value={this.state.password} onChange={this.password} />
        <button type="button" onClick={this.signIn}>Login</button>
      </form>
    );
  }
}

export default withRouter(connect(null, { signinUser })(signIn));