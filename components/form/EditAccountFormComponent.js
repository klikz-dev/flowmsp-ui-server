import React from 'react';
import Form from './FormComponent';
import moment from 'moment';
import timezone from 'moment-timezone';

class EditAccountFormComponent extends React.Component {

  constructor(props) {
    super();
    const timeZonesAmerica = moment.tz.names().filter(name => name.includes('America') && !name.includes('America/Argentina/'));
    const timeZonesList = [];
    for (let ii = 0; ii < timeZonesAmerica.length; ii++) {
    	timeZonesList.push({key: timeZonesAmerica[ii], value: timeZonesAmerica[ii]});
    }
    
    this.state = {
      form: {
        name: props.customer.name,
        address1: props.customer.address1,
        address2: props.customer.address2,
        city: props.customer.city,
        state: props.customer.state,
        zip: props.customer.zip,
        timeZone: props.customer.timeZone
      },
      timeZonesList: timeZonesList
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(form) {
    this.props.handleFormSubmit(form);
  }

  render() {
    const formFields = [
      {
        id: 'customerName',
        name: 'name',
        type: 'text',
        label: 'Company Name',
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
          id: 'timeZone',
          name: 'timeZone',
          type: 'select',
          label: 'Timezone',
          options: this.state.timeZonesList,
          required: false
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

export default EditAccountFormComponent;
