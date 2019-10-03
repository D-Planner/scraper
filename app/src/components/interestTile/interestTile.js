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
    if (this.state.active) {
      this.setState({ className: 'tile_inactive', active: false });
    } else {
      this.setState({ className: 'tile_active', active: true });
    }
    this.props.updateUserInterests(this.state.interest);
  }

  render() {
    return (
      // eslint-disable-next-line jsx-a11y/interactive-supports-focus
      <div className={this.state.className} key={this.state.interest} role="button" onClick={() => { this.toggle(); }}>
        {this.state.interest}
      </div>
    );
  }
}

export default InterestTile;
