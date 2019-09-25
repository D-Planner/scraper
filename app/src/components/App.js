
// Fix this

import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import { DragDropContext } from 'react-dnd';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';

import HTML5Backend from 'react-dnd-html5-backend';
import Courses from '../containers/courses';
import Cytoscape from './Cytoscape';
import requireAuth from '../containers/requireAuth';
import Professor from '../containers/professor';
import Landing from './landing';
import FallBack from './fallBack';
import DPlan from '../containers/dplan';
// import FlowChart from './flowchart';

// https://levelup.gitconnected.com/using-google-analytics-with-react-3d98d709399b
// https://medium.com/google-cloud/tracking-site-visits-on-react-app-hosted-in-google-cloud-using-google-analytics-f49c2411d398
const trackingID = 'UA-137867566-1';
ReactGA.initialize(trackingID);
ReactGA.set({
  userId: 123, // Change this accordingly
  // Add any data that we want to track here
  // Add trackers on all pages
  // https://github.com/react-ga/react-ga/issues/122
});

const history = createBrowserHistory();
history.listen((location) => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

const App = (props) => {
  if (window.innerWidth >= 500) {
    return (
      <div>
        <Router history={history}>
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
