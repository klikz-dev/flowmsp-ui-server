import React from 'react';
import Form from '../form/FormComponent';
import { Grid, Row, Col } from 'react-bootstrap';

class PasswordResetComponent extends React.Component {
	
	  constructor(props) {
		    super(props);
		    this.state = {
		    	      form: {
		    	        email: '',
		    	        password: '',
		    	        confirmPassword: ''
		    	      }
		    	};
	  }
	  
	  onChange = (event) => {
		    const field = event.target.name;
		    const forms = this.state.form;
		    forms[field] = event.target.value;
		    return this.setState({form: forms});
	  }
	  
	  onSave = (form)  => {
          this.props.resetPassword(form);
      }
	  
	  render() {
		  const formFields = [
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
		        }
		    ];
		  
		    return (
		    		<Grid>
		    	        <Row className="show-grid">
		    	            <Col xs={6} md={6} xsOffset={3} >
		    	               <h3>Reset Password</h3>
		    	            </Col>
		    	        </Row>
		    	        <Row className="show-grid">
		    	            <Col xs={6} md={6} xsOffset={3}>
		    	                 <Form {...{form: this.state.form,
				                handleFormSubmit: this.onSave,
				                formFields: formFields,
				                errorMessage: '',
				                isFormSubmitting: this.props.isFormSubmitting
				               }}
			                 />
		    	            </Col>
	    	            </Row>
		    	     </Grid>
		    );
	  }
}

export default PasswordResetComponent;
