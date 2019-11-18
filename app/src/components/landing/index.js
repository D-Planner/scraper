/* eslint-disable max-len */
import React from 'react';
import './landing.scss';
import { Link, Element } from 'react-scroll';
import { connect } from 'react-redux';
import { showDialog } from '../../actions';
import { DialogTypes } from '../../constants';
import SignInForm from '../../containers/signIn';
import SignUpForm from '../../containers/signUp';
import Credits from '../credits';
import pine from '../../style/pine_name.png';
import dplanner from '../../style/dplanner-19.png';
import dplannerTransparent from '../../style/d-planner_transparent.png';
import arrowDown from '../../style/arrow_down.svg';
import feature1 from '../../style/feature1.svg';
import feature2 from '../../style/feature2.svg';
import feature3 from '../../style/feature3.svg';

const features = [
  {
    'Intelligent Course Planning': 'We\'e tired of planning our courses in Excel (or worse on paper) and we know you are too, but fear not! D-Planner is centered around an intuitive plan-based interface that allows students to plan out multiple different paths through their time at Dartmouth with different majors, minors, and more. Whether an on or off-term, D-Planner can help you feel confident in your course decisions!',
    'Auto-Generate Plans': 'To help students who are looking for a starting point for their course plans, we offer course plan auto-generation based on user-specified off and on-terms, user-selected major and minor, courses already taken, as well as the user\'s expected graduation date. All auto-generated plans will satisfy both prerequisite hierarchy and the requirements of the major and minor, giving you the perfect starting point in finding your path!',
  },
  {
    'Detailed Course Information': 'Once you\'ve found a class that looks interesting for your plan, our extensive course database offers all information publicly available on the course, from its full name and description to its distributive, past medians, LayupList score, prerequisites and classes with it as a prerequisite, and much more. You no longer need to search through multiple different sites to find all of the course information you will ever need!',
    'Major/Minor Planning': 'There are no viable solutions for undergraduates looking to plan out their majors and minors before actually declaring sophomore year, that is until now! D-Planner offers major and minor planning features such as required classes and prerequisites. We\'ve done the hard work for you, now all that\'s left is to dream big!',
  },
  {
    'Keyword-based Course Search': 'Instead of needing to search for courses based on a specific and arbitrary course name (who here knows what ENGS 30 is by name?), D-Planner is equipped with a powerful and easy to use search engine that allows students to search for all of the courses in the ORC by keywords, name, term, and any other information the college maintains. Enjoy discovering your next favorite course!',
    'Excel/Sheets Plan Import': 'We understand that students you may have created personal course plans before the advent of D-Planner, but don\'t worry! D-Planner accepts Excel and Sheets-based .csv files and allows you to import these past documents to a D-Planner plan! We have created a spreadsheet import specification that allows you to quickly and painlessly transfer your hard work to the D-Planner system!',
  },
  {
    'Automatic Prerequisite Checking': 'We\'ve listened to you, and you\'ve told us that making sure you have all of your prerequisites are fulfilled in the correct is order is hard. Thanks to our novel live prerequisite-checking algorithms, you will never again be trying to register for a class only to find out that you aren\'t eligible. Our prerequisite checking also functions with major and minor planning, allowing you to plan quickly and effectively!',
    'Advanced Class Search': 'Besides our basic plan search, we also offer an advanced search for finding the perfect class schedule for sophomore summer (or any other term!). Advanced search includes filters ranging from broad department selection to specific distributive requirements, historical term offerings, and more! For when out basic search just isn\'t enough, advanced search is sure to kick your plan to the next level!',
  },
];

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signIn: false,
    };
  }

  checkAuth = (warning) => {
    if (!this.props.authError) {
      const opt = {
        title: 'Error Signing In/Up',
        warning,
        okText: 'Try Again',
      };
      this.props.showDialog(DialogTypes.ERROR, opt);
    }
  }

  render() {
    return (
      <>
        <div className="container">
          <div className="left">
            <div className="intro">
              <span className="line1">Welcome to D-Planner.</span>
              <span className="line2">A whole new way to build your D-Plan.</span>
              <div className="showcase">
                <div className="feature">
                  <img className="feature-icon" src={feature1} alt="feature-icon" />
                  <div className="feature-text">Browse over 3,000 courses - full with Layup-list data, terms-offered predictions, and more.</div>
                </div>
                <div className="feature">
                  <img className="feature-icon" src={feature2} alt="feature-icon" />
                  <div className="feature-text">Build out academic plans that fit your needs. Test out different scenarios easily.</div>
                </div>
                <div className="feature">
                  <img className="feature-icon" src={feature3} alt="feature-icon" />
                  <div className="feature-text">Visualize your undergraduate years at Dartmouth. Know exactly what you should take.</div>
                </div>
              </div>
            </div>
            <img className="pine" src={pine} alt="" />
          </div>
          <div className="right">
            {this.state.signIn
              ? <SignInForm checkAuth={this.checkAuth} showSignUp switchToSignUp={() => this.setState({ signIn: false })} />
              : <SignUpForm checkAuth={this.checkAuth} switchToSignIn={() => this.setState({ signIn: true })} />
            }
            <Link to="philosophy" spy smooth duration={750}>
              <div className="scroller">
                <img src={arrowDown} alt="" />
              </div>
            </Link>
          </div>
        </div>
        <div className="info">
          <div className="section">
            <div className="title">
              <Element name="philosophy">Our Philosophy</Element>
            </div>
            <div className="content">
              <img className="img" src={dplanner} alt="" width="615px" height="auto" />
              <div className="textContainer">
                <div className="text">
                  <div className="textHeader">
                      For Students
                  </div>
                  <div className="body">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo ultricies lorem, id cursus odio. Sed sollicitudin congue mi ac posuere. Quisque enim leo, elementum ut lacinia nec, volutpat vitae nisl. Proin sed suscipit justo. Nullam vehicula lobortis justo a condimentum. Etiam id justo at odio bibendum dignissim id id urna. Nullam tincidunt, nisi nec cursus dapibus, lorem magna placerat mi, eget rhoncus tortor mauris sit amet felis. Suspendisse scelerisque nisi et mi laoreet, in fermentum nisl cursus.
                  </div>
                </div>
                <div className="text">
                  <div className="textHeader">
                      By Students
                  </div>
                  <div className="body">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo ultricies lorem, id cursus odio. Sed sollicitudin congue mi ac posuere. Quisque enim leo, elementum ut lacinia nec, volutpat vitae nisl. Proin sed suscipit justo. Nullam vehicula lobortis justo a condimentum. Etiam id justo at odio bibendum dignissim id id urna. Nullam tincidunt, nisi nec cursus dapibus, lorem magna placerat mi, eget rhoncus tortor mauris sit amet felis. Suspendisse scelerisque nisi et mi laoreet, in fermentum nisl cursus.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="title">
              Features
            </div>
            {
              features.map((row) => {
                return (
                  <div className="row">
                    {
                      Object.entries(row).map(([k, v]) => {
                        return (
                          <div className="text">
                            <div className="textHeader">
                              {k}
                            </div>
                            <div className="body">
                              {v}
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
          <Credits embedded />
        </div>
        <div className="footer">
          <div className="left">
            <div className="content">
              <img src={dplannerTransparent} alt="" />
              <p>The D-Planner Project</p>
              <p className="copy">&#9400;2019</p>
            </div>
          </div>
          <div className="right">
            <SignInForm checkAuth={this.checkAuth} />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  authError: state.auth.authenticated,
});

export default connect(mapStateToProps, { showDialog })(Landing);
