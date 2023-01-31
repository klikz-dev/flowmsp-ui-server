import React from 'react';
import Form from './FormComponent';

class ChangePasswordComponent extends React.Component {

  constructor(props) {
    super();
    this.state = {
      form: {
    	    currentPassword: '',
        password: '',
        confirmPassword: '',
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
          id: 'currentPassword',
          name: 'currentPassword',
          type: 'password',
          label: 'Current Password',
          required: true
      },
      {
        id: 'password',
        name: 'password',
        type: 'password',
        label: 'New Password',
        required: true
      },
      {
        id: 'confirmPassword',
        name: 'confirmPassword',
        type: 'password',
        label: 'Confirm New Password',
        required: true,
        confirmPasswordCheck: true
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
export default ChangePasswordComponent;
