import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { ROOT_URL } from '../../constants';

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

  renderProfessor = () => {
    console.log(this.state.professor.reviews);
    return (
      <>
        <div className="professor-name">
          {this.state.professor.name}
        </div>
        <div className="professor-reviews">
          {this.state.professor.reviews.map((review) => {
            return (
              <div className="professor-review">
                <div className="review-header">
                  {review.course} during {review.term}
                </div>
                <div className="review-body">
                  {review.review}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  render() {
    if (this.state.professor) {
      return (
        <div>
          {this.renderProfessor()}
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
