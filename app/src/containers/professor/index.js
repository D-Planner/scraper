import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { ROOT_URL } from '../../constants';

import './professor.scss';

class Professor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      professor: null,
    };
  }

  componentWillMount() {
    this.fetchProfessor(this.props.match.params.id);
  }

  fetchProfessor = (id) => {
    axios.get(`${ROOT_URL}/professors/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then((response) => {
      console.log(response);
      this.setState({
        professor: response.data,
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    if (this.state.professor) {
      return (
        <div className="professor">
          <Helmet>
            <title>{this.state.professor.name}</title>
          </Helmet>
          <div className="professor-name">
            {this.state.professor.name}
          </div>
          <div className="professor-name-sub">
            All course reviews for this professor. Supplied by Layup-list, curated by D-Planner.
          </div>
          <div className="professor-reviews">
            {this.state.professor.reviews.map((review) => {
              return (
                <div className="professor-review">
                  <div className="review-header">
                    {review.course} [{review.term}]
                  </div>
                  <div className="review-body">
                    {review.review}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  professors: state.professors.professor,
});

export default withRouter(connect(mapStateToProps, null)(Professor));
