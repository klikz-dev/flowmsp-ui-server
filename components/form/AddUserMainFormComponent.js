import React from 'react';
import Form from './FormComponent';

class AddUserMainFormComponent extends React.Component {

  constructor(props) {
    super();
    this.state = {
      form: {
        email: '',
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

export default AddUserMainFormComponent;
