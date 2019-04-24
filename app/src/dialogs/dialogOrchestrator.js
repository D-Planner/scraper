import React from 'react';
import { connect } from 'react-redux';
import { hideDialog } from '../actions';

import NewPlanDialog from './newPlan';

const DialogOrchestrator = (props) => {
  switch (props.type) {
    case 'NEW_PLAN':
      return (<NewPlanDialog {...props.options} hideDialog={props.hideDialog} />);
    default:
      return null;
  }
};

const mapStateToProps = state => ({
  type: state.dialog.type,
  options: state.dialog.options,
});

export default connect(mapStateToProps, { hideDialog })(DialogOrchestrator);
