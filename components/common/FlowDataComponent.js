import React from 'react';

class FlowData extends React.Component {

  render() {
    return (
      <div className="flow-data-container section-container">
        <div className="section-header">Flow Data</div>
        <div className="section-content">
          <div>
            <label>Selected Hydrants:&nbsp;</label>
            <span>{this.props.selectedHydrantsLength}</span>
          </div>
          <div>
            <label>Total Flow Rate:&nbsp;</label>
            <span>{this.props.totalFlowRate && this.props.totalFlowRate.toLocaleString()}&nbsp;gal/min</span>
          </div>
        </div>
      </div>
    );
  }

}

export default FlowData;
