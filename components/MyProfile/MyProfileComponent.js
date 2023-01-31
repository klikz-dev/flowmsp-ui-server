import React from 'react';
import { Button } from 'react-bootstrap';

class MyProfileComponent extends React.Component {	
	 render() {
	    return (
    		<div className="container">
    		   <div className="row page_header">
    		      <div className="pull-left">
    		          <h3>My Profile</h3>
    		      </div>
    		      <div className="pull-right">
    		          <Button bsStyle="primary" className="EditAccountInfoButton" onClick={this.props.showEditModal}>Edit Profile</Button>
    		          <Button bsStyle="primary" onClick={this.props.showChangePasswordModal}>Change Password</Button>
		      </div>
    		   </div>
 		      <hr />
    		   <div className="row">
    		     <div className="col-lg-2">
    		       Customer Name: 
    		     </div>
    		     <div className="col-lg-10">
    		       {this.props.user.customerRef.customerName}
    		     </div>
    		   </div>
    		   <div className="row">
	  		     <div className="col-lg-2">
	  		       First Name: 
	  		     </div>
	  		     <div className="col-lg-10">
	  		       {this.props.user.firstName}
	  		     </div>
	  		   </div>
			   <div className="row">
			     <div className="col-lg-2">
			       Last Name: 
			     </div>
			     <div className="col-lg-10">
			       {this.props.user.lastName}
			     </div>
			   </div>
			   <div className="row">
			     <div className="col-lg-2">
			       Email: 
			     </div>
			     <div className="col-lg-10">
			       {this.props.user.email}
			     </div>
			   </div>
			   <div className="row">
			     <div className="col-lg-2">
			       Role: 
			     </div>
			     <div className="col-lg-10">
			       {this.props.user.role}
			     </div>
			   </div>
    		</div>
	    );
	 }	    		
}
export default MyProfileComponent;
