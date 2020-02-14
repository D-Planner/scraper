import React from 'react';
import { connect } from 'react-redux';
import ReactTags from 'react-tag-autocomplete';
import ReactTooltip from 'react-tooltip';
import DialogWrapper from '../dialogWrapper';
import {
  setFilters, clearFilters,
} from '../../actions';
import { GenEdsForDisplay as GenEds } from '../../constants';
import closeIcon from '../../style/close.svg';
import './filters.scss';

class FilterDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: {
        distribs: props.distribs.filter(d => d.checked),
        wcs: props.wcs.filter(wc => wc.checked),
      },
    };
  }

  changeState = (i, name) => {
    const temp = Object.assign({}, this.props.filters);
    temp[name][i].checked = !temp[name][i].checked;
    this.props.setFilters(temp);
    // this.setState((prevState) => {
    //   const temp = Object.assign([], prevState[name]);
    //   temp[i].checked = !temp[i].checked;
    //   return temp;
    // }, () => {
    // });
  }

  // falttenedTerms = () => {
  //   const flattened = this.props.plan.terms.reduce((acc, term) => {
  //     acc = acc.concat(term);
  //     return acc;
  //   }, []);
  //   return flattened;
  // }

  handleAdd = (e, type) => {
    this.setState((prevState) => {
      if (!prevState.tags[type].includes(e)) prevState.tags[type].push(e);
      return {
        [`tags${type}`]: prevState.tags[type],
      };
    }, () => ((!e.checked) ? this.changeState(e.id, type) : null));
  }

  handleDelete = (i, type) => {
    const removedTagId = this.props[type].findIndex(t => t.name === this.props.tags[type][i].name);
    this.setState((prevState) => {
      prevState.tags[type].splice(i, 1);
      return { [`tags${type}`]: prevState.tags[type] };
    }, () => this.changeState(removedTagId, type));
  }

  renderTag = (e) => {
    const { tag } = e.tag;
    return (
      <div key={e.tag.id}
        style={{
          display: 'flex',
        }}
        className="react-tag-element"
      >
        <img className="icon" src={GenEds[tag].icon} alt={`${tag} icon`} data-tip data-for={tag} />
        <ReactTooltip id={tag} place="right" type="dark" effect="float">{GenEds[tag].fullName}</ReactTooltip>
        <img src={closeIcon} alt="icon" onClick={e.onDelete} />
      </div>

    );
  }

  renderSuggestion = (e) => {
    const { tag } = e.item;
    return (
      <div key={e.item.id}>
        <img className="icon" src={GenEds[tag].icon} alt={`${tag} icon`} data-tip data-for={tag} />
        <ReactTooltip id={tag} place="right" type="dark" effect="float">{GenEds[tag].fullName}</ReactTooltip>
      </div>
    );
  }

  render() {
    return (
      <DialogWrapper {...this.props}>
        <div className="filter-content">
          <ReactTags
            tags={this.state.tags.distribs}
            suggestions={this.props.distribs}
            onAddition={e => this.handleAdd(e, 'distribs')}
            onDelete={i => this.handleDelete(i, 'distribs')}
            suggestionComponent={this.renderSuggestion}
            tagComponent={this.renderTag}
            placeholderText="Enter Distrib to Filter"
          />
          {/* <div className="filter-distribs filter-list">
            {this.props.distribs.map((distrib, i) => {
              return (
                <div className="choice" key={distrib.name}>
                  <div className="choice-label">{distrib.name}</div>
                  <input className="choice-input" type="checkbox" checked={distrib.checked} onChange={() => this.changeState(i, 'distribs')} />
                </div>
              );
            })}
          </div> */}
          <div className="filter-wcs filter-list">
            {/* <ReactTags
              tags={this.state.tags.wcs}
              suggestions={this.props.wcs}
              labelField="name"
              onAddition={e => this.handleAdd(e, 'wcs')}
              onDelete={i => this.handleDelete(i, 'wcs')}
              tagComponent={this.renderTag}
              suggestionComponent={this.renderSuggestion}
              placeholderText="Add New World Culture Filter"
            /> */}
            {this.props.wcs.map((wc, i) => {
              return (
                <div className="choice" key={wc.name}>
                  <div className="choice-label">
                    <ReactTooltip id={wc.name} place="right" type="dark" effect="float">{wc.fullName}</ReactTooltip>
                    <img className="icon" src={GenEds[wc.name].icon} alt={`${wc.name} icon`} data-tip data-for={wc.name} />
                  </div>
                  <input className="choice-input" type="checkbox" checked={wc.checked} onChange={() => this.changeState(i, 'wcs')} />
                </div>
              );
            })}
          </div>
          <div className="filter-offered filter-list">
            {this.props.offered.map((offered, i) => {
              const currentTermName = () => {
                switch (offered.term) {
                  case 'F': return 'Fall';
                  case 'W': return 'Winter';
                  case 'S': return 'Spring';
                  case 'X': return 'Summer';
                  default: return 'Next Term';
                }
              };
              const currentTerm = (offered.term === 'current');
              return (
                <div className="choice" key={i.toString()}>
                  <div className={`choice-label ${currentTerm ? 'bold' : ''}`}>{currentTermName()}</div>
                  <input className="choice-input" type="checkbox" checked={offered.checked} onChange={() => this.changeState(i, 'offered')} />
                </div>
              );
            })}
          </div>
        </div>
      </DialogWrapper>
    );
  }
}

const mapStateToProps = state => ({
  filters: state.filters,
  distribs: state.filters.distribs,
  wcs: state.filters.wcs,
  offered: state.filters.offered,
  currTerm: state.time.currTerm,
  plan: state.plans.current,
});

export default connect(mapStateToProps, {
  setFilters,
  clearFilters,
})(FilterDialog);
