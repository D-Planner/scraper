import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  removeCourseFromFavorites, removePlacement, fetchUser, fetchPlan, updateUser, fetchPlans, showDialog, verifyEmail,
} from '../../actions';
import DialogWrapper from '../dialogWrapper';
import NonDraggableCourse from '../../components/nonDraggableCourse';

import { DialogTypes } from '../../constants';
import edit from '../../style/edit.svg';
import './profile.scss';

class ProfileDialog extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      editing: false,
      oldGradYear: this.props.user.graduationYear,
      verifying: false,
    };
    this.newUser = this.props.user;
    this.handleChange = this.handleChange.bind(this);
  }

  // Check if an email has been sent before loading of component
  componentDidMount() {
    if (this.props.user && this.props.user.verificationKey !== undefined && this.props.user.verificationKey !== -1) {
      this.setState({ verifying: true });
    }
  }

  handleChange = (e, type) => {
    this.newUser[e.target.name] = e.target.value;
  }

  handleToggleEdit = () => {
    let shouldUpdate = false;
    if (this.state.editing) {
      if (this.state.oldGradYear !== this.newUser.graduationYear) {
        const dialogOptions = {
          title: 'Warning',
          message: 'If you change your grad year, all your plans will reset.',
          size: 'sm',
          okText: 'Continue',
          noText: 'Abort',
          showNo: true,
          onOk: () => {
            shouldUpdate = true;
          },
          onNo: () => {
            console.log('user declined to update profile, change nothing');
          },
        };
        this.props.showDialog(DialogTypes.NOTICE, dialogOptions);
      } else {
        shouldUpdate = true;
      }
      if (shouldUpdate) {
        this.props.updateUser(this.newUser).then(() => {
          this.props.fetchPlans().then(() => {
            // window.location.reload();
          });
        });
      }
    }

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
              {!this.state.editing ? `${this.newUser.first_name}`
                : <input type="text" defaultValue={this.newUser.first_name} name="first_name" onChange={this.handleChange} />}
            </div>
            {!this.state.editing ? <img src={edit} alt="edit" onClick={this.handleToggleEdit} />
              : <img src={edit} alt="edit" onClick={this.handleToggleEdit} />}
          </div>
          <div className="info">
            <div className="label">Last name:</div>
            <div className="data">
              {!this.state.editing ? `${this.newUser.last_name}`
                : <input type="text" defaultValue={this.newUser.last_name} name="firs_name" onChange={this.handleChange} />}
            </div>
            <img src={edit} alt="edit" onClick={this.handleToggleEdit} />
          </div>
          <div className="info">
            <div className="label">Email:</div>
            <div className="data">
              {!this.state.editing ? `${this.newUser.email}`
                : <input type="email" defaultValue={this.newUser.email} name="email" onChange={this.handleChange} />}
            </div>
            <img src={edit} alt="edit" onClick={this.handleToggleEdit} />
          </div>
          <div className="info">
            <div className="label">
              Graduation Year:
            </div>
            <div className="data">
              {!this.state.editing ? `${this.newUser.graduationYear}`
                : <input id="grad" type="number" defaultValue={this.newUser.graduationYear} name="graduationYear" onChange={this.handleChange} />}
            </div>
            <img src={edit} alt="edit" onClick={this.handleToggleEdit} />
          </div>
          {this.props.user.emailVerified === false ? (
            <button type="button"
              className={this.state.verifying ? 'verify-button sent' : 'verify-button'}
              onClick={() => {
                this.props.fetchUser().then(() => this.props.verifyEmail(this.props.user._id));
                this.setState({ verifying: true });
              }}
            >
              <div className={this.state.verifying ? 'button-text sent' : 'button-text'}>{this.state.verifying ? 'Verification sent!' : 'Verify your email!'}</div>
            </button>
          )
            : null}
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
            currTerm={this.props.currTerm}
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
  currTerm: state.time.currTerm,
});

export default (connect(mapStateToProps, {
  removeCourseFromFavorites, removePlacement, fetchUser, fetchPlan, updateUser, fetchPlans, showDialog, verifyEmail,
})(ProfileDialog));
