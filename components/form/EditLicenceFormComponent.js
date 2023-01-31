import React from 'react';
import Form from './FormComponent';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class EditLicenceFormComponent extends React.Component {

  constructor(props) {
    super();
    this.state = {
      smsFormat: props.customer.smsFormat ? props.customer.smsFormat : '',
      emailFormat: props.customer.emailFormat ? props.customer.emailFormat : '',
      form: {
    	    id: props.customer.id,
    	    links: props.customer.links,
    	    license: props.customer.licenseType,
    	    expiryDate: props.customer.licenseExpirationTimestamp ? moment(props.customer.licenseExpirationTimestamp) : null,
    	    smsNumber: props.customer.smsNumber ? props.customer.smsNumber : '',
    	    smsFormat: props.customer.smsFormat ? props.customer.smsFormat : '',
    	    smsFormatExample: props.customer.smsFormat ? this.returnSMSExample(props.customer.smsFormat) : '',
    	    emailGateway: props.customer.emailGateway ? props.customer.emailGateway : '',
    	    emailFormat: props.customer.emailFormat ? props.customer.emailFormat : '',
    	    emailFormatExample: props.customer.emailFormat ? this.returnEmailExample(props.customer.emailFormat) : '',
    	    emailSignature: props.customer.emailSignature ? props.customer.emailSignature : '',
    	    emailSignatureLocation: props.customer.emailSignatureLocation ? props.customer.emailSignatureLocation : '',
    	    fromContains: props.customer.fromContains ? props.customer.fromContains : '',
    	    toContains: props.customer.toContains ? props.customer.toContains : '',
    	    subjectContains: props.customer.subjectContains ? props.customer.subjectContains : '',
    	    bodyContains: props.customer.bodyContains ? props.customer.bodyContains : '',
			fromNotContains: props.customer.fromNotContains ? props.customer.fromNotContains : '',
			toNotContains: props.customer.toNotContains ? props.customer.toNotContains : '',
			subjectNotContains: props.customer.subjectNotContains ? props.customer.subjectNotContains : '',
			bodyNotContains: props.customer.bodyNotContains ? props.customer.bodyNotContains : '',
    	    boundSWLat: props.customer.boundSWLat ? props.customer.boundSWLat : '',
    	    boundSWLon: props.customer.boundSWLon ? props.customer.boundSWLon : '',
    	    boundNELat: props.customer.boundNELat ? props.customer.boundNELat : '',
    	    boundNELon: props.customer.boundNELon ? props.customer.boundNELon : '',
      }
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  returnSMSExample(SMSFormat) {
	  if (SMSFormat === 'Standard') {
		  return 'FIRE:MUTAL AID <ADDRESS> TIME: <HH:MI> DATE: <MM/DD/YYYY>';
	  }
	  return '';
  }

  returnEmailExample(EmailFormat) {
	  if (EmailFormat === 'Standard') {
		  return 'CALL: FI - Fall Injury ADDR: <Address> CITY: Oak Forest UNITS: A39,E39';
	  } else if (EmailFormat === 'HRFD') {
		  return 'Subject-HRFD:<Address> (Fire) Msg-Fire Alarm';
	  } else if (EmailFormat === 'North Park') {
		  return 'Msg- STRUCTURE FIRE^<Date> ^UNIT:891^<Address>';
	  }else if (EmailFormat === 'Amboy') {
		  return '<Address> Line5=AMBOY Line11=MEDICAL Line12=LIFELINE-JAMES Line13=888-289-2018 <TimeStamp> <Incident>';
	  }else if (EmailFormat === 'Janesville') {
		  return '<TimeStamp> INCIDENT DETAILS..LOCATION:....INCIDENT:...';
	  } else if (EmailFormat === 'Kankakee') {
		  return 'ALARM:FIRE <Address>> <TimeStamp> [2018-00001685 KB143]';
	  } else if (EmailFormat === 'Romeoville') {
		  return 'PremierOne Notification Status:<> Location:<> Comments<>';
	  } else if (EmailFormat === 'Litchfield') {
		  return 'Subject-<Nothing> Msg-911:<Incident> LOCATION: <> COMMENTS: <>';
	  } else if (EmailFormat === 'Streator') {
		  return 'Subject-<Nothing> Msg-INCIDENT# LONG TERM CAD# ACTIVE CALL#  Nature <Nature> Address <Address>';
	  } else if (EmailFormat === 'Oak Lawn') {
		  return 'Subject-Text Message Msg-CAD:FYI: ;OLFD;NATURAL GAS LEAK INSIDE;KELLY NISSAN;4300 W 95TH ST;OAK LAWN;OL3;S11;2018152798;1805572;EN01,SQD1,BAT1,EN05';
	  } else if (EmailFormat === 'Hiplink') {
		  return 'LDFD FLD <<Incident>> DISP <<Address>> 6761 5851..';
	  } else if (EmailFormat === 'Carlinville') {
		  return 'DISPATCH:CA FD:CA FIRE - <<TimeStamp>> - CA  FD: <<Incident>> <<Address>> FD:<<Description>>';
	  } else if (EmailFormat === 'Hebron') {
		  return 'DISPATCH:F16, <<INCODEINET>> , <<ADDRESS1>>, BNT, btwn S 500 W and S 600 W, HF, LO6642 - From CADSRV <<DATE/TIME>>';
	  } else if (EmailFormat === 'Westmont') {
		  return 'Unit: M183-Address: <<ADDRESS>>-Info: <<INFO>>-Disp at: <<TIMESTAMP>>-CAD Call: FWM181207004031WM120718';
	  } else if (EmailFormat === 'TriState') {
		  return 'INC01 1.0 EV-XXX 0 FTS18122100520212 KINGERY QUARTER TS123IPSYCHIATRIC  M PSYCH EVAL IN PARKING LOT   IVY LN';
	  } else if (EmailFormat === 'Savoy') {
		  return 'REGULAR 2608 E ILLINOIS ST URT btwn MACARTHUR DR and SUNRISE DR RURF R0400 SHAUNDRELL BROWN RESD.';
	  } else if (EmailFormat === 'Crestwood') {
		  return '1/30/2019 12:21:30 AM 2390300273 <<ADDRESS>> MAP PAGE:22 SMELL OF GAS FIRST FLOOR KITCHEN';
	  } else if (EmailFormat === 'Boles') {
		  return '<GENERAL><ID>10243418<\ID><IncidentNumber>2019-00026164<\IncidentNumber>...<\GENERAL>';
	  } else if (EmailFormat === 'Ogle') {
		  return 'Notification from CIS IamSending:..';
	  } else if (EmailFormat === 'Belleville') {
		  return 'Belleville Police Department Event Report...';
	  } else if (EmailFormat === 'RockCom') {
		  return 'STILL/BATTERY VICTIM/PD ON SCENE maps.google.com/maps?q=823+EVANS+AVE+MACHESNEY+PARK+IL+61115 W SSE 4.9/6.6 T58 Mostly cloudy';
	  } else if (EmailFormat === 'Woodcomm') {
		  return 'Reported: 05/25/2019 10:03:03 19-013661 AMBULANCE CALL Loc: 700 N MAIN ST EUREKA,IL 61530 MAPLE LAWN DR / S CLINTON DR THE LOFT MED1 MED2';
	  } else if (EmailFormat === 'DuPageCounty') {
		  return '<Address> <CityCode>, <Apartment / Unit Number>:@<Business Name(if applicable)> | <Incident Number> | <Date> <Time> | <Incident Type> <Incident details (if applicable)> | <Nearest Cross Streets> | <Radio Frequency> | <District number> | <Station Number> | <LAT> <LONG> | <Unit Responding (not set up yet)>';
	  } else if (EmailFormat === 'Homewood') {
		  return 'HH.MM.SS MM/DD/YY <Incident Type> <Address>,HWD HWFD 28-1A A28 <Incident details>';
	  } else if (EmailFormat === 'SouthElgin') {
	  		return '<Incident Type>: <Address>:<Business Name>: <Nearest Cross Streets>:<Incident details>';
	  } else if (EmailFormat === 'Mehlville') {
	  		return '<Incident Type> AT<Address>= BUS: <Business> XST: <Cross Streets> TAC:<Radio Channel / Units Dispatched>'
	  } else if (EmailFormat === 'Jacksonville') {
	  		return 'DISPATCH:JFD:JFD - CALL: z0017 FALLS<nl>' +
				'PLACE: ALIAS:<PLACE><nl>' +
				'ADDR: <address><nl>' +
				'CITY: <city><nl>' +
				'ID: JFD:19-001733<nl>' +
				'DATE: mm/dd/yyyy<nl>' +
				'TIME: hh:mm:ss<nl>' +
				'MAP: <nl>' +
				'UNIT: <nl>' +
				'INFO: <info>'
	  } else if (EmailFormat === 'Gilman') {
	      return '<responder>:<incident-type>; <address>;<city>; '
	  }

	  return '';
  }

  handleFormChange(form) {
	    if (this.state.smsFormat !== form.smsFormat) {
	    	form.smsFormatExample = this.returnSMSExample(form.smsFormat);
	    	this.setState({
	    		form: form
	    	});
	    } else if (this.state.emailFormat !== form.emailFormat) {
	    	form.emailFormatExample = this.returnEmailExample(form.emailFormat);
	    	this.setState({
	    		form: form
	    	});
	    }
  }

  handleFormSubmit(form) {
    this.props.handleFormSubmit(form);
  }

  render() {
    const formFields = [
      {
        id: 'license',
        name: 'license',
        type: 'select',
        label: 'license Type',
        options: [
      	    {
      	    	'key': 'Select License Type',
      	    	'value': ''
 	        },
 	        {
        		'key': 'Master',
        		'value': 'Master'
 	        },
 	        {
 	        	'key': 'Preview',
 	        	'value': 'Preview'
     	    },
     	    {
     	    	'key': 'Demo',
     	    	'value': 'Demo'
	  	    },
	  	    {
	  	    	'key': 'Standard',
	  	    	'value': 'Standard'
	  	    }
        ],
        required: true
      },
      {
        id: 'expiryDate',
        name: 'expiryDate',
        type: 'date',
        label: 'Expiry Date',
        required: true
      },
      {
        id: 'smsNumber',
        name: 'smsNumber',
        type: 'text',
        label: 'SMS Gateway Number'
      },
      {
        id: 'smsFormat',
        name: 'smsFormat',
        type: 'select',
        label: 'SMS Format',
        options: [
			{
				'key': 'Select SMS Format',
				'value': ''
			},
			{
				'key': 'Standard',
				'value': 'Standard'
			}
        ],
        required: false
      },
      {
          id: 'smsFormatExample',
          name: 'smsFormatExample',
          type: 'example',
          label: 'SMS Example',
          required: false
      },
      {
        id: 'emailGateway',
        name: 'emailGateway',
        type: 'text',
        label: 'E-Mail ID Gateway'
      },
      {
        id: 'emailFormat',
        name: 'emailFormat',
        type: 'select',
        label: 'E-Mail Format',
        options: [
    			{
    				'key': 'Select E-Mail Format',
    				'value': ''
    			},
    			{
    				'key': 'Standard',
    				'value': 'Standard'
    			},
    			{
    				'key': 'HRFD',
    				'value': 'HRFD'
    			},
    			{
    				'key': 'North Park',
    				'value': 'North Park'
    			},
    			{
    				'key': 'Amboy',
    				'value': 'Amboy'
    			},
    			{
    				'key': 'Janesville',
    				'value': 'Janesville'
    			},
    			{
    				'key': 'Kankakee',
    				'value': 'Kankakee'
    			},
    			{
    				'key': 'Romeoville',
    				'value': 'Romeoville'
    			},
    			{
    				'key': 'Litchfield',
    				'value': 'Litchfield'
    			},
				{
					'key': 'Streator',
					'value': 'Streator'
				},
				{
					'key': 'Oak Lawn',
					'value': 'Oak Lawn'
				},
				{
					'key': 'Hiplink',
					'value': 'Hiplink'
				},
				{
					'key': 'Carlinville',
					'value': 'Carlinville'
				},
				{
					'key': 'Hebron',
					'value': 'Hebron'
				},
				{
					'key': 'Westmont',
					'value': 'Westmont'
				},
				{
					'key': 'TriState',
					'value': 'TriState'
				},
				{
					'key': 'Savoy',
					'value': 'Savoy'
				},
				{
					'key': 'Crestwood',
					'value': 'Crestwood'
				},
				{
					'key': 'Boles',
					'value': 'Boles'
				},
				{
					'key': 'Ogle',
					'value': 'Ogle'
				},
				{
					'key': 'Belleville',
					'value': 'Belleville'
				},
				{
					'key': 'RockCom',
					'value': 'RockCom'
				},
				{
					'key': 'Woodcomm',
					'value': 'Woodcomm'
				},
				{
					'key': 'DuPageCounty',
					'value': 'DuPageCounty'
				},
				{
					'key': 'Homewood',
					'value': 'Homewood'
				},
				{
					'key': 'SouthElgin',
					'value': 'SouthElgin'
				},
				{
					'key': 'Mehlville',
					'value': 'Mehlville'
				},
				{
					'key': 'Jacksonville',
					'value': 'Jacksonville'
				},
	    {
					'key': 'Gilman',
					'value': 'Gilman'
	    }
        ],
        required: false
      },
      {
          id: 'emailFormatExample',
          name: 'emailFormatExample',
          type: 'example',
          label: 'Email Example',
          required: false
      },      
	    {
	        id: 'fromContains',
	        name: 'fromContains',
	        type: 'text',
	        label: 'E-Mail from (contains)'
	    },
	    {
	        id: 'toContains',
	        name: 'toContains',
	        type: 'text',
	        label: 'E-Mail to (contains)'
	    },
	    {
	        id: 'subjectContains',
	        name: 'subjectContains',
	        type: 'text',
	        label: 'E-Mail subject (contains)'
	    },
	    {
	        id: 'bodyContains',
	        name: 'bodyContains',
	        type: 'text',
	        label: 'E-Mail body (contains)'
	    },
	    {
	        id: 'fromNotContains',
	        name: 'fromNotContains',
	        type: 'text',
	        label: 'E-Mail from (doesn`t contains)'
	    },
	    {
	        id: 'toNotContains',
	        name: 'toNotContains',
	        type: 'text',
	        label: 'E-Mail to (doesn`t contains)'
	    },
	    {
	        id: 'subjectNotContains',
	        name: 'subjectNotContains',
	        type: 'text',
	        label: 'E-Mail subject (doesn`t contains)'
	    },
	    {
	        id: 'bodyNotContains',
	        name: 'bodyNotContains',
	        type: 'text',
	        label: 'E-Mail body (doesn`t contains)'
	    },       
	    {
	        id: 'boundSWLat',
	        name: 'boundSWLat',
	        type: 'number',
	        step: '0.000000001',
	        label: 'Bound SW (Lat.)'
	    },
	    {
	        id: 'boundSWLon',
	        name: 'boundSWLon',
	        type: 'number',
	        step: '0.000000001',
	        label: 'Bound SW (Lon.)'
	    },
	    {
	        id: 'boundNELat',
	        name: 'boundNELat',
	        type: 'number',
	        step: '0.000000001',
	        label: 'Bound NE (Lat.)'
	    },
	    {
	        id: 'boundNELon',
	        name: 'boundNELon',
	        type: 'number',
	        step: '0.000000001',
	        label: 'Bound NE (Lon.)'
	    }
    ];
    return (<Form {...{form: this.state.form,
                      handleFormSubmit: this.handleFormSubmit,
                      handleFormChange: this.handleFormChange,
                      formFields: formFields,
                      errorMessage: this.props.errorMessage,
                      isFormSubmitting: this.props.isFormSubmitting
                  }}
            />);
  }

}

export default EditLicenceFormComponent;
