import React from 'react';
import './errorMessage.scss';

export default class Bucket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="error-message">
        <h1>Oh no!</h1>
        <p>{this.props.errorText}</p>
      </div>
    );
  }
}
