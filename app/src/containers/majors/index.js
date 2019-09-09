import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  fetchMajor, fetchMajors, declareMajor, dropMajor, fetchProgress, fetchDeclared,
} from '../../actions';
import './majors.scss';

class Majors extends Component {
  constructor(props) {
    super(props);

    this.declare = this.declare.bind(this);
    this.drop = this.drop.bind(this);
    this.progress = this.progress.bind(this);
  }

  componentDidMount() {
    this.props.fetchDeclared();
    this.props.fetchMajors();
  }

  declare(event) {
    event.preventDefault();
    this.props.declareMajor(event.target.value);
  }

  drop(event) {
    event.preventDefault();
    this.props.dropMajor(event.target.value);
  }

  progress(event) {
    event.preventDefault();
    this.props.fetchProgress(event.target.value);
  }

  renderDeclared() {
    return (
      this.props.declared.map((major) => {
        return (
          <div className="majors-content">
            <div className="tabs">
              <h2>Requirements</h2>
              <p>Degree</p>
            </div>
            <p>{major.name}</p>
            <button type="button" value={major.id} onClick={this.drop}>
              Drop
            </button>
            <button type="button" value={major.id} onClick={this.progress}>
              Progress
            </button>
            {this.renderProgress()}
          </div>
        );
      })
    );
  }

  renderProgress() {
    return (
      <div className="progress-container">
        <h3>Prerequisites</h3>
        {this.props.progress === null
          ? <p />
          : (
            <p>
              {this.props.progress.fulfilled.total}
              {'/'}
              {this.props.progress.fulfilled.total + this.props.progress.unfulfilled.total}
            </p>
          )}
      </div>
    );
  }


  renderMajors() {
    return (
      this.props.all.map((major) => {
        return (
          <div className="majors-content">
            <p>Options</p>
            <p>{major.name}</p>
            <button type="button" value={major.id} onClick={this.declare}>
            Declare
            </button>
          </div>
        );
      })
    );
  }

  render() {
    // className="majors-container"
    return (
      <div className="msg">
        Feature coming out soon!
        {/* {this.props.declared.length
          ? this.renderDeclared()
          : this.renderMajors()} */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  all: state.majors.all,
  declared: state.majors.declared,
  major: state.majors.major,
  progress: state.majors.progress,
});


export default withRouter(connect(mapStateToProps, {
  fetchMajor, fetchDeclared, fetchMajors, declareMajor, dropMajor, fetchProgress,
})(Majors));
