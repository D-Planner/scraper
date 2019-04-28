import React from 'react';
import { connect } from 'react-redux';
import { hideDialog } from '../actions';
import { DialogTypes } from '../constants';

import NewPlanDialog from './newPlan';
import DeletePlanDialog from './deletePlan';

const DialogOrchestrator = (props) => {
  switch (props.type) {
    case DialogTypes.NEW_PLAN:
      return (<NewPlanDialog {...props.options} hideDialog={props.hideDialog} />);
    case DialogTypes.DELETE_PLAN:
      return (<DeletePlanDialog {...props.options} hideDialog={props.hideDialog} />);
    default:
      return null;
  }
};

const mapStateToProps = state => ({
  type: state.dialog.type,
  options: state.dialog.options,
});

export default connect(mapStateToProps, { hideDialog })(DialogOrchestrator);
