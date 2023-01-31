import React from 'react';
import Form from './FormComponent';

class EditMyProfileComponent extends React.Component {

  constructor(props) {
    super();
    this.state = {
      form: {
        firstName: props.user.firstName,
        lastName: props.user.lastName
      }
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(form) {
    this.props.handleFormSubmit(form);
  }

  render() {
    const formFields = [
      {
        id: 'firstName',
        name: 'firstName',
        type: 'text',
        label: 'First Name',
        required: true
      },
      {
        id: 'lastName',
        name: 'lastName',
        type: 'text',
        label: 'Last Name',
        required: true
      }
    ];
    return (<Form {...{form: this.state.form,
                      handleFormSubmit: this.handleFormSubmit,
                      formFields: formFields,
                      errorMessage: this.props.errorMessage,
                      isFormSubmitting: this.props.isFormSubmitting
                  }}
            />);
  }

}

export default EditMyProfileComponent;
