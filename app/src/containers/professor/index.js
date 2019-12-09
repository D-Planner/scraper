import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Link, Element } from 'react-scroll';
import { ROOT_URL } from '../../constants';
import HeaderMenu from '../../components/headerMenu';

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
      response.data.reviews = response.data.reviews.map((review) => {
        const term = review.match(/\d{2}['X'|'F'|'W'|'S']/)[0];
        const course = review.match(/^[^:]*/);

        review = review.substring(review.indexOf(`${response.data.name}:`) + response.data.name.length + 2).toString();
        return { course, term, review };
      }).reduce((acc, curr) => {
        if (!acc[curr.course]) acc[curr.course] = [];
        acc[curr.course].push({ term: curr.term, review: curr.review });
        return acc;
      }, {});
      console.log(response);
      this.setState({
        professor: response.data,
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    if (this.props.authenticated === true) { // Authenticated
      if (this.state.professor) { // Professor exists
        return (
          <div>
            <HeaderMenu />
            <div className="professor-page-container">
              <div className="professor-container">
                <div className="professor">
                  <Helmet>
                    <title>{this.state.professor.name}</title>
                  </Helmet>
                  <div className="professor-name">
                    {this.state.professor.name}
                  </div>
                  <div className="professor-name-sub">
                    {`All course reviews for ${this.state.professor.name}. Supplied by Layup-list, curated by D-Planner.`}
                  </div>
                  <div className="professor-name-sub">
                    {
              Object.keys(this.state.professor.reviews).map((course, i) => {
                return (
                  <>
                    <Link to={course} key={i.toString()} spy smooth duration={500}>
                      <div className="professor-course">{course}</div>
                    </Link>
                  </>
                );
              })
            }
                  </div>
                  <div className="professor-reviews">
                    {
              Object.entries(this.state.professor.reviews).map(([course, reviews], i) => {
                return (
                  <div className="professor-review" key={i.toString()}>
                    <Element name={course} />
                    <div className="review-header">
                      {course}
                    </div>
                    {
                      reviews.map((review, j) => {
                        return (
                          <div key={j.toString()} className="review-body">
                            <strong>[{review.term}]</strong> {review.review}
                          </div>
                        );
                      })
                    }
                  </div>
                );
              })
            }
                    {/* {this.state.professor.reviews.map((review) => {
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
            })} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else { // No professor
        return (
          <div>
            <HeaderMenu />
            <div className="professor-page-container">
              <div id="intro-coursepage">
                <div className="section-header">{`Can't find professor with id '${this.props.match.params.id}'`}</div>
                <div className="intro-coursepage-text">{`We couldn't find a professor with id '${this.props.match.params.id}'. If you belive this is an error please contact us through the menu option in the main plan view.`}</div>
              </div>
            </div>
          </div>
        );
      }
    } else { // Not authenticated
      return (
        <div>
          <HeaderMenu />
          <div className="professor-page-container">
            <div id="intro-coursepage">
              <div className="section-header">Want to get the most from college?</div>
              <div className="intro-coursepage-text">D-Planner is a plan-based academic planning suite built to enable students to take advantage of their academic opportunities in higher education. We belive that through data curation and insightful analytics students are betetr prepared to succeed, both in college and beyond. To begin planning for your future, sign up above.</div>
            </div>
            <hr className="horizontal-divider-small" />
            <div id="last" style={{ flexDirection: 'column' }}><div className="section-header">Sign in to see more</div><div className="last-message">To see more, please sign in or sign up above.</div></div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  professors: state.professors.professor,
  authenticated: state.auth.authenticated,
});

export default withRouter(connect(mapStateToProps, null)(Professor));
