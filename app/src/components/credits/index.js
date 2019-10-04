/* eslint-disable max-len */
import React, { Component } from 'react';
import logo from '../../style/logo.svg';
import dali from '../../style/dali.png';
import './credits.scss';

const credits = [
  {
    'Founding Members': ['Adam McQuilkin', 'Ziray Hao', 'Benjamin Cape'],
    'Project Mentors': ['Tim Tregubov', 'Peter Robbie', 'Erica Lobel', 'Natalie Svoboda', 'Annie Ren'],
  },
  {
  },
  {
    'Project Developers': ['Adam Rinehouse', 'Raul Rodriguez', 'Gillian Yue', 'Madeline Hess'],
    'Project Designers': ['Regina Yan', 'Christina Bae', 'Bryton Moeller', 'Claire Collins', 'Vivian Zhai'],
  },
  {
    'Additional Thanks': ['Geoffrey Parker', 'Lorie Loeb', 'Sarah Morgan', 'Jamie Coughlin', 'Philip Hanlon'],
    'Supporting Organizations': ['DALI Lab', 'Magnuson Family Center for Entrepreneurship', 'Information and Technologies Consulting', 'Thayer School of Engineering'],
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
                <img alt="logo" className="logo" src={logo} />
                <div className="spacer" />
                <div className="mainTitle">Who are we?</div>
              </div>
            )
            : null}
          {/* {!this.props.embedded ? <div className="mainTitle">Thank You</div> : null} */}
          {this.props.embedded ? <div className="title">Credits</div> : null}
          <div className="creditTitle light-font">
          The D-Planner Project wouldn’t be where it is today without the support of many talented members of the Dartmouth community. We would like to extend a heartfelt thank you to the following individuals and organizations
          </div>
          <div className="people">
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
                                  return <div className="name light-font">{c}</div>;
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
          <img src={dali} alt="dali-logo" className="dali" />
        </div>
      </div>
    );
  }
}

export default Credits;
