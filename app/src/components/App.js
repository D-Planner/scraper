import React, { Component } from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';
import { GlobalHotKeys, configure } from 'react-hotkeys';
import { setPressedKey, removePressedKey } from '../actions';
import Courses from '../containers/courses';
import Cytoscape from './Cytoscape';
import requireAuth from '../containers/requireAuth';
import Professor from '../containers/professor';
import Landing from './landing';
import FallBack from './fallBack';
import DPlan from '../containers/dplan';
import TooSmall from './tooSmall';
// import FlowChart from './flowchart';

// export const reservedKeys = {
//   PLAN_ONE: '1',
//   PLAN_TWO: '2',
//   PLAN_THREE: '3',
//   PLAN_FOUR: '4',
//   PLAN_FIVE: '5',
//   PLAN_SIX: '6',
//   PLAN_SEVEN: '7',
//   PLAN_EIGHT: '8',
//   PLAN_NINE: '9',
//   PLAN_TEN: '0',
//   OK: 'Enter',
//   CLOSE: 'Escape',
//   SAVE: 's',
//   OPEN_NEW_PLAN: 'n',
//   OPEN_DELETE_PLAN: 'd',
//   OPEN_SEARCH_PANE: 'q',
//   OPEN_REQUIREMENTS_PANE: 'r',
//   OPEN_BOOKMARKS_PANE: 'b',
// };


class App extends Component {
  // // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values for more
  // keyMap = {
  //   PLAN_ONE: 'Control+1',
  //   PLAN_TWO: 'Control+2',
  //   PLAN_THREE: 'Control+3',
  //   PLAN_FOUR: 'Control+4',
  //   PLAN_FIVE: 'Control+5',
  //   PLAN_SIX: 'Control+6',
  //   PLAN_SEVEN: 'Control+7',
  //   PLAN_EIGHT: 'Control+8',
  //   PLAN_NINE: 'Control+9',
  //   PLAN_TEN: 'Control+0',
  //   OK: 'Enter',
  //   CLOSE: 'Escape',
  //   SAVE: 'Control+s',
  //   OPEN_NEW_PLAN: 'Control+m',
  //   OPEN_DELETE_PLAN: 'Control+d',
  //   OPEN_SEARCH_PANE: 'Control+q',
  //   OPEN_REQUIREMENTS_PANE: 'Control+r',
  //   OPEN_BOOKMARKS_PANE: 'Control+b',
  // };

  // handlers = {
  //   PLAN_ONE: event => this.test(event),
  //   PLAN_TWO: null,
  //   PLAN_THREE: null,
  //   PLAN_FOUR: null,
  //   PLAN_FIVE: null,
  //   PLAN_SIX: null,
  //   PLAN_SEVEN: null,
  //   PLAN_EIGHT: null,
  //   PLAN_NINE: null,
  //   PLAN_TEN: null,
  //   OK: this.test,
  //   CLOSE: null,
  //   SAVE: event => this.test(event),
  //   OPEN_NEW_PLAN: event => this.test(event),
  //   OPEN_DELETE_PLAN: null,
  //   OPEN_SEARCH_PANE: event => console.log('search pane test'),
  //   OPEN_REQUIREMENTS_PANE: null,
  //   OPEN_BOOKMARKS_PANE: null,
  // };

  constructor(props) {
    super(props);
    this.state = {
      // pressedKey: '',
      // pressedModifier: '',
      width: 0,
      height: 0,
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  test(event) {
    event.preventDefault();
    console.log('test function');
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    //   document.addEventListener('DOMContentLoaded', () => {
    //     'use strict';

    //     document.addEventListener('keydown', (event) => {
    //       this.updatePressedKeys(event);
    //     });

    //     document.addEventListener('keyup', (event) => {
    //       this.props.removePressedKey(event.key);
    //       // console.log(event);

  //       // event.preventDefault();
  //       // event.stopPropagation();
  //     });
  //   });
  }

  componentWillUnmount() {
  //   document.removeEventListener('DOMContentLoaded');
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  // updatePressedKeys(event) {
  //   this.props.setPressedKey(event.key);
  //   if (event.key === 'Control' || event.key === 'Shift' || event.key === 'Alt') {
  //     // console.log('Pressed modifier...');
  //     this.setState({ pressedModifier: event.key });
  //   } else {
  //     // console.log('Pressed key...');
  //     this.setState({ pressedKey: event.key });
  //   }

  //   console.log('event');
  //   console.log(event);
  //   // console.log(`event.key: ${event.key}`);
  //   // console.log(`pressedKey: ${this.state.pressedKey}`);
  //   // console.log(`pressedModifier: ${this.state.pressedKey}`);

  //   if (this.state.pressedModifier === 'Control') {
  //     // console.log('control pressed...');
  //     const keys = Object.values(reservedKeys);
  //     for (let k = 0; k < Object.values(reservedKeys).length; k += 1) {
  //       // console.log(keys[k]);
  //       if (event.key === keys[k]) {
  //         // console.log(`'control' + '${event.key}' pressed, blocking...`);
  //         event.stopPropagation();
  //         event.preventDefault();
  //         break;
  //       }
  //     }

  //     event.preventDefault();
  //     event.stopPropagation();
  //   }
  // }

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
              {/* <GlobalHotKeys keyMap={this.keyMap} handlers={this.handlers}> */}
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
              {/* </GlobalHotKeys> */}
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

// const App = (props) => {
//   document.addEventListener('DOMContentLoaded', () => {
//     'use strict';

//     document.addEventListener('keydown', (event) => {
//       props.setPressedKey(event.key);
//       console.log(event.key);

//       // if (props.pressedModifier === 'Control') {
//       const keys = Object.values(reservedKeys);
//       for (let k = 0; k < Object.values(reservedKeys).length; k += 1) {
//         // console.log(keys[k]);
//         if (event.key === keys[k]) {
//           console.log(`'control' + '${event.key}' pressed, blocking...`);
//           event.stopPropagation();
//           event.preventDefault();
//           break;
//         }
//       // }
//       }

//       // event.preventDefault();
//       // event.stopPropagation();
//     });

//     document.addEventListener('keyup', (event) => {
//       props.removePressedKey(event.key);
//       console.log(event);

//       // event.preventDefault();
//       // event.stopPropagation();
//     });
//   });

//   if (window.innerWidth >= 500) {
//     return (
//       <div>
//         <Router>
//           <div className="app-container">
//             <Switch>
//               <Route exact path="/" component={requireAuth(Landing, DPlan)} />
//               <Route exact path="/courses" component={requireAuth(Courses)} />
//               {/* <Route path="/signup" component={signUp} />
//               <Route path="/signin" component={signIn} /> */}
//               {/* <Route path="/plan/:id" component={DPlan} /> */}
//               {/* This Was Discoer */}
//               <Route path="/professors/:id" component={Professor} />
//               <Route path="/discover" component={Cytoscape} />
//               <Route path="/plan/:id" component={DPlan} />
//               <Route component={FallBack} />
//             </Switch>
//           </div>
//         </Router>
//       </div>
//     );
//   } else {
//     return (
//       <tooSmall />
//     );
//   }
// };

const mapStateToProps = state => ({
  // pressedKey: state.keyEvent.pressedKey,
  // pressedModifier: state.keyEvent.pressedModifier,
});

// eslint-disable-next-line new-cap
export default connect(mapStateToProps, { setPressedKey, removePressedKey })(DragDropContext(HTML5Backend)(App));
