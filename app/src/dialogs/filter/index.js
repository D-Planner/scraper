import React from 'react';
import { connect } from 'react-redux';
import DialogWrapper from '../dialogWrapper';

import './filters.scss';

class FilterDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      distribs: this.props.distribs,
      wcs: this.props.wcs,
      offeredNextTerm: this.props.offeredNextTerm,
    };
  }

  changeState = (name) => {
    if (name === 'W' || name === 'CI' || name === 'NW') {
      const i = this.state.wcs.findIndex(e => e.name === name);
      // eslint-disable-next-line react/no-access-state-in-setstate
      const temp = Object.assign([], this.state.wcs);
      temp[i].checked = !temp[i].checked;
      this.setState({
        wcs: temp,
      });
    } else if (name !== 'offeredNextTerm') {
      const i = this.state.distribs.findIndex(e => e.name === name);
      // eslint-disable-next-line react/no-access-state-in-setstate
      const temp = Object.assign([], this.state.distribs);
      temp[i].checked = !temp[i].checked;
      this.setState({
        distribs: temp,
      });
    } else {
      this.setState(prevState => ({
        offeredNextTerm: !prevState.offeredNextTerm,
      }));
    }
  }

  render() {
    return (
      <DialogWrapper {...this.props}>
        <div className="filter-content">
          <div className="filter-distribs filter-list">
            {this.state.distribs.map((distrib) => {
              return (
                <div className="choice" key={distrib.name}>
                  <div className="choice-label">{distrib.name}</div>
                  <input className="choice-input" type="checkbox" checked={distrib.checked} onChange={() => this.changeState(distrib.name)} />
                </div>
              );
            })}
          </div>
          <div className="filter-wcs filter-list">
            {this.state.wcs.map((wc) => {
              return (
                <div className="choice" key={wc.name}>
                  <div className="choice-label">{wc.name}</div>
                  <input className="choice-input" type="checkbox" checked={wc.checked} onChange={() => this.changeState(wc.name)} />
                </div>
              );
            })}
          </div>
          <div className="filter-next-term">
            <div className="choice choice-next-term">
              <div className="choice-label">Offered {this.props.currTerm.year.toString()}{this.props.currTerm.term}</div>
              <input className="choice-input" type="checkbox" checked={this.state.offeredNextTerm} onChange={() => this.changeState('offeredNextTerm')} />
            </div>
          </div>
        </div>
      </DialogWrapper>
    );
  }
}

const mapStateToProps = state => ({
  distribs: state.filters.distribs,
  wcs: state.filters.wcs,
  offeredNextTerm: state.filters.offeredNextTerm,
  currTerm: state.time.currTerm,
});

export default connect(mapStateToProps, null)(FilterDialog);
