import React from 'react';
import { connect } from 'react-redux';
import LoadingScreen from 'react-loading-screen';
import logo from '../../style/logo.svg';
import DPlan from '../../containers/dplan';

import '../../style/variables.scss';
import './loading.scss';

const Loading = (props) => {
  return (
    <LoadingScreen
      loading={props.loading}
      bgColor="#ffffff"
      spinnerColor="#574966"
      textColor="#574966"
      logoSrc={logo}
    >
      <DPlan />
    </LoadingScreen>
  );
};

const mapStateToProps = state => ({
  loading: state.loading.loading,
});

export default connect(mapStateToProps, {})(Loading);
