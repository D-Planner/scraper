// Inspired by 'react-loading-screen', accessed 10/25/2019
// https://github.com/mslavan/react-loading-screen/blob/master/src/index.js

import React from 'react';
import { connect } from 'react-redux';
import DPlan from '../../containers/dplan';
import logo from '../../style/logo.svg';

import '../../style/variables.scss';
import './loading.scss';

const Loading = (props) => {
  return (
    <div className="loading-container">
      <div className="loader" style={{ display: props.loading ? 'flex' : 'none', height: props.loading ? '100vh' : 0 }}>
        <img className="loader-image" src={logo} alt="logo" />
      </div>
      <div className="loading-content-countainer" style={{ display: props.loading ? 'none' : 'flex' }}>
        {props.component !== undefined ? console.log('props.component: defined') : console.log('props.component: undefined')}
        {props.component !== undefined ? props.component : <DPlan /> }
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  loading: state.loading.loading,
});

export default connect(mapStateToProps, {})(Loading);
