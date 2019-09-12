import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  removeCourseFromFavorites, removePlacement, fetchUser, fetchPlan, updateUser, fetchPlans,
} from '../../actions';
import DialogWrapper from '../dialogWrapper';
import NonDraggableCourse from '../../components/nonDraggableCourse';

import edit from '../../style/edit.svg';
import './profile.scss';

class ProfileDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      year: 0,
      editing: false,
    };
    this.newUser = this.props.user;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e, type) => {
    if (e.target.name === 'graduationYear') {
      // Render Error Message here
    }
    this.newUser[e.target.name] = e.target.value;
    switch (type) {
      case 'firstName':
        this.setState({ firstName: e.target.value });
        break;
      case 'lastName':
        this.setState({ lastName: e.target.value });
        break;
      case 'email':
        this.setState({ email: e.target.value });
        break;
      case 'year':
        this.setState({ year: parseInt(e.target.value, 10) });
        break;
      default:
        break;
    }
    console.log(this.state);
  }

  handleToggleEdit = () => {
    this.setState(prevState => ({
      editing: !prevState.editing,
    }));
  }

  renderUserInfo = () => {
    return (
      <div className="user">
        <div className="profile-left">
          <div className="info">
            <div className="label">First name:</div>
            <div className="data">
              <input type="text" defaultValue={this.newUser.first_name} name="firstName" onChange={e => this.handleChange(e, 'firstName')} />
            </div>
            <img src={edit} alt="edit" />
          </div>
          <div className="info">
            <div className="label">Last name:</div>
            <div className="data">
              <input type="text" defaultValue={this.newUser.last_name} name="firstName" onChange={e => this.handleChange(e, 'lastName')} />
            </div>
            <img src={edit} alt="edit" onClick={this.handleToggleEdit} />
          </div>
          <div className="info">
            <div className="label">Email:</div>
            <div className="data">
              <input type="email" defaultValue={this.newUser.email} name="email" onChange={e => this.handleChange(e, 'email')} />
            </div>
          </div>
          <div className="info">
            <div className="label">
              Graduation Year:
              <div className="sub_label warning">Changing your graduation year will delete your plans</div>
            </div>
            <div className="data">
              <input id="grad" type="number" defaultValue={this.newUser.graduationYear} name="graduationYear" onChange={e => this.handleChange(e, 'year')} />
            </div>
          </div>
          <input type="button"
            value="Update"
            onClick={() => {
              this.props.updateUser(this.newUser).then(() => {
                this.props.fetchPlans().then(() => {
                  window.location.reload();
                });
              });
            }}
          />
        </div>
        <div className="profile-right">
          <div className="placements">
            <div className="placements-label">Placement Courses</div>
            <div className="placements-data">
              {this.renderPlacements()}
            </div>
          </div>
        </div>

      </div>
    );
  }

  // renderBookmarks = () => {
  //   return (
  //     this.props.user.favorite_courses.map((c, i) => {
  //       return (
  //         <CourseElement
  //           size="bg"
  //           course={c}
  //           action={{
  //             type: 'remove',
  //             svg: remove,
  //             method: () => {
  //               this.props.removeCourseFromFavorites(c.id).then((r) => {
  //                 this.props.fetchUser();
  //                 this.props.fetchPlan(this.props.plan.id);
  //               }).catch((e) => {
  //                 console.log(e);
  //               });
  //             },
  //           }}
  //         />
  //       );
  //     })
  //   );
  // }

  renderPlacements = () => {
    return (
      this.props.user.placement_courses.map((c, i) => {
        return (
          <NonDraggableCourse
            key={i.toString()}
            course={c}
          />
        );
      })
    );
  }

  render() {
    return (
      <DialogWrapper {...this.props}>
        {this.renderUserInfo()}
      </DialogWrapper>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.current,
  plan: state.plans.current,
});

export default (connect(mapStateToProps, {
  removeCourseFromFavorites, removePlacement, fetchUser, fetchPlan, updateUser, fetchPlans,
})(ProfileDialog));
