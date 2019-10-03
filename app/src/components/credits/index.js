/* eslint-disable max-len */
import React, { Component } from 'react';
// import logo from '../../style/logo.svg';
import './credits.scss';

const credits = [
  {
    'Founding Members': ['Adam McQuilkin', 'Zirui Hao'],
    'Founding Location': ['Dartmouth College', 'Hanover, New Hampshire', 'Founded Fall 2018'],
  },
  {
    'Initial Ideation': ['Bryton Moeller', 'Claire Collins', 'Vivian Zhai'],
    'Project Mentors': ['Peter Robbie', 'Erica Lobel', 'Natalie Svoboda', 'Annie Ren'],
  },
  {
    'Project Developers': ['Adam Rinehouse', 'Raul Rodriguez', 'Madeline Hess', 'Benjamin Cape'],
    'Project Designers': ['Regina Yan', 'Christina Bae', 'Emma Staiger', 'Angeline Janumala ', 'Kiera Jackson'],
  },
  {
    'Supporting Organizations': ['Dartmouth Applied Learning and Innovation (DALI) Lab', 'Magnuson Family Center for Entrepreneurship at Dartmouth', 'Information and Technologies Consulting at Dartmouth', 'Thayer School of Engineering at Dartmouth'],
    'Additional Thanks': ['Geoffrey Parker', 'Gillian Yue', 'Lorie Loeb', 'Sarah Morgan', 'Jamie Coughlin', 'Philip Hanlon'],
  },
];

class Credits extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="container">
        <div className={`section ${this.props.embedded ? 'embedded' : ''}`}>
          {!this.props.embedded
            ? (
              <div className="headerContainer">
                {/* <img alt="logo" className="logo" src={logo} />
                <div className="spacer" /> */}
                <div className="mainTitle">Thank You</div>
              </div>
            )
            : null}
          {/* {!this.props.embedded ? <div className="mainTitle">Thank You</div> : null} */}
          {this.props.embedded ? <div className="title">Credits</div> : null}
          <div className="creditTitle">
          The D-Planner Project wouldn’t be where it is today without the dedication and support of many talented members of the Dartmouth community. We would like to extend a heartfelt thank you to the following individuals and organizations
          </div>
          {
            credits.map((row) => {
              return (
                <div className="row">
                  {
                    Object.entries(row).map(([k, v]) => {
                      return (
                        <div className="text">  { /* allLeft */}
                          <div className="textHeader">
                            {k}
                          </div>
                          <div className="body">
                            {
                              v.map((c) => {
                                return <>{c}<br /></>;
                              })
                            }
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default Credits;
