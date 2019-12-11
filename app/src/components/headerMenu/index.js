import React from 'react';
import { withRouter } from 'react-router-dom';
import logo from '../../style/logo.svg';
import './headerMenu.scss';

class HeaderMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOptions: [{ name: 'Sign Up', callback: () => this.props.history.push('/') }, { name: 'Sign In', callback: () => this.props.history.push('/') }],
    };
  }

  componentDidMount() {
    // Check if the object is an array
    if (this.props.menuOptions.length) {
      this.setState({ menuOptions: this.props.menuOptions });
    } else {
      this.setState({ menuOptions: [this.props.menuOptions] });
    }
  }

  render() {
    return (
      <div className="header-menu-container">
        <div className="header-menu-content-container">
          <img alt="logo" className="logo-top" onClick={() => this.props.history.push('/')} src={logo} />
          <div className="header-menu-content">D-Planner, the future of academic planning</div>
        </div>
        <div className="header-menu-option-container">
          {this.state.menuOptions.map((menuOption) => {
            console.log('menuOption', menuOption);
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            return (<a className="header-menu-option" onClick={menuOption.callback} role="button" tabIndex={-1} key={menuOption.name}>{menuOption.name}</a>);
          })}
        </div>
      </div>
    );
  }
}

export default withRouter(HeaderMenu);
