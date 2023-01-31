import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { Table, Tr, Td, Thead, Th } from 'reactable';
import adminpanel from '../../styles/adminpanel.scss';
import { CSVLink } from 'react-csv';

class UsersListComponent extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    		rowData: null
	    };
	  }
	
	onFilterChange(data) {
		console.log(data);
	}

	renderRows = () => {
		const _this = this;
	    return this.props.logData.map(function(row) {
		    return (
		    	    <Tr key={row.id}>
		           <Td column="ID">{row.id}</Td>
		           <Td column="Email">{row.email}</Td>
		           <Td column="Name">{row.name}</Td>
		           <Td column="Customer">{row.customerName}</Td>
		           <Td column="Address">{row.customerAddress}</Td>
		        </Tr>
		    );
	    });
	}
	
	 render() {
		 	if (!this.props.logData) {
		 		return (
			    		<div>
			    			Log data not available
			    		</div>
				    );
		 	}		 	
		 	const data = this.props.logData;
		 	const tableProps = {
					itemsPerPage: 10,
					pageButtonLimit: 30,
					sortable: ['ID', 'Email', 'Name', 'Customer', 'Address'],
					filterable: ['ID', 'Email', 'Name', 'Customer', 'Address'],
					noDataText: 'No matching records found.',
					filterPlaceholder: 'Search',
					defaultSort: {column: 'Email'}
			};
		    return (
		    		<div className="zero-div">
			    		<p>
						  Total Records <Badge>{data.length}</Badge>
						</p>
						<div className="first-div">
						   <CSVLink data={data}>Download raw data</CSVLink>
						   <Table className="table" {...tableProps} onFilter={this.onFilterChange.bind(this)}>
						   		{this.renderRows()}
						   </Table>
					    </div>
		    		</div>
		    );
	 }	    		
}
export default UsersListComponent;
