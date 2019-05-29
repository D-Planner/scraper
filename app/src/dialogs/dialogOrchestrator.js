import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { hideDialog, fetchMajors } from '../actions';
import { DialogTypes } from '../constants';

import NewPlanDialog from './newPlan';
import DeletePlanDialog from './deletePlan';
import DeclareMajorDialog from './declareMajor';

const DialogOrchestrator = (props) => {
  useEffect(() => {
    props.fetchMajors();
  }, []);
  switch (props.type) {
    case DialogTypes.NEW_PLAN:
      return (<NewPlanDialog {...props.options} hideDialog={props.hideDialog} />);
    case DialogTypes.DELETE_PLAN:
      return (<DeletePlanDialog {...props.options} hideDialog={props.hideDialog} />);
    case DialogTypes.DECLARE_MAJOR:
      return (<DeclareMajorDialog {...props.options} hideDialog={props.hideDialog} majors={props.majors} />);
    default:
      return null;
  }
};

const mapStateToProps = state => ({
  type: state.dialog.type,
  options: state.dialog.options,
  majors: state.majors.all,
});

export default connect(mapStateToProps, { hideDialog, fetchMajors })(DialogOrchestrator);
