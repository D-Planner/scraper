import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signupUser } from '../../actions';

class signUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      username: '',
    };
    this.signUp = this.signUp.bind(this);
    this.email = this.email.bind(this);
    this.password = this.password.bind(this);
    this.username = this.username.bind(this);
  }

  email(event) {
    this.setState({ email: event.target.value });
  }

  password(event) {
    this.setState({ password: event.target.value });
  }

  username(event) {
    this.setState({ username: event.target.value });
  }

  signUp(event) {
    this.props.signupUser(this.state, this.props.history);
    event.preventDefault();
  }

  render() {
    return (
      <form>
        <div>Sign Up</div>
        <input id="email" placeholder="Email" onChange={this.email} value={this.state.email} />
        <input id="password" placeholder="Password" onChange={this.password} value={this.state.password} />
        <input id="username" placeholder="Username" onChange={this.username} value={this.state.username} />
        <button type="button" onClick={this.signUp}>Register</button>
      </form>
    );
  }
}

export default withRouter(connect(null, { signupUser })(signUp));
