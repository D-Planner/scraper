import React from 'react';
import { connect } from 'react-redux';
import { hideDialog } from '../actions';

import NewPlanDialog from './newPlan';

const DialogOrchestrator = (props) => {
  switch (props.currentDialog) {
    case 'NEW_PLAN':
      return (<NewPlanDialog {...props} hideDialog={props.hideDialog} />);
    default:
      return null;
  }
};

const mapStateToProps = state => ({
  currentDialog: state.dialog.current,
});

export default connect(mapStateToProps, { hideDialog })(DialogOrchestrator);
