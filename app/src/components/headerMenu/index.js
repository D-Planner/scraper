import React from 'react';
import { withRouter, Router } from 'react-router-dom';
import logo from '../../style/logo.svg';
import './headerMenu.scss';
import { ProgressBar } from '../progressBar';

class HeaderMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOptions: [{ name: 'Sign Up', callback: () => this.props.history.push('/') }, { name: 'Sign In', callback: () => this.props.history.push('/') }],
    };
  }

  componentDidMount() {
    // Check if the object is an array
    if (this.props.menuOptions) {
      if (this.props.menuOptions.length) {
        this.setState({ menuOptions: this.props.menuOptions });
      } else {
        this.setState({ menuOptions: [this.props.menuOptions] });
      }
    }
  }

  renderGraphic() {
    if (this.props.graphic) {
      switch (this.props.graphic.type) {
        case 'progress-bar':
          return <ProgressBar percentage={this.props.graphic.data} />;
        default:
          return null;
      }
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="header-menu-container">
        <div className="header-menu-content-container">
          <img alt="logo" className="logo-top" onClick={() => this.props.history.push('/')} src={logo} />
          {this.props.hideTitle === true ? null : <div className="header-menu-content">D-Planner, the future of academic planning</div>}
        </div>
        <div className="header-menu-option-container">
          {this.state.menuOptions.map((menuOption) => {
            // Throwing keying error here
            return (<button className="header-menu-option" type="button" onClick={menuOption.callback} tabIndex={-1} key={menuOption.name}>{menuOption.name}</button>);
          })}
          <div className="header-menu-graphic-container">
            {this.renderGraphic()}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(HeaderMenu);
