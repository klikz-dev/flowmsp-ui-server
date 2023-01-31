import React from "react";
import moment from "moment";
import * as util from "../../helpers/Util";
import Image from "next/image";

class HydrantsInfo extends React.Component {
  render() {
    return (
      <div className="hydrants-info-container section-container">
        <div className="section-header">Hydrant Information</div>
        <div className="section-content">
          {this.props.selectedHydrants.map((hydrant, index) => (
            <div key={index} className="section-row">
              <div className="hydrant-image">
                <Image
                  width={100}
                  height={100}
                  src={util.getMarkerIcon(
                    hydrant.isMine,
                    hydrant.dryHydrant,
                    hydrant.inService,
                    hydrant.pinColor,
                    true
                  )}
                  alt="Marker"
                />
              </div>
              <div className="hydrant-details">
                <div>
                  <label>Hydrant:&nbsp;</label>
                  <span>{hydrant.externalRef}</span>
                </div>
                <div>
                  <label>Address:&nbsp;</label>
                  <span className="address">{hydrant.address}</span>
                </div>
                <div>
                  <label>Flow Rate:&nbsp;</label>
                  <span>
                    {hydrant.hydrantFlowRate &&
                      hydrant.hydrantFlowRate.toLocaleString()}
                    &nbsp;gal/min
                  </span>
                </div>
                <div>
                  <label>Description:&nbsp;</label>
                  <span>{hydrant.hydrantNotes}</span>
                </div>
                {!hydrant.inService && (
                  <div>
                    <label>
                      Not In Service Since{" "}
                      {moment(hydrant.outServiceDate).format("YYYY-MM-DD")}
                    </label>
                  </div>
                )}
                {hydrant.dryHydrant && (
                  <div>
                    <label>Dry Hydrant</label>
                  </div>
                )}
              </div>
            </div>
          ))}
          {this.props.selectedHydrants.length === 0 && (
            <div className="section-row">No hydrant selected.</div>
          )}
        </div>
      </div>
    );
  }
}

export default HydrantsInfo;
