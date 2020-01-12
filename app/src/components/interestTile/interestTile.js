import React, { Component } from 'react';
import './interestTile.scss';

class InterestTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interest: this.props.interest,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.click(this.state.interest._id, this.props.user._id, this.props.active);
  }

  render() {
    return (
      <div className={`interest-tile${this.props.active ? ' active' : ' inactive'}`} key={this.state.interest.name} role="button" tabIndex={-1} onClick={this.props.disableClick ? null : () => { this.toggle(); }}>
        {this.state.interest.name}
      </div>
    );
  }
}

export default InterestTile;
