import React, { Component } from 'react';
import './interestTile.scss';

class InterestTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      className: 'tile_inactive',
      interest: this.props.interest,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    if (this.props.active) {
      this.setState({ active: true, className: 'tile_active' });
    }
  }

  toggle() {
    new Promise((resolve, reject) => {
      if (this.state.active) {
        this.setState({ className: 'tile_inactive', active: false }, () => resolve(false));
      } else {
        this.setState({ className: 'tile_active', active: true }, () => resolve(true));
      }
    }).then((active) => {
      this.props.updateUserInterests(this.state.interest._id, this.props.user._id, active);
    });
  }

  render() {
    return (
      // eslint-disable-next-line jsx-a11y/interactive-supports-focus
      <div className={this.state.className} key={this.state.interest.name} role="button" onClick={() => { this.toggle(); }}>
        {this.state.interest.name}
      </div>
    );
  }
}

export default InterestTile;
