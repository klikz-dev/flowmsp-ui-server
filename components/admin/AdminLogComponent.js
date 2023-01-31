import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import JSONTree from 'react-json-tree';
import { Table, Tr, Td, Thead, Th } from 'reactable';
import adminpanel from '../../styles/adminpanel.scss';
import { CSVLink } from 'react-csv';

class AdminLogComponent extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    		rowData: null
	    };
	    this.setJSONTree = this.setJSONTree.bind(this);
	  }
	
	setJSONTree(row) {
		if (this.state.rowData === row) {
			this.setState({
				rowData: null
			});
			return;
		}
		this.setState({
			rowData: row
		});
	}
	
	renderRows = () => {
		const _this = this;
	    return this.props.logData.map(function(row) {
		    return (
		    	    <Tr key={row.ID} onClick={() => {_this.setJSONTree(row);}}>
		           <Td column="ID">{row.ID}</Td>
		           <Td column="Source">{row.Source}</Td>
		           <Td column="TimeStamp">{row.TimeStamp }</Td>
		           <Td column="Error Flag">{row.ErrorFlag }</Td>
		           <Td column="Error Description">{row.ErrorDescription }</Td>
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
					sortable: ['ID', 'Source', 'TimeStamp', 'Error Flag', 'Error Description'],
					filterable: ['ID', 'Source', 'TimeStamp', 'Error Flag', 'Error Description'],
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
						   <Table className="table" {...tableProps}>{this.renderRows()}</Table>
					    </div>
					    {this.state.rowData && <div className="second-div">
		    							<JSONTree data={this.state.rowData} hideRoot={true} />
		    						</div>
					    }
		    		</div>
		    );
	 }	    		
}
export default AdminLogComponent;
