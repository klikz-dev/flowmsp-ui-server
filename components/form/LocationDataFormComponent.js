import React from 'react';
import Form from './FormComponent';

class LocationDataForm extends React.Component {

  constructor(props) {
    super();
    const formLocation = props.formLocation;
    this.state = {
      form: {
        locationId: formLocation.locationId,
        locationName: formLocation && formLocation.locationName ? formLocation.locationName : '',
        address1: formLocation && formLocation.address1 ? formLocation.address1 : '',
        city: formLocation && formLocation.city ? formLocation.city : '',
        state: formLocation && formLocation.state ? formLocation.state : '',
        zip: formLocation && formLocation.zip ? formLocation.zip : '',
        address2: formLocation && formLocation.address2 ? formLocation.address2 : '',
        storey: formLocation && formLocation.storey ? formLocation.storey : '',
        storeyBelow: formLocation && formLocation.storeyBelow ? formLocation.storeyBelow : '',
        lotNumber: formLocation && formLocation.lotNumber ? formLocation.lotNumber : '',
        roofArea: formLocation && formLocation.roofArea ? formLocation.roofArea : '',
        requiredFlow: formLocation && formLocation.requiredFlow ? formLocation.requiredFlow : '',
        action: formLocation.action,
      }
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  handleFormSubmit(form) {
    this.props.handleFormSubmit(form);
  }

  handleFormChange(form) {
	    this.props.handleFormChange(form);
  }
  
  render() {
    const formFields = [
      {
    	label: 'Business',
        id: 'locationName',
        name: 'locationName',
        type: 'text',
        placeholder: ''
      },
      {
    	label: 'Address 1',
        id: 'address1',
        name: 'address1',
        type: 'text',
        placeholder: ''
      },
      {
    	label: 'Address 2',
        id: 'address2',
        name: 'address2',
        type: 'text',
        placeholder: ''
      },
      {
    	label: 'City',
        id: 'city',
        name: 'city',
        type: 'text',
        placeholder: ''
      },
      {
        label: 'State',
        id: 'state',
        name: 'state',
        type: 'text',
        placeholder: ''
      },
      {
    	label: 'Zip',
        id: 'zip',
        name: 'zip',
        type: 'text',
        placeholder: ''
      },
      {
      	label: 'Lot Number',
        id: 'lotNumber',
        name: 'lotNumber',
        type: 'text',
        placeholder: ''
      },
      {
    	label: 'Floors Above',
        id: 'storey',
        name: 'storey',
        type: 'select',
        options: [
                    {
                      'key': 'Select Number of Floors Above',
                      'value': ''
                    },
                    {
                      'key': '1',
                      'value': '1'
                    },
                    {
                      'key': '2',
                      'value': '2'
                    },
                    {
                      'key': '3',
                      'value': '3'
                    },
                    {
                      'key': '4',
                      'value': '4'
                    },
                    {
                      'key': '5',
                      'value': '5'
                    },
                    {
                      'key': '6',
                      'value': '6'
                    },
                    {
                      'key': '7',
                      'value': '7'
                    },
                    {
                      'key': '8',
                      'value': '8'
                    },
                    {
                      'key': '9',
                      'value': '9'
                    },
                    {
                      'key': '10',
                      'value': '10'
                    },
                    {
                      'key': '11',
                      'value': '11'
                    },
                    {
                      'key': '12',
                      'value': '12'
                    },
                    {
                      'key': '13',
                      'value': '13'
                    },
                    {
                      'key': '14',
                      'value': '14'
                    },
                    {
                      'key': '15',
                      'value': '15'
                    },
                    {
                      'key': '16',
                      'value': '16'
                    },
                    {
                      'key': '17',
                      'value': '17'
                    },
                    {
                      'key': '18',
                      'value': '18'
                    },
                    {
                      'key': '19',
                      'value': '19'
                    },
                    {
                      'key': '20',
                      'value': '20'
                    },
                    {
                      'key': '21',
                      'value': '21'
                    },
                    {
                      'key': '22',
                      'value': '22'
                    },
                    {
                      'key': '23',
                      'value': '23'
                    },
                    {
                      'key': '24',
                      'value': '24'
                    },
                    {
                      'key': '25',
                      'value': '25'
                    },
                    {
                      'key': '26',
                      'value': '26'
                    },
                    {
                      'key': '27',
                      'value': '27'
                    },
                    {
                      'key': '28',
                      'value': '28'
                    },
                    {
                      'key': '29',
                      'value': '29'
                    },
                    {
                      'key': '30',
                      'value': '30'
                    }
                 ],
        required: false
      },
      {
      	label: 'Floors Below',
          id: 'storeyBelow',
          name: 'storeyBelow',
          type: 'select',
          options: [
                      {
                        'key': 'Select Number of Floors Below',
                        'value': ''
                      },
                      {
                        'key': '1',
                        'value': '1'
                      },
                      {
                        'key': '2',
                        'value': '2'
                      },
                      {
                        'key': '3',
                        'value': '3'
                      },
                      {
                        'key': '4',
                        'value': '4'
                      },
                      {
                        'key': '5',
                        'value': '5'
                      },
                      {
                        'key': '6',
                        'value': '6'
                      },
                      {
                        'key': '7',
                        'value': '7'
                      },
                      {
                        'key': '8',
                        'value': '8'
                      },
                      {
                        'key': '9',
                        'value': '9'
                      },
                      {
                        'key': '10',
                        'value': '10'
                      },
                      {
                        'key': '11',
                        'value': '11'
                      },
                      {
                        'key': '12',
                        'value': '12'
                      },
                      {
                        'key': '13',
                        'value': '13'
                      },
                      {
                        'key': '14',
                        'value': '14'
                      },
                      {
                        'key': '15',
                        'value': '15'
                      },
                      {
                        'key': '16',
                        'value': '16'
                      },
                      {
                        'key': '17',
                        'value': '17'
                      },
                      {
                        'key': '18',
                        'value': '18'
                      },
                      {
                        'key': '19',
                        'value': '19'
                      },
                      {
                        'key': '20',
                        'value': '20'
                      },
                      {
                        'key': '21',
                        'value': '21'
                      },
                      {
                        'key': '22',
                        'value': '22'
                      },
                      {
                        'key': '23',
                        'value': '23'
                      },
                      {
                        'key': '24',
                        'value': '24'
                      },
                      {
                        'key': '25',
                        'value': '25'
                      },
                      {
                        'key': '26',
                        'value': '26'
                      },
                      {
                        'key': '27',
                        'value': '27'
                      },
                      {
                        'key': '28',
                        'value': '28'
                      },
                      {
                        'key': '29',
                        'value': '29'
                      },
                      {
                        'key': '30',
                        'value': '30'
                      }
                   ],
          required: false
        },
      {
    	label: 'Roof Area',
        id: 'roofArea',
        name: 'roofArea',
        type: 'number',
        placeholder: ''
      },
      {
    	label: 'Required Flow',
        id: 'requiredFlow',
        name: 'requiredFlow',
        type: 'number',
        placeholder: ''
      }
    ];
    return (<Form {...{form: this.state.form,
                      handleFormSubmit: this.handleFormSubmit,
                      handleFormChange: this.handleFormChange,
                      formFields: formFields,
                      showCancelButton: true,
                      onCancel: this.props.onCancel
                  }}
            />);
  }

}

export default LocationDataForm;
