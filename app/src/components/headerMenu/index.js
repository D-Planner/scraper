import React from 'react';
import { withRouter } from 'react-router-dom';
import logo from '../../style/logo.svg';
import './headerMenu.scss';

class HeaderMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="header-menu-container">
        <div className="header-menu-content-container">
          <img alt="logo" className="logo-top" onClick={() => this.props.history.push('/')} src={logo} />
          <div className="header-menu-content">D-Planner, the future of academic planning</div>
        </div>
        <div className="header-menu-login-container">
          <a className="header-menu-login" href="/">Sign In</a>
          <a className="header-menu-login" href="/">Sign Up</a>
        </div>
      </div>
    );
  }
}

export default withRouter(HeaderMenu);
