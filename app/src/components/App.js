import React, { Component } from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';
import { setPressedKey, removePressedKey } from '../actions';
import Courses from '../containers/courses';
import Cytoscape from './Cytoscape';
import requireAuth from '../containers/requireAuth';
import setAuth from '../containers/setAuth';
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
import TermsAndConditions from './policies/terms_conditions';


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
    if (this.state.width >= minWidth && this.state.height >= minHeight) {
      return (
        <div>
          <Router>
            <div>
              <div className="app-container">
                <Switch>
                  <Route exact path="/" component={requireAuth(Landing, DPlan)} />
                  <Route exact path="/courses" component={requireAuth(Courses)} />
                  <Route path="/token" component={setAuth('/')} />
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
        <TooSmall />
      );
    }
  }
}

// eslint-disable-next-line new-cap
export default connect(null, { setPressedKey, removePressedKey })(DragDropContext(HTML5Backend)(App));
