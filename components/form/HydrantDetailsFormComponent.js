import React from 'react';
import Form from './FormComponent';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class HydrantDetailsForm extends React.Component {

  constructor(props) {
    super();
    const hydrant = props.hydrant;
    this.state = {
      form: {
        id: hydrant.id,
        lat: hydrant && hydrant.latLng ? hydrant.latLng.lat : '',
        lng: hydrant && hydrant.latLng ? hydrant.latLng.lng : '',
        address: hydrant && hydrant.address ? hydrant.address : '',
        flow: hydrant && hydrant.flow ? Number(hydrant.flow) : '',
        size: hydrant && hydrant.size ? Number(hydrant.size) : '',
        description: hydrant && hydrant.description ? hydrant.description : '',
        inService: hydrant && hydrant.inService === false ? false : true,
        dryHydrant: hydrant && hydrant.dryHydrant ? hydrant.dryHydrant : false,
        outServiceDate: hydrant && hydrant.inService === false && hydrant.outServiceDate ? moment(hydrant.outServiceDate) : null,
        action: props.action
      }
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  handleFormSubmit(form) {
    this.props.handleFormSubmit(form);
  }

  handleFormChange(form) {
  	this.setState({
  		form: form
  	});
  	if (this.props.handleFormChange) {
  		this.props.handleFormChange(form);	
  	}
  }
  
  render() {
	    const formFields = [
	        {
	          name: 'lat',
	          type: 'static',
	          label: 'Latitude'
	        },
	        {
	          name: 'lng',
	          type: 'static',
	          label: 'Longitude'
	        },
	        {
	          id: 'address',
	          name: 'address',
	          type: 'text',
	          label: 'Address'
	        },
	        {
	          id: 'flow',
	          name: 'flow',
	          type: 'number',
	          label: 'Flow',
	          min: 0
	        },
	        {
	          id: 'size',
	          name: 'size',
	          type: 'number',
	          label: 'Size',
	          min: 0
	        },
	        {
	          id: 'description',
	          name: 'description',
	          type: 'text',
	          label: 'Description'
	        },
	        {
	            id: 'dryHydrant',
	            name: 'dryHydrant',
	            type: 'select',
	            label: 'Dry Hydrant',
	            options: [
	          	  {
	                    'key': 'No',
	                    'value': false
	                },
	                {
	                    'key': 'Yes',
	                    'value': true
	                }          
	            ]
	        },
	        {
	            id: 'inService',
	            name: 'inService',
	            type: 'select',
	            label: 'In Service',
	            options: [
	          	  {
	                   'key': 'Yes',
	                   'value': true
	                },
	                {
	                  'key': 'No',
	                  'value': false
	                }              
	            ]
	        }
	      ];
	    if (this.state.form.inService === false || this.state.form.inService === 'false') {
	    	formFields.push({
	          id: 'outServiceDate',
	          name: 'outServiceDate',
	          type: 'datefree',
	          label: 'Out of Service Date',
	          required: true
	        });
	    }
	    return (<Form {...{form: this.state.form,
            handleFormSubmit: this.handleFormSubmit,
            handleFormChange: this.handleFormChange,
            formFields: formFields
        }}
	    />);
  }

}

export default HydrantDetailsForm;
