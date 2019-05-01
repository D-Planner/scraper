// actions/index.js

export const ACTION_TYPES {
	HANDLE_ERROR: 'HANDLE_ERROR',
};
	
export function handleError(error) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.HANDLE_ERROR,
      message: error,
    });
  };
}

// And so let's say we want to display an error message when we have a duplicate ID or some other error from Mongo, we can do the following to call the new error action:
export function someFunction(params) {
  return (dispatch) => {
    axios.get('https://www.somewebsite.com/api/:endpoint').then((response) => {
      dispatch({ type: ActionTypes.YAY_HAPPY_MESSAGE, payload: response });
    }).catch((poop) => {
      dispatch(handleError(poop)); // poop is our error message lololololololol ok i'll stop ...
		// So now we're just going back to line 7 and triggering our error action which we can read in our reducer.
    });
  };
}

// assuming we're trying to read this when we have an error for plans, we can do the following in ./reducers/plans-reducer.js

const initialState = {
  error: null, // add this
};
	
const plansReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.HANDLE_ERROR:
      // so now if you want to console log the error on the front end you can do it here to see what you're passing in. try it with this:
      console.log(action.message); // you should see your error message in the browser now (i.e. on the front-end) lmk if this doesn't work
      return Object.assign({}, state, { error: action.message });
    default:
      return state;
  }
};

// ok swaggy we have error message in our state, now we just have to show it or rather show the poop lololololol ok im really done now sorry
// we now move to ./containers/dashboard/index.js (or wherever you want to log this in a front-end component)
// 1. import action
import { someFunction } from '../../actions';
	
	
// now all the way at the bottom get the error state and map to props
const mapStateToProps = state => ({
  error: state.plans.error,
});
	
// and the last line:
export default withRouter(connect(mapStateToProps, { someFunction })(Dashboard));
	
// ok now finally we should be able to see it. let's show no error when there's no eror, and show an error when we have an error.
// inside of the main render function with the "dashboard-container" class, add the following:
render() {
    return (
      <div className="dashboard-container">
        {this.props.error === null ? <p>no error</p> : <p>this.props.error</p>}
      </div>
    );
  }
// and you should be good to go!