import React, { Component } from 'react';
import { connect } from 'react-redux';

import { BUG_REPORT_URL } from '../../constants';
import { getRandomCourse, showDialog } from '../../actions';
import notFoundFeature from '../../../assets/404-feature.svg';
import HeaderMenu from '../headerMenu';
import DefaultButton from '../defaultButton';

import './fallback.scss';


class FallBack extends Component {
  menuOptions = [{ name: 'Report an error', callback: () => window.open(BUG_REPORT_URL) }];

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <HeaderMenu menuOptions={this.menuOptions} />
        <div className="fallback-container">
          <img className="fallback-main-feature" src={notFoundFeature} alt="404" />
          <h1>Uh oh... You seem to be lost.</h1>
          <h3>We’ve got the tools to help you get back on track.</h3>
          {/* Add default button component */}
          {/* Standardize h1, h2, h3, ... styling in <App /> component */}
          <DefaultButton click={() => this.props.history.push('/')} label="Go Home" width="100%" />
          <a href={BUG_REPORT_URL} target="_blank" rel="noopener noreferrer">Does this keep happening? Report an error here</a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  randomCourse: state.courses.random_course,
});

export default connect(mapStateToProps, { getRandomCourse, showDialog })(FallBack);
