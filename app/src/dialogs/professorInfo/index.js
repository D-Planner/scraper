import React, { Component } from 'react';
import DialogWrapper from '../dialogWrapper';

class ProfessorInfoDialog extends Component {
  professorInfo = (professor) => {
    console.log(professor);
    return (
      <div>
        {professor.name}
        {
          professor.reviews.reduce((review, acc) => {
            acc[review.term].push(review.review);
            return acc;
          }, {})
        }
      </div>
    );
  }

  render() {
    return (
      <DialogWrapper {...this.props}>
        {this.professorInfo(this.props.data, this.props.nextTerm)}
      </DialogWrapper>
    );
  }
}


export default ProfessorInfoDialog;
