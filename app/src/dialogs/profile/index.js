import React, { Component } from 'react';
import { connect } from 'react-redux';
import DialogWrapper from '../dialogWrapper';

class ProfileDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <DialogWrapper {...this.props}>
        {this.props.data.placement_courses.map((course) => {
          return (
            <div>
              {course.name}
            </div>
          );
        })}
      </DialogWrapper>
    );
  }
}

export default connect(null, {})(ProfileDialog);
