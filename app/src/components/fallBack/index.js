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
      <div style={{ height: '100vh' }}>
        <HeaderMenu menuOptions={this.menuOptions} />
        <div className="fallback-container">
          <img className="fallback-main-feature" src={notFoundFeature} alt="404" style={{ marginBottom: '73px' }} />
          <h1 style={{ marginBottom: '8px' }}>It looks like this link no longer exists.</h1>
          <h3 style={{ marginBottom: '36px' }}>That being said, your plans miss you.</h3>
          {/* Add default button component */}
          {/* Standardize h1, h2, h3, ... styling in <App /> component */}
          <DefaultButton click={() => this.props.history.push('/')} label="Go Back" width="80%" />
          <a href={BUG_REPORT_URL} target="_blank" rel="noopener noreferrer" style={{ marginTop: '11px', marginBottom: '8vh' }}>Does this keep happening? Report an error here</a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  randomCourse: state.courses.random_course,
});

export default connect(mapStateToProps, { getRandomCourse, showDialog })(FallBack);
