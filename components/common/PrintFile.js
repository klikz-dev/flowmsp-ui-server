import React from 'react';
import { connect } from 'react-redux';
import { Table, Tr, Td, Thead, Th } from 'reactable';

class ComponentToPrint extends React.Component {

  constructor(props) {
	    super(props);
	}

  renderRows() {
   return this.props.data.map(function(row, index) {
       return (
        <Tr key={index}>
          <Td column="Log">{row}</Td>
        </Tr>
       );
   });
  }

  render() {
		  if (!this.props.header) {
			  return (
					  <div>
					  	[*Select an option and choose the file to upload]
					  </div>
			  	);
		  }
		  if (!this.props.data) {
			  return (
					  <div>
					  	Data
					  </div>
			  	);
		  }
        const style = [
          {
        	  display: 'block',
        	  width: 'auto',
              height: 'auto',
              overflow: 'visible',
          }
        ];

        return (
          <div>
           <div className="user-page-header">
               <h3>{this.props.header}</h3>
          </div>
          <hr />
          <div style={style[0]}>
               <Table className="table">{this.renderRows()}</Table>
          </div>
         </div>
       );
  }
}

export default ComponentToPrint;
