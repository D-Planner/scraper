import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import { DragDropContext } from 'react-dnd';

import HTML5Backend from 'react-dnd-html5-backend';
import Courses from '../containers/courses';
import Cytoscape from './Cytoscape';
import requireAuth from '../containers/requireAuth';
import Professor from '../containers/professor';
import Landing from './landing';
import FallBack from './fallBack';
import DPlan from '../containers/dplan';
import Tutorial from './tutorial';
// import FlowChart from './flowchart';


const App = (props) => {
  if (window.innerWidth >= 500) {
    return (
      <div>
        <Router>
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
              <Route path="/tutorial" component={Tutorial} />
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
