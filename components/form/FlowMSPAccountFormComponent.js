import React from 'react';
import Form from './FormComponent';

class FlowMSPAccountForm extends React.Component {

  constructor(props) {
    super();
    this.state = {
      form: {
        customerName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        termOfService: true
      }
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(form) {
	delete form.termOfService;
    this.props.handleFormSubmit(form);
  }

  render() {
    const formFields = [
      {
        id: 'customerName',
        name: 'customerName',
        type: 'text',
        label: 'Department',
        required: true
      },
      {
        id: 'address1',
        name: 'address1',
        type: 'text',
        label: 'Address 1',
        required: true
      },
      {
        id: 'address2',
        name: 'address2',
        type: 'text',
        label: 'Address 2',
        required: false
      },
      {
        id: 'city',
        name: 'city',
        type: 'text',
        label: 'City',
        required: true
      },
      {
        id: 'state',
        name: 'state',
        type: 'text',
        label: 'State',
        required: true
      },
      {
        id: 'zip',
        name: 'zip',
        type: 'text',
        label: 'Zip',
        required: true
      },
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
      },
      {
        id: 'email',
        name: 'email',
        type: 'email',
        label: 'Email',
        required: true
      },
      {
        id: 'password',
        name: 'password',
        type: 'password',
        label: 'Password',
        required: true
      },
      {
        id: 'confirmPassword',
        name: 'confirmPassword',
        type: 'password',
        label: 'Confirm Password',
        required: true,
        confirmPasswordCheck: true
      },
      {
          id: 'termOfService',
          name: 'termOfService',
          type: 'checkbox',
          labelType: 'jsx',
          label: {
        	     htmlTagType: 'link',
        	     preLinkText: 'I agree to the FlowMSP ',
        	     postLinkText: '',
        	     linkText: 'Terms of Service',
        	     href: '/Flow_Terms_of_Service_preplanning_database110317.pdf'
          },
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

export default FlowMSPAccountForm;
