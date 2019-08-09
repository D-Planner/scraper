import React from 'react';
import noPlan from '../../style/no-plan.png';
import './plans.scss';
import Nav from '../../containers/nav';


/** displays information on a user's plans and allows them to select one */
const Plans = ({
  plans, showDialog, deletePlan, goToPlan,
}) => {
  return (
    <>
      <div className="plans">
        <div className="plans-header">
          <h1 className="table-header">My Plans</h1>
          {plans.length ? renderNewPlanButton(showDialog) : <div />}
        </div>
        {
    plans.length === 0
      ? (
        <div className="no-plans">
          <img src={noPlan} alt="" />
          <p>Oh no! Looks like you don’t have any plans yet. Click below to get started with your first plan.</p>
          {renderNewPlanButton(showDialog)}
        </div>
      )
      : (
        <div className="plans-content">
          {plans.map((plan) => {
            return (
              <div role="presentation" onClick={() => goToPlan(plan.id)} key={plan.id} className="plan-container">
                <p className="plan-name">{plan.name}</p>
                <div className="delete-button-container">
                  <button type="button" value={plan.id} onClick={e => deletePlan(e, plan.id)}>Delete Plan</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </>
  );
};

const renderNewPlanButton = (fn) => {
  return (
    <button id="newPlanButton" type="button" onClick={fn}>
      <p>New Plan</p>
    </button>
  );
};

export default Plans;
