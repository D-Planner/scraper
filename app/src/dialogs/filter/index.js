import React from 'react';
import { connect } from 'react-redux';
import DialogWrapper from '../dialogWrapper';
import './filters.scss';

class FilterDialog extends React.Component {
  constructor(props) {
    super(props);

    console.log('Offered next term', props.offered);

    this.state = {
      distribs: props.distribs,
      wcs: props.wcs,
      offered: props.offered,
    };
    console.log(this.state);
  }

  changeState = (i, name) => {
    this.setState((prevState) => {
      const temp = Object.assign([], prevState[name]);
      temp[i].checked = !temp[i].checked;
      return temp;
    }, () => {
    });

    // if (name === 'wc') {
    //   // eslint-disable-next-line react/no-access-state-in-setstate
    //   const temp = Object.assign([], this.state.wcs);
    //   temp[i].checked = !temp[i].checked;
    //   this.setState({
    //     wcs: temp,
    //   }, () => {
    //     console.log(this.props);
    //   });
    // } else if (name === 'distrib') {
    //   // eslint-disable-next-line react/no-access-state-in-setstate
    //   const temp = Object.assign([], this.state.distribs);
    //   temp[i].checked = !temp[i].checked;
    //   this.setState({
    //     distribs: temp,
    //   }, () => {
    //     console.log(this.props);
    //   });
    // } else {
    //   const temp = Object.assign([], this.state.offered);
    //   temp[i].checked = !temp[i].checked;
    //   this.setState(temp, () => {
    //     console.log(this.props);
    //   });
    // }
  }

  falttenedTerms = () => {
    const flattened = this.props.plan.terms.reduce((acc, term) => {
      acc = acc.concat(term);
      return acc;
    }, []);
    return flattened;
  }

  render() {
    return (
      <DialogWrapper {...this.props}>
        <div className="filter-content">
          <div className="filter-distribs filter-list">
            {this.state.distribs.map((distrib, i) => {
              return (
                <div className="choice" key={distrib.name}>
                  <div className="choice-label">{distrib.name}</div>
                  <input className="choice-input" type="checkbox" checked={distrib.checked} onChange={() => this.changeState(i, 'distribs')} />
                </div>
              );
            })}
          </div>
          <div className="filter-wcs filter-list">
            {this.state.wcs.map((wc, i) => {
              return (
                <div className="choice" key={wc.name}>
                  <div className="choice-label">{wc.name}</div>
                  <input className="choice-input" type="checkbox" checked={wc.checked} onChange={() => this.changeState(i, 'wcs')} />
                </div>
              );
            })}
          </div>
          <div className="filter-offered filter-list">
            {this.state.offered.map((offered) => {
              if (this.falttenedTerms()[offered.termIndex].name === `${this.props.currTerm.year}${this.props.currTerm.term}`) {
                return (
                  <div className="choice" key={offered.termIndex}>
                    <div className="choice-label">{`${this.props.currTerm.year}${this.props.currTerm.term}`}</div>
                    <input className="choice-input" type="checkbox" checked={offered.checked} onChange={() => this.changeState(offered.termIndex, 'offered')} />
                  </div>
                );
              } else return null;
            })}
          </div>
        </div>
      </DialogWrapper>
    );
  }
}

const mapStateToProps = state => ({
  distribs: state.filters.distribs,
  wcs: state.filters.wcs,
  offered: state.filters.offered,
  currTerm: state.time.currTerm,
  plan: state.plans.current,
});

export default connect(mapStateToProps, null)(FilterDialog);
