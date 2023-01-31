import React from 'react';
import { Table, Tr, Td, Thead, Th } from 'reactable';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';

class ManageCustomerComponent extends React.Component {
	constructor(props) {
	    super();
	    this.state = {};
	}
		
    // these were after License Expiry Date
//		           <Td column="SMS Gateway Number">{row.smsNumber ? row.smsNumber : '-' }</Td>
//		           <Td column="SMS Format">{row.smsFormat ? row.smsFormat : '-' }</Td>

	renderRows = () => {
		const _this = this;
	    return this.props.customerList.map(function(row) {
		    return (
		    	    <Tr key={row.id}>
		           <Td column="Name">{row.name}</Td>
		           <Td column="License Type">{row.license.licenseType}</Td>
		            <Td column="License Creation Date">{row.license.creationTimestamp ? moment(row.license.creationTimestamp).format('YYYY-MM-DD') : '-' }</Td>
		            <Td column="License Expiry Date">{row.license.expirationTimestamp ? moment(row.license.expirationTimestamp).format('YYYY-MM-DD') : '-' }</Td>
		           <Td column="Email ID Gateway">{row.emailGateway ? row.emailGateway : '-' }</Td>
		           <Td column="Email Format">{row.emailFormat ? row.emailFormat : '-' }</Td>
                            <Td column="To Contains">{row.toContains ? row.toContains : '-' }</Td>
		           <Td column="Action" className="user-table-action">
		              <span>
		              	<a title="Edit License" onClick={() => {_this.props.editLicence(row);}}>{<i className="glyphicon glyphicon-edit"/>}</a>
		              </span>
		           </Td>
		           
		        </Tr>
		    );
	    });
	}
	
	render() {
		const tableProps = {
				itemsPerPage: 50,
				pageButtonLimit: 5,
		    sortable: ['Name', 'License Type', 'License Creation Date', 'License Expiry Date', 'Email ID Gateway', 'Email Format', 'To Contains'],
		    filterable: ['Name', 'License Type', 'Email ID Gateway', 'Email Format', 'To Contains'],
				noDataText: 'No matching records found.',
				filterPlaceholder: 'Search'
		};
		 return (
			<div className="manage-container">
			    <div className="manage-page-header">
			    	<h3>Customers</h3>
				</div>
				<div>
				   <Table className="table" {...tableProps}>{this.renderRows()}</Table>
			    </div>
	  		</div>
		);
   }
}

function mapStateToProps(store) {
	return {
		customer: store.customer,
		customerList: store.customer.customerList
	};
}

export default connect(mapStateToProps, null)(ManageCustomerComponent);


