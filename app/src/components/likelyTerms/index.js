import React from 'react';
import classNames from 'classnames';

const LikelyTerms = (props) => {
  const terms = ['F', 'W', 'S', 'X'];
  return (
    <>
      <div className="terms">
        {
            terms.map((term) => {
              return (
                <div className={classNames({ likely: (props.terms.length && props.terms.includes(term)) })} key={term}>{term}</div>
              );
            })
          }
      </div>
    </>
  );
};

export default LikelyTerms;
