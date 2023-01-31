import React from 'react';
import { Button } from 'react-bootstrap';
import UserComponent from './UserComponent';

class AccountInfoComponent extends React.Component {
	 render() {
		    return (
	    		<div className="account-container">
	    		   <div className="account-page-header">
	    		   	  <h3>Account Information</h3>
		  		      <div className="pull-right">
		  		         <Button bsStyle="primary" className="EditAccountInfoButton" onClick={this.props.showEditModal}>Edit Account Info</Button>
		  		         <Button bsStyle="primary" onClick={this.props.showAddUserModal}>Add User</Button>
		  		      </div>
		  		   </div>
		  		   <hr />
	    		   <div className="row">
	    		     <div className="col-lg-1">
	    		       Name: 
	    		     </div>
	    		     <div className="col-lg-11">
	    		        {this.props.customer.name}
	    		     </div>
	    		   </div>
	    		   <br />
	    		   <div className="row">
	    		     <div className="col-lg-1">
	    		       Address:
	    		     </div>
	    		     <div className="col-lg-11">
		    		    <div className="row">
		    		     <div className="col-lg-2">
		    		       Address 1
		    		     </div>
		    		     <div className="col-lg-10">
		    		        {this.props.customer.address1}
		    		     </div>
		    		   </div>
		    		   <div className="row">
		    		     <div className="col-lg-2">
		    		       Address 2
		    		     </div>
		    		     <div className="col-lg-10">
		    		        {this.props.customer.address2}
		    		     </div>
		    		   </div>
		    		    <div className="row">
		    		     <div className="col-lg-2">
		    		       City
		    		     </div>
		    		     <div className="col-lg-10">
		    		        {this.props.customer.city}
		    		     </div>
		    		   </div>
		    		    <div className="row">
		    		     <div className="col-lg-2">
		    		     State
		    		     </div>
		    		     <div className="col-lg-10">
		    		        {this.props.customer.state}
		    		     </div>
		    		   </div>
		    		    <div className="row">
		    		     <div className="col-lg-2">
		    		        Zip
		    		     </div>
		    		     <div className="col-lg-10">
		    		        {this.props.customer.zip}
		    		     </div>
		    		   </div>
		    		    <div className="row">
		    		     <div className="col-lg-2">
		    		       Geolocation
		    		     </div>
		    		     {
		    		    	 this.props.customer.latitude && this.props.customer.longitude &&
		    		    	 <div className="col-lg-10">
			    		        {this.props.customer.latitude} , {this.props.customer.longitude}
			    		     </div>	 
		    		     }
		    		     {
		    		    	 (!this.props.customer.latitude || !this.props.customer.longitude) &&
			    		     <div className="col-lg-2">
			    		     	<Button bsStyle="primary" onClick={this.props.updateGeoLocation}>Update GeoLocation</Button>
			    		     </div>		    		    	 
		    		     }
		    		   </div>
		    		    <div className="row">
		    		     <div className="col-lg-2">
		    		      Timezone
		    		     </div>
		    		     <div className="col-lg-10">
		    		        {this.props.customer.timeZone}
		    		     </div>		    		     
		    		   </div>
	    		     </div>
	    		     <hr />
	    		     <UserComponent users={this.props.customer.users} deleteUser={this.props.deleteUser} editUser={this.props.editUser} resetPassword={this.props.resetPassword} />
	    		   </div>
	    		</div>		           
		    );
	 }	    		
}
export default AccountInfoComponent;
