import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import { DragDropContext } from 'react-dnd';
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';

import HTML5Backend from 'react-dnd-html5-backend';
import Courses from '../containers/courses';
import Cytoscape from './Cytoscape';
import requireAuth from '../containers/requireAuth';
import Professor from '../containers/professor';
import Landing from './landing';
import FallBack from './fallBack';
import DPlan from '../containers/dplan';
import withTracker from '../containers/withTracker';
// import favicon from '../style/d-planner.ico';
// import favicon from '../style/favicon.ico';
// import FlowChart from './flowchart';

// https://levelup.gitconnected.com/using-google-analytics-with-react-3d98d709399b
// https://medium.com/google-cloud/tracking-site-visits-on-react-app-hosted-in-google-cloud-using-google-analytics-f49c2411d398
const trackingID = 'UA-137867566-1';
ReactGA.initialize(trackingID);
ReactGA.set({
  userId: 123, // Change this accordingly
  // Add any data that we want to track here
  // Add trackers on all pages
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
            <Helmet>
              <meta name="copyright" content="Copyright of D-Planner Project, 2019" />
              <meta name="description" content="" />
              <meta name="keywords" content="" />
              <link rel="icon" href="favicon.ico" type="image/x-icon" />
              <title>D-Planner - The Future of Academic Planning</title>
            </Helmet>
            <Switch>
              <Route exact path="/" component={withTracker(requireAuth(Landing, DPlan))} />
              <Route exact path="/courses" component={withTracker(requireAuth(Courses))} />
              {/* <Route path="/signup" component={signUp} />
              <Route path="/signin" component={signIn} /> */}
              {/* <Route path="/plan/:id" component={DPlan} /> */}
              {/* This Was Discover */}
              <Route path="/professors/:id" component={Professor} />
              <Route path="/discover" component={withTracker(Cytoscape)} />
              <Route path="/plan/:id" component={withTracker(DPlan)} />
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
