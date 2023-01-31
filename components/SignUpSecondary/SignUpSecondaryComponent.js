import React from 'react';
import Form from '../form/FormComponent';
import {Col, Grid, Row} from 'react-bootstrap';

class SignUpSecondaryComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            form: {
                firstName: '',
                lastName: '',
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

    onSave = (form) => {
        this.props.submitSignUpSecondary(form);
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

        if (!this.props.isLoaded) return null;

        return (
            <Grid>
                <Row className="show-grid" visibility="hidden">
                    <Col xs={6} md={6} xsOffset={3}>
                        <h3>Sign Up</h3>
                    </Col>
                </Row>
                <Row className="show-grid">
                    <Col xs={6} md={6} xsOffset={3}>
                        <h3>{this.props.userEmail}</h3>
                    </Col>
                </Row>
                <Row className="show-grid">
                    <Col xs={6} md={6} xsOffset={3}>
                        <Form {...{
                            form: this.state.form,
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

export default SignUpSecondaryComponent;
