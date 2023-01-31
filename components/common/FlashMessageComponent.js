import React from 'react';
export default function ErrorMessage(props) {
    if(props.message) {
    	return (
    	    <div className="form-group alert alert-danger">
    			{props.message}
    	     </div>
    	);
    }
    return null;
}
