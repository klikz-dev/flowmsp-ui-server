import React from "react";
import { Button, Alert } from "react-bootstrap";
import LocationDataForm from "../form/LocationDataFormComponent";
import Image from "next/image";

class LocationData extends React.Component {
  render() {
    const location = this.props.location;

    return (
      <div className="location-data-container section-container">
        <div className="section-header">
          Location Data
          {this.props.isPrePlanningMode && <label>Pre-planning</label>}
        </div>
        {!this.props.isPrePlanningMode && (
          <div className="section-content">
            {location ? (
              <div className="section-row">
                <div>
                  <label>Business:&nbsp;</label>
                  <span>{location.name}</span>
                </div>
                <div>
                  <label>Address 1:&nbsp;</label>
                  <span>{location.address && location.address.address1}</span>
                </div>
                <div>
                  <label>Address 2:&nbsp;</label>
                  <span>{location.address && location.address.address2}</span>
                </div>
                <div>
                  <label>City:&nbsp;</label>
                  <span>{location.address && location.address.city}</span>
                </div>
                <div>
                  <label>State:&nbsp;</label>
                  <span>{location.address && location.address.state}</span>
                </div>
                <div>
                  <label>Zip:&nbsp;</label>
                  <span>{location.address && location.address.zip}</span>
                </div>
                <div>
                  <label>Lot Number:&nbsp;</label>
                  <span>{location.lotNumber && `${location.lotNumber}`}</span>
                </div>
                <div>
                  <label>Floors Above:&nbsp;</label>
                  <span>{location.storey && `${location.storey}`}</span>
                </div>
                <div>
                  <label>Floors Below:&nbsp;</label>
                  <span>
                    {location.storeyBelow && `${location.storeyBelow}`}
                  </span>
                </div>
                <div>
                  <label>Roof Area:&nbsp;</label>
                  <span>
                    {location.roofArea && `${location.roofArea} sq. ft.`}
                  </span>
                </div>
                <div>
                  <label>Required Flow:&nbsp;</label>
                  <span>
                    {location.requiredFlow &&
                      `${location.requiredFlow} gal/min`}
                  </span>
                </div>
              </div>
            ) : (
              <div className="section-row">No location selected.</div>
            )}
          </div>
        )}
        {this.props.isPrePlanningMode && (
          <div className="preplanning-content">
            {this.props.isGettingPreplan ? (
              <div className="processing">
                <Image
                  width={287}
                  height={141}
                  src="/images/processing.gif"
                  alt="processing"
                />
              </div>
            ) : (
              <div>
                {this.props.isPolygonDrawn ? (
                  <LocationDataForm
                    {...{
                      handleFormSubmit: this.props.onPrePlanFormSubmit,
                      handleFormChange: this.props.onPrePlanFormChange,
                      onCancel: this.props.onCancelPrePlan,
                      formLocation: this.props.locationDataForm,
                    }}
                  />
                ) : (
                  <div>
                    <Alert bsStyle="info">
                      <strong>To continue:</strong> Select the edges of the
                      location on the map using drawing tools.
                    </Alert>
                    <div className="preplanning-actions">
                      {!this.props.reDrawPolygon && this.props.location && (
                        <Button onClick={this.props.onRePlanStart}>
                          Redraw
                        </Button>
                      )}
                      {!this.props.reDrawPolygon && this.props.location && (
                        <Button onClick={this.props.onRePlanSubmit}>
                          Submit
                        </Button>
                      )}
                      <Button onClick={this.props.onCancelPrePlan}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default LocationData;
