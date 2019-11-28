import React from 'react';
import './plans.scss';

/**
 * Displays all the user's plans and allows them to create a new plan.
 * @param {*} param0
 */
const Plans = ({
  plans, currentPlan, showDialog, goToPlan, active,
}) => {
  const maxedPlans = (plans.length >= 10);
  return (
    <div className="plans">
      {plans.map((plan) => {
        if (currentPlan && plan.id === currentPlan.id) { // this condition will highlight the current plan with a CSS border
          return (
            <div role="presentation" onClick={() => checkGoToPlan(plan, currentPlan, goToPlan)} key={plan.id} className="plan current">
              <p className="plan-letter">{renderPlanName(plan.name, active)}</p>
            </div>
          );
        } else {
          return (
            <div role="presentation" onClick={() => checkGoToPlan(plan, currentPlan, goToPlan)} key={plan.id} className="plan">
              <p className="plan-letter">{renderPlanName(plan.name, active)}</p>
            </div>
          );
        }
      })}
      {renderNewPlanButton(showDialog, active, maxedPlans)}
    </div>
  );
};

/**
 * Checks if the current plan is clicked again, stops execution of goToPlan() if so
 * @param {*} planName
 * @param {*} currentPlan
 * @param {*} goToPlan
 */
const checkGoToPlan = (plan, currentPlan, goToPlan) => {
  console.log('check go to plan');
  if (!currentPlan || plan.id !== currentPlan.id) { // Check that no plan is specified or that current isn't selected
    console.log('go to plan');
    goToPlan(plan.id);
  }
};

/**
 * Renders the plan name box depending on whether the user is hovering on the menu.
 * @param {String} planName
 * @param {Boolean} whetherActive
 */
const renderPlanName = (planName, whetherActive) => {
  if (whetherActive) {
    if (planName.length > 16) {
      return `${planName.substring(0, 16)}...`;
    } else {
      return planName;
    }
  } else {
    return planName.substring(0, 1);
  }
};

/**
 * Renders the new plan button depending on whether the user is hovering over the menu and whether the user has reached the maximum number of plans.
 * @param {Object} showDialog
 * @param {Boolean} whetherActive
 * @param {Boolean} maxedPlans
 */
const renderNewPlanButton = (showDialog, whetherActive, maxedPlans) => {
  if (maxedPlans) {
    if (whetherActive) {
      return (
        <div id="noMorePlans">
          <p>Max of 10 Plans</p>
        </div>
      );
    } else {
      return (
        <div id="noMorePlans" />
      );
    }
  } else if (whetherActive) {
    return (
      <button id="newPlanButton" type="button" onClick={showDialog}>
        <p>+ New Plan</p>
      </button>
    );
  } else {
    return (
      <button id="newPlanButton" type="button" onClick={showDialog}>
        <p>+</p>
      </button>
    );
  }
};

export default Plans;
