import React from 'react';
import DialogWrapper from '../dialogWrapper';
import { GenEds } from '../../constants';

import './filters.scss';

class FilterDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      distribs: Object.values(GenEds).filter(e => (e.name !== 'W' && e.name !== 'CI' && e.name !== 'NW')).map((e) => { return (e.name: { name: e.name, checked: false }); }),
      wcs: Object.values(GenEds).filter(e => (e.name === 'W' || e.name === 'CI' || e.name === 'NW')).map((e) => { return { name: e.name, checked: false }; }),
    };
  }

  changeState = (name) => {
    if (name === 'W' || name === 'CI' || name === 'NW') {
      this.setState(prevState => ({
        distribs: prevState.distribs,
      }));
    }
  }

  render() {
    console.log(this.state.choices);
    return (
      <DialogWrapper {...this.props}>
        <div className="filter-content">
          <div className="filter-distribs">
            {this.state.distribs.map((distrib) => {
              return (
                <div className="choice" key={distrib}>
                  <div className="choice-label">{distrib.name}</div>
                  <input className="choice-input" type="checkbox" checked={distrib.checked} />
                </div>
              );
            })}
          </div>
          <div className="filter-wcs">
            {this.state.wcs.map((wc) => {
              return (
                <div className="choice" key={wc}>
                  <div className="choice-label">{wc.name}</div>
                  <input className="choice-input" type="checkbox" checked={wc.checked} />
                </div>
              );
            })}
          </div>
          <div className="filter-next-term">
            <div className="choice">
              <div className="choice-label">Offered next term</div>
              <input className="choice-input" type="checkbox" />
            </div>
          </div>
        </div>
      </DialogWrapper>
    );
  }
}

export default FilterDialog;
