import React, { Component } from 'react';
import './hourSelector.scss';

class HourSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeslot: this.props.course.timeslot,
    };

    const displayHour = (this.props.course.timeslot) ? this.props.course.timeslot : 'N/A';
    this.hours = (
      <select disabled>
        <option value={displayHour}>{displayHour}</option>
      </select>
    );

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      timeslot: event.target.value,
    });
    this.props.updateUserCourse(this.props.course.id, { timeslot: event.target.value });
  }

  render() {
    if (this.props.timeslots) {
      this.hours = (
        <select onChange={this.handleChange}>
          {this.props.timeslots.map((hour) => {
            return (
              <option selected={(this.state.timeslot === hour)} value={hour}>{(hour === 'other') ? 'OTH' : hour}</option>
            );
          })}
        </select>
      );
    }
    return (
      <div className="hourSelector">
        {this.hours}
      </div>

    );
  }
}

export default HourSelector;
