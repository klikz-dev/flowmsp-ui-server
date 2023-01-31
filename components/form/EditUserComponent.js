import React from 'react';
import Form from './FormComponent';

class EditUserComponent extends React.Component {

  constructor(props) {
    super();
    this.state = {
      form: {
    	    id: props.user.id,
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        role: props.user.role
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

export default EditUserComponent;
