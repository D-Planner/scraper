import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { TransitionGroup, Transition } from 'react-transition-group';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';
import { setPressedKey, removePressedKey } from '../actions';
// import Courses from '../containers/courses';
// import Cytoscape from './Cytoscape';
// import requireAuth from '../containers/requireAuth';
import Professor from '../containers/professor';
import Landing from './landing';
import FallBack from './fallBack';
import DPlan from '../containers/dplan';
import TooSmall, { minWidth, minHeight } from './tooSmall';
import Credits from './credits';
import ForgotPassword from './forgotPassword';
import VerifyEmail from './verifyEmail';
import ResetPassword from './resetPass';
import PrivacyPolicy from './policies/privacy';
import Tutorial from './tutorial';
import TermsAndConditions from './policies/terms_conditions';
import CoursePage from '../containers/coursePage';
import { play, exit, ROUTE_LOOKUP } from '../animations';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    window.addEventListener('focus', (e) => {
      // console.log('focus changed - APP');
      // console.log(e.target);
    }, true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    window.removeEventListener('focus', e => console.log(e));
  }

  updateWindowDimensions() {
    console.log(`Detected window resize to w:${window.innerWidth} h:${window.innerHeight}`);
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {
    const sizeSufficient = process.env.NODE_ENV === 'development' ? true : (this.state.width >= minWidth && this.state.height >= minHeight);
    if (sizeSufficient) {
      return (
        <div>
          <BrowserRouter>
            <Route render={({ location }) => {
              // https://greensock.com/get-started/ -> animation library
              // https://greensock.com/scrollmagic/ -> scrolling library
              // https://css-tricks.com/animating-between-views-in-react/ -> animation on page change with GSAP and react
              const { pathname, key } = location;
              return (
                <div>
                  <div className="app-container">
                    <TransitionGroup component={null}>
                      <Transition
                        key={key}
                        appear
                        onEnter={(node, appears) => play(pathname, node, appears, this.props.authenticated)}
                        onExit={(node, appears) => exit(pathname, node, appears, this.props.authenticated)}
                        timeout={1000}
                      >
                        <Switch location={location}>
                          <Route exact path={ROUTE_LOOKUP.home.routeFull} component={this.props.authenticated ? DPlan : Landing} />
                          <Route path={ROUTE_LOOKUP.course.routeFull} component={CoursePage} />
                          <Route path={ROUTE_LOOKUP.professor.routeFull} component={Professor} />
                          {/* <Route path={ROUTE_LOOKUP.discover.routeFull} component={Cytoscape} /> */}
                          {/* <Route path="/plan/:id" component={DPlan} /> */}
                          <Route path={ROUTE_LOOKUP.credits.routeFull} component={Credits} />
                          <Route path={ROUTE_LOOKUP.verifyEmail.routeFull} component={VerifyEmail} />
                          <Route path={ROUTE_LOOKUP.resetPassword.routeFull} component={ResetPassword} />
                          <Route path={ROUTE_LOOKUP.forgotPassword.routeFull} component={ForgotPassword} />
                          <Route path={ROUTE_LOOKUP.tutorial.routeFull} component={this.props.authenticated ? Tutorial : Landing} />
                          <Route path={ROUTE_LOOKUP.termsAndConditions.routeFull} component={TermsAndConditions} />
                          <Route path={ROUTE_LOOKUP.privacyPolicy.routeFull} component={PrivacyPolicy} />
                          <Route component={FallBack} />
                        </Switch>
                      </Transition>
                    </TransitionGroup>
                  </div>
                </div>
              );
            }}
            />
          </BrowserRouter>
        </div>
      );
    } else {
      return (
        <TooSmall />
      );
    }
  }
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
});

// eslint-disable-next-line new-cap
export default connect(mapStateToProps, { setPressedKey, removePressedKey })(DragDropContext(HTML5Backend)(App));
