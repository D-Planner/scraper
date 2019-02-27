import React from 'react';
import { Heading, Text, Pane } from 'evergreen-ui';
import {} from 'reactstrap';
import '../style/departments.css';

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
      <Pane className="row" style={{ width: '1200px' }}>
        {this.state.dptGroups.map((group) => {
          return (
            <Pane
              id="dptGroup"
            >
              <Pane id="dpt">
                <Text className="row" id="dptTitle">
                  {group.category}
                </Text>
                {group.departments.map((dpt) => {
                  return (
                    <Text id="dptText"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      {dpt}
                    </Text>
                  );
                })}
              </Pane>
            </Pane>
          );
        })}
      </Pane>
    );
  }

  render() {
    return (
      <div style={{
        marginTop: '20vh',
        marginBottom: '20vh',
      }}
      >
        <Heading id="title" size={800} marginTop="default">
      DEPARTMENTS
        </Heading>
        <hr />
        <Text id="sub">Pinned</Text>
        {this.department()}
      </div>
    );
  }
}