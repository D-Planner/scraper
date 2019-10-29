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
import Professor from '../containers/professor';
import Landing from './landing';
import FallBack from './fallBack';
import DPlan from '../containers/dplan';
import TooSmall from './tooSmall';
import Credits from './credits';
// import FlowChart from './flowchart';

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
      console.log('focus changed - APP');
      console.log(e.target);
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
    if (this.state.width >= 500 && this.state.height >= 700) {
      return (
        <div>
          <Router>
            <div>
              <div className="app-container">
                <Switch>
                  <Route exact path="/" component={requireAuth(Landing, DPlan)} />
                  <Route exact path="/courses" component={requireAuth(Courses)} />
                  {/* <Route path="/signup" component={signUp} />
                <Route path="/signin" component={signIn} /> */}
                  {/* <Route path="/plan/:id" component={DPlan} /> */}
                  {/* This Was Discoer */}
                  <Route path="/professors/:id" component={Professor} />
                  <Route path="/discover" component={Cytoscape} />
                  <Route path="/plan/:id" component={DPlan} />
                  <Route path="/credits" component={Credits} />
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
