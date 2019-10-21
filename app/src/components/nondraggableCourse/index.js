import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import CourseElement from '../staticCourseElement';
import { DialogTypes } from '../../constants';
import { showDialog, setDraggingState, fetchCourse } from '../../actions';

import '../draggableCourse/draggableCourse.scss';


/** a drag-n-drop capable component containing information on a Course object */


class NonDraggableCOurse extends React.Component {
  constructor(props) {
    super(props);
    // console.log('COURSE', props);
    this.state = {
      beingHovered: false,
    };
  }

  /**
   * Sends off information for [dialogOrchestrator].
   * THIS FEATURE IS NOT COMPLETE, NEED TO BUILD SPECIAL RENDERING DEPENDING ON USER CHOICES OF [hour] AND [distribs].
   * @param {*} props
   */
  showCourseInfoDialog = () => {
    fetchCourse(this.props.course.id).then((course) => {
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
      <div className="popover"
        onMouseEnter={() => this.setState({ beingHovered: true })}
        onMouseLeave={() => this.setState({ beingHovered: false })}
        onClick={() => this.showCourseInfoDialog(this.props)}
        role="button"
        tabIndex="-1" // 0
      >
        <CourseElement
          size="xl"
          course={course}
          beingHovered={this.state.beingHovered}
        />
        <div className={`dot ${course.offered ? 'success' : 'error'}`} style={{ marginLeft: '5px' }} data-tip />
        <ReactTooltip place="right" type="dark" effect="float">
          {course.offered ? `Offered ${this.props.currTerm.year.toString() + this.props.currTerm}` : `Not offered ${this.props.currTerm.year.toString() + this.props.currTerm}`}
        </ReactTooltip>
      </div>
    );
  }
}

export default connect(null, { showDialog, setDraggingState, fetchCourse })(NonDraggableCOurse);
