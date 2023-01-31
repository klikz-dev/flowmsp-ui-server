import React from 'react';
import Form from './FormComponent';

class AddUserFormComponent extends React.Component {

  constructor(props) {
    super();
    this.state = {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
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
      },
      {
        id: 'email',
        name: 'email',
        type: 'text',
        label: 'Email',
        required: true
      },
      {
          id: 'role',
          name: 'role',
          type: 'select',
          label: 'Role',
          options: [
      	    {
      	    		'key': 'Select Role',
      	    		'value': ''
 	        },
        	    {
        	    	   'key': 'USER',
        	    	   'value': 'USER'
        	    },
        	    {
     	    	   'key': 'PLANNER',
     	    	   'value': 'PLANNER'
     	    },
	    	    {
	  	    	   'key': 'ADMIN',
	  	    	   'value': 'ADMIN'
	  	    }
          ],
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

export default AddUserFormComponent;
