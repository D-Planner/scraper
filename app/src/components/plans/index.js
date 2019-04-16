import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import noPlan from '../../style/no-plan.png';
import './plans.scss';

const Plans = ({ plans, showModal, deletePlan }) => {
  return (
    <div className="plans">
      <div className="plans-header">
        <h1 className="table-header">My Plans</h1>
        {plans.length ? renderNewPlanButton(showModal) : <div />}
      </div>
      {
    plans.length === 0
      ? (
        <div className="no-plans">
          <img src={noPlan} alt="" />
          <p>Oh no! Looks like you don’t have any plans yet. Click below to get started with your first plan.</p>
          {renderNewPlanButton(showModal)}
        </div>
      )
      : (
        <div className="plans-content">
          {plans.map((plan) => {
            return (
              <Link to={`/plan/${plan.id}`} key={plan.id} className="plan-container">
                <p className="plan-name">{plan.name}</p>
                <div className="delete-button-container">
                  <button type="button" value={plan.id} onClick={deletePlan}>Delete Plan</button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const renderNewPlanButton = (fn) => {
  return (
    <button id="newPlanButton" type="button" onClick={fn}>
      <p>New Plan</p>
    </button>
  );
};

export default withRouter(Plans);
