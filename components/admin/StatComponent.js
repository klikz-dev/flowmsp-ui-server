import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { Table, Tr, Td, Thead, Th } from 'reactable';
import adminpanel from '../../styles/adminpanel.scss';
import { CSVLink } from 'react-csv';
import moment from 'moment';
import timezone from 'moment-timezone';

class StatComponent extends React.Component {
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

		return this.props.statData.map(function(row) {
		    return (
		    	    <Tr key={row.ID}>
		           <Td column="Title">{row.Title}</Td>
		           <Td column="Count">{row.RawData.length}</Td>
		           <Td column="Action" className="user-table-action">
		           	  <CSVLink filename={`${row.Title}.csv`}
		           	  data={row.RawData.map(obj => {
		           		  return {
		           			Business: obj.name, 
		           			Address1: obj.address.address1,
		           			Address2: obj.address.address2, 
		           			City: obj.address.city,
		           			State: obj.address.state,
		           			LastReviewedBy: obj.building.lastReviewedBy,
		           			LastReviewedOn: obj.building && obj.building.lastReviewedOn ? moment.utc(obj.building.lastReviewedOn, 'MM-DD-YYYY HH.mm.ss').tz(_this.props.timeZone).format('YYYY-MM-DD HH:mm') : ' ',
		           			OriginalPrePlan: obj.building && obj.building.originalPrePlan ? moment.utc(obj.building.originalPrePlan, 'MM-DD-YYYY HH.mm.ss').tz(_this.props.timeZone).format('YYYY-MM-DD HH:mm') : ' '
		           		  };		           		  
		           	  })}>Download Data</CSVLink>
		           </Td>
		        </Tr>
		    );
	    });
	}
	
	 render() {
		 	if (!this.props.statData) {
		 		return (
			    		<div>
			    			Statistics not available
			    		</div>
				    );
		 	}		 	
		 	const data = this.props.statData;
		 	const tableProps = {
		 			itemsPerPage: 10,
					pageButtonLimit: 30,
					sortable: ['Title', 'Count'],
					filterable: ['Title', 'Count'],
					noDataText: 'No stat available.',
					filterPlaceholder: 'Search',
			};
		    return (
		    		<div className="zero-div">
			    		<div className="first-div">
						   <CSVLink data={data}>Download Statistics</CSVLink>
						   <Table className="table" {...tableProps} onFilter={this.onFilterChange.bind(this)}>
						   		{this.renderRows()}
						   </Table>
					    </div>
		    		</div>
		    );
	 }	    		
}
export default StatComponent;
