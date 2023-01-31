import React from 'react';

class MarkerInfo extends React.Component {

  render() {
    const marker = this.props.marker;
    return (
      <div className="info-window-container">
        <div className="info-window-detail">
          <span className="info-window-label">Hydrant: </span>
          <span>{marker.externalRef}</span>
        </div>
        <div className="info-window-detail">
          <span className="info-window-label">Address: </span>
          <span>{marker.address}</span>
        </div>
        <div className="info-window-detail">
          <span className="info-window-label">Flow Rate: </span>
          <span>{marker.hydrantFlowRate}</span>
        </div>
        <div className="info-window-detail">
          <span className="info-window-label">Description: </span>
          <span>{marker.hydrantNotes}</span>
        </div>
      </div>
    );
  }

}

export default MarkerInfo;
