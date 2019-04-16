import React from 'react';
import './departments.scss';

// We should move this to our API
const test = [{
  category: 'Arts & Humanities',
  departments: ['Art History', 'Classics', 'English and Creative Writing',
    'Film and Media Studies'],
}, {
  category: 'Interdisciplinary Programs',
  departments: ['African and African American Studies', 'Asian Societies, Cultures and Languages',
    'Cognitive Science',
    'Environmental Studies'],
}, {
  category: 'Sciences',
  departments: ['Biological Sciences', 'Chemistry', 'Computer Science',
    'Earth Sciences'],
}, {
  category: 'Social Sciences',
  departments: ['Anthropology', 'Economics', 'Education',
    'Geography'],
}, {
  category: 'Social Sciences',
  departments: ['Anthropology', 'Economics', 'Education',
    'Geography'],
}, {
  category: 'Social Sciences',
  departments: ['Anthropology', 'Economics', 'Education',
    'Geography'],
}, {
  category: 'Interdisciplinary Programs',
  departments: ['African and African American Studies', 'Asian Societies, Cultures and Languages',
    'Cognitive Science',
    'Environmental Studies'],
}, {
  category: 'Sciences',
  departments: ['Biological Sciences', 'Chemistry', 'Computer Science',
    'Earth Sciences'],
}, {
  category: 'Social Sciences',
  departments: ['Anthropology', 'Economics', 'Education',
    'Geography'],
}, {
  category: 'Social Sciences',
  departments: ['Anthropology', 'Economics', 'Education',
    'Geography'],
}, {
  category: 'Interdisciplinary Programs',
  departments: ['African and African American Studies', 'Asian Societies, Cultures and Languages',
    'Cognitive Science',
    'Environmental Studies'],
}, {
  category: 'Sciences',
  departments: ['Biological Sciences', 'Chemistry', 'Computer Science',
    'Earth Sciences'],
}, {
  category: 'Social Sciences',
  departments: ['Anthropology', 'Economics', 'Education',
    'Geography'],
}, {
  category: 'Social Sciences',
  departments: ['Anthropology', 'Economics', 'Education',
    'Geography'],
}];

export default class Departments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dptGroups: test,
    };
  }

  department() {
    return (
      <div className="row">
        {this.state.dptGroups.map((group) => {
          return (
            <div id="dptGroup">
              <div id="dpt">
                <p className="row" id="dptTitle">
                  {group.category}
                </p>
                {group.departments.map((dpt) => {
                  return (
                    <p id="dptText">{dpt}</p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <h1 id="title">
      DEPARTMENTS
        </h1>
        <hr />
        <p id="sub">Pinned</p>
        {this.department()}
      </div>
    );
  }
}
