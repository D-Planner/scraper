import React from 'react';
import classNames from 'classnames';

import './LikelyTerms.scss';

const LikelyTerms = (props) => {
  if (!props.terms) return <></>;

  const terms = ['F', 'W', 'S', 'X'];
  return (
    <div className="likely-terms">
      {
        terms.map((term) => {
          return (
            <div className={classNames({ likely: (props.terms && props.terms.length && props.terms.includes(term)), 'single-term': true })} key={term}>{term}</div>
          );
        })
      }
    </div>
  );
};

export default LikelyTerms;
