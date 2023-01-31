import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { Table, Tr, Td, Thead, Th } from 'reactable';
import adminpanel from '../../styles/adminpanel.scss';
import { CSVLink } from 'react-csv';

class ActivityLogComponent extends React.Component {
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
		    	    <Tr key={row.ID}>
		           <Td column="ID">{row.ID}</Td>
		           <Td column="Customer">{row.Customer}</Td>
		           <Td column="Subject">{row.Subject}</Td>
		           <Td column="User">{row.User}</Td>
		           <Td column="Source">{row.Source}</Td>
		           <Td column="TimeStamp">{row.TimeStamp }</Td>
		           <Td column="Version">{row.Version }</Td>
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
					sortable: ['ID', 'Customer', 'Subject', 'User', 'Source', 'TimeStamp', 'Version'],
					filterable: ['ID', 'Customer', 'Subject', 'User', 'Source', 'TimeStamp', 'Version'],
					noDataText: 'No matching records found.',
					filterPlaceholder: 'Search',
					defaultSort: {column: 'TimeStamp', direction: 'desc'}
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
export default ActivityLogComponent;
