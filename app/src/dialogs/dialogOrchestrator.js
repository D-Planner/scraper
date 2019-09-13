import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { hideDialog, fetchMajors } from '../actions';
import { DialogTypes } from '../constants';

import NewPlanDialog from './newPlan';
import DeletePlanDialog from './deletePlan';
import DeclareMajorDialog from './declareMajor';
import CourseInfoDialog from './courseInfo';
import TurnOffTermDialog from './turnOffTerm';
import ProfessorInfoDialog from './professorInfo';
import ProfileDialog from './profile';
import ErrorDialog from './error';
import FilterDialog from './filter';

// Top-level orchestrator for all dialogs in the application
// Should accept all types enumerated in DialogTypes and provide a dialog component for each one
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
    case DialogTypes.COURSE_INFO:
      return (<CourseInfoDialog {...props.options} hideDialog={props.hideDialog} />);
    case DialogTypes.OFF_TERM:
      return (<TurnOffTermDialog {...props.options} hideDialog={props.hideDialog} />);
    case DialogTypes.PROFILE:
      return (<ProfileDialog {...props.options} hideDialog={props.hideDialog} />);
    case DialogTypes.ERROR:
      return (<ErrorDialog {...props.options} hideDialog={props.hideDialog} />);
    case DialogTypes.FILTER:
      return (<FilterDialog {...props.options} hideDialog={props.hideDialog} />);
    case DialogTypes.PROFESSOR_INFO:
      return (<ProfessorInfoDialog {...props.options} hideDialog={props.hideDialog} />);
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
