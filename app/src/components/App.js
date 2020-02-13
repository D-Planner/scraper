import React, { Component } from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import { DragDropContext } from 'react-dnd';
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';

import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';
import { setPressedKey, removePressedKey } from '../actions';
import Cytoscape from './Cytoscape';
import requireAuth from '../containers/requireAuth';
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
import { universalMetaTitle, errorLogging } from '../constants';

import favicon from '../favicon.png';

// https://levelup.gitconnected.com/using-google-analytics-with-react-3d98d709399b
// https://medium.com/google-cloud/tracking-site-visits-on-react-app-hosted-in-google-cloud-using-google-analytics-f49c2411d398
// https://support.google.com/analytics/answer/3123662?hl=en
const trackingID = 'UA-137867566-1';
ReactGA.initialize(trackingID);

// Update id on non-login auth
const history = createBrowserHistory();
ReactGA.pageview(window.location.pathname);
history.listen((location) => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

// User ID information
// https://support.google.com/analytics/answer/3123666

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
    if (false) console.log(favicon === 1);
    errorLogging('screen', { width: this.state.width, height: this.state.height, sufficient: sizeSufficient });
    if (true) {
      return (
        <div>
          <Router history={history}>
            <div>
              <div className="app-container">
                <Helmet>
                  <meta name="copyright" content={`Copyright of D-Planner Project, ${new Date().getFullYear()}`} />
                  <meta name="description" content="D-Planner is an academic planning suite that curates academic data to allow students to take advantage of all of their academic opportunities in higher education." />
                  <title>{universalMetaTitle}</title>
                  <link rel="icon" type="image/png" href="../favicon.png" sizes="16x16" />
                </Helmet>
                <Switch>
                  <Route exact path="/" component={requireAuth(Landing, DPlan)} />
                  <Route path="/tutorial/:page" component={requireAuth(Landing, Tutorial)} />
                  <Route path="/course/:id" component={CoursePage} />
                  <Route path="/professors/:id" component={Professor} />
                  <Route path="/discover" component={Cytoscape} />
                  <Route path="/plan/:id" component={DPlan} />
                  <Route path="/credits" component={Credits} />
                  <Route path="/email/:key" component={VerifyEmail} />
                  <Route path="/pass/:key" component={ResetPassword} />
                  <Route path="/reset/pass" component={ForgotPassword} />
                  <Route path="/policies/termsandconditions" component={TermsAndConditions} />
                  <Route path="/policies/privacypolicy" component={PrivacyPolicy} />
                  <Route component={FallBack} />
                </Switch>
              </div>
            </div>
          </Router>
        </div>
      );
    } else {
      return (
        <Router>
          <TooSmall />
        </Router>
      );
    }
  }
}

// eslint-disable-next-line new-cap
export default connect(null, { setPressedKey, removePressedKey })(DragDropContext(HTML5Backend)(App));
