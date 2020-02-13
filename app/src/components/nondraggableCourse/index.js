import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import CourseElement from '../staticCourseElement';
import { DialogTypes } from '../../constants';
import { showDialog, setDraggingState, fetchCourse } from '../../actions';

import '../draggableCourse/draggableCourse.scss';


/** a drag-n-drop capable component containing information on a Course object */


class NonDraggableCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beingHovered: false,
      active: true,
    };
  }

  componentWillMount() {
    if (this.props.active === false) {
      this.setState({ active: false });
    }
  }

  /**
   * Sends off information for [dialogOrchestrator].
   * @param {*} props
   */
  showCourseInfoDialog = () => {
    this.props.fetchCourse(this.props.course.id).then((course) => {
      const dialogOptions = {
        title: `${course.department} ${course.number}: ${course.name}`,
        size: 'lg',
        data: course,
        showOk: false,
      };
      this.props.showDialog(DialogTypes.COURSE_INFO, dialogOptions);
    });
  }

  render() {
    const { course } = this.props;
    return (
      <div className="popover" // {this.state.active ? 'active_course' : 'inactive_course'}
        onMouseEnter={() => this.setState({ beingHovered: true })}
        onMouseLeave={() => this.setState({ beingHovered: false })}
        onClick={this.props.click ? () => this.props.click() : () => this.showCourseInfoDialog(this.props)}
        role="button"
        tabIndex="-1" // 0
      >
        <CourseElement
          active={this.state.active}
          size="xl"
          course={course}
          beingHovered={this.state.beingHovered}
        />
        <div className={`dot ${course.offered ? 'success' : 'error'}`} style={{ marginLeft: '5px' }} data-tip data-for={course.id} />
        <ReactTooltip id={course.id} place="right" type="dark" effect="float">
          {course.offered ? `Offered ${this.props.currTerm.year.toString() + this.props.currTerm.term}` : `Not offered ${this.props.currTerm.year.toString() + this.props.currTerm.term}`}
        </ReactTooltip>
      </div>
    );
  }
}

export default connect(null, { showDialog, setDraggingState, fetchCourse })(NonDraggableCourse);
