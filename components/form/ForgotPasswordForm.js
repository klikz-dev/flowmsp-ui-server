import React from 'react';
import Form from './FormComponent';

class ForgotPasswordForm extends React.Component {

  constructor(props) {
    super();
    this.state = {
      form: {
        email: ''
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
        id: 'email',
        name: 'email',
        type: 'text',
        label: 'Enter your email id',
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

export default ForgotPasswordForm;
