import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import { DragDropContext } from 'react-dnd';

import HTML5Backend from 'react-dnd-html5-backend';
import signUp from '../containers/signUp';
import signIn from '../containers/signIn';
// import Courses from '../containers/courses';
import Cytoscape from './Cytoscape';
import Dashboard from '../containers/dashboard';
import requireAuth from '../containers/requireAuth';
// import Discover from '../containers/discover';
import tooSmall from './tooSmall';
import Landing from './landing';
import FallBack from './fallBack';
import DPlan from '../containers/dplan';
// import FlowChart from './flowchart';


const App = (props) => {
  if (window.innerWidth >= 500) {
    return (
      <div>
        <Router>
          <div className="app-container">
            <Switch>
              <Route exact path="/" component={requireAuth(Landing, Dashboard)} />
              <Route path="/signup" component={signUp} />
              <Route path="/signin" component={signIn} />
              {/* This Was Discoer */}
              <Route path="/discover" component={Cytoscape} />
              <Route path="/plan/:id" component={DPlan} />
              <Route component={FallBack} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  } else {
    return (
      <tooSmall />
    );
  }
};

// eslint-disable-next-line new-cap
export default DragDropContext(HTML5Backend)(App);
