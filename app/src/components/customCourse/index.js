import React, { Component } from 'react';
import '../draggableCourse/draggableCourse.scss';
import { connect } from 'react-redux';
import { Departments } from '../../constants';
import DraggableCustomCourse from './draggableCustomCourse';
import { updateCustomCourse } from '../../actions';

/** a drag-n-drop capable component containing information on a UserCourse object */
class CustomCourse extends Component {
  constructor(props) {
    super(props);

    const defaultCustom = { department: 'COSC', name: 'Placeholder' };

    this.state = {
      beingHovered: false,
      ...(props.custom || defaultCustom),
    };

    this.updateCustomCourse = this.updateCustomCourse.bind(this);
  }

  updateCustomCourse(newDept, newName) {
    this.setState((prevState) => {
      return {
        department: (newDept || prevState.department),
        name: (newName || prevState.name),
      };
    }, () => {
      if (this.props.inTerm) {
        console.log(this.state);
        this.props.updateCustomCourse({
          ...this.props.customCourse,
          custom: { department: this.state.department, name: this.state.name },
        });
      }
    });
  }


  render() {
    const custom = { department: this.state.department, name: this.state.name };

    return (
      <div className="row">
        {this.props.inTerm
          ? null
          : (
            <select defaultValue={custom.department} className="sort-picker" onChange={e => this.updateCustomCourse(e.target.value, null)}>
              {Departments.map((d, i) => <option key={i.toString()} value={d}>{d}</option>)}
            </select>
          )}
        <DraggableCustomCourse {...this.props} updateCustomCourse={this.updateCustomCourse} custom={custom} beingHovered={this.state.beingHovered} />
        <div
          className="popover"
          onMouseEnter={() => this.setState({ beingHovered: true })}
          onMouseLeave={() => this.setState({ beingHovered: false })}
          role="button"
          tabIndex="-1"
        />
      </div>
    );
  }
}
// eslint-disable-next-line new-cap
export default connect(null, { updateCustomCourse })(CustomCourse);
