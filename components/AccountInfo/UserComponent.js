import React from 'react';
import { Table, Tr, Td, Thead, Th } from 'reactable';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';

class UserComponent extends React.Component {
	constructor(props) {
	    super();
	    this.state = {};
	}
	
	renderRows() {
		const _this = this;
	    return this.props.users.map(function(row) {
		    return (
		    	    <Tr key={row.id}>
		           <Td column="Email">{row.email}</Td>
		           <Td column="First Name">{row.firstName}</Td>
		           <Td column="Last Name">{row.lastName}</Td>
		           <Td column="Role">{row.role}</Td>
		           <Td column="Action" className="user-table-action">
		              <span>
		              	<a title="Delete User" onClick={() => {_this.props.deleteUser(row);}}>{<i className="glyphicon glyphicon-trash margin-right-10px"/>}</a>
		              	<a title="Edit User" onClick={() => {_this.props.editUser(row);}}>{<i className="glyphicon glyphicon-edit margin-right-10px"/>}</a>
		              	<a title="Reset password" onClick={() => {_this.props.resetPassword(row);}}>{<i className="glyphicon glyphicon-retweet"/>}</a>
		              </span>
		           </Td>
		        </Tr>
		    );
	    });
	}

	render() {
			const tableProps = {
				itemsPerPage: 25,
				pageButtonLimit: 5,
				sortable: ['Email', 'First Name', 'Role', 'Last Name']
			};

		 return (
			<div>
			    <div className="user-page-header">
			    	<h3>Users</h3>
	  		   </div>
	  		   <hr />
	  		   <div>
	  		   		<Table className="table" {...tableProps}>{this.renderRows()}</Table>
	  		   </div>
	  		</div>
		 );
	}
}
export default connect(null, null)(UserComponent);
