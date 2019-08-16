import React from 'react';
import './plans.scss';


/** displays information on a user's plans and allows them to select one */
const Plans = ({
  plans, showDialog, goToPlan, active,
}) => {
  return (
    <div className="plans">
      {plans.map((plan) => {
        return (
          <div role="presentation" onClick={() => goToPlan(plan.id)} key={plan.id} className="plan">
            <p className="plan-letter">{renderPlanName(plan.name, active)}</p>
          </div>
        );
      })}
      {renderNewPlanButton(showDialog)}
    </div>
  );
};

const renderPlanName = (planName, whetherActive) => {
  if (whetherActive) {
    if (planName.length > 20) {
      return `${planName.substring(0, 16)}...`;
    } else {
      return planName;
    }
  } else {
    return planName.substring(0, 1);
  }
};

const renderNewPlanButton = (fn) => {
  return (
    <button id="newPlanButton" type="button" onClick={fn}>
      <p>+</p>
    </button>
  );
};

export default Plans;
