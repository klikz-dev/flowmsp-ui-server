import React from "react";
import { Button, Alert } from "react-bootstrap";
import BuildingDataForm from "../form/BuildingDataFormComponent";
import moment from "moment";
import timezone from "moment-timezone";
import Image from "next/image";

class BuildingData extends React.Component {
  render() {
    const timeZone =
      this.props.customer && this.props.customer.timeZone
        ? this.props.customer.timeZone
        : "";
    const building =
      this.props.location &&
      this.props.location.building &&
      typeof this.props.location.building !== "undefined"
        ? this.props.location.building
        : null;
    const lastReviewedOn =
      building && building.lastReviewedOn
        ? moment
            .utc(building.lastReviewedOn, "MM-DD-YYYY HH.mm.ss")
            .tz(timeZone)
            .format("YYYY-MM-DD HH:mm")
        : " ";
    const originalPrePlan =
      building && building.originalPrePlan
        ? moment
            .utc(building.originalPrePlan, "MM-DD-YYYY HH.mm.ss")
            .tz(timeZone)
            .format("YYYY-MM-DD HH:mm")
        : " ";
    return (
      <div className="building-data-container section-container">
        <div className="section-header">
          Building Data
          {this.props.isPrePlanningMode && <label>Pre-planning</label>}
        </div>
        {!this.props.isPrePlanningMode && (
          <div className="section-content">
            {building ? (
              <div className="section-row">
                <div>
                  <label>Occupancy Type:&nbsp;</label>
                  <span>{building.occupancyType}</span>
                </div>
                <div>
                  <label>Construction Type:&nbsp;</label>
                  <span>{building.constructionType}</span>
                </div>
                <div>
                  <label>Roof Type:&nbsp;</label>
                  <span>{building.roofType}</span>
                </div>
                <div>
                  <label>Roof Construction:&nbsp;</label>
                  <span>{building.roofConstruction}</span>
                </div>
                <div>
                  <label>Roof Material:&nbsp;</label>
                  <span>{building.roofMaterial}</span>
                </div>
                <div>
                  <label>Sprinklered:&nbsp;</label>
                  <span>{building.sprinklered}</span>
                </div>
                <div>
                  <label>Stand Pipe:&nbsp;</label>
                  <span>{building.standPipe}</span>
                </div>
                <div>
                  <label>Fire Alarm:&nbsp;</label>
                  <span>{building.fireAlarm}</span>
                </div>
                <div>
                  <label>Normal Population:&nbsp;</label>
                  <span>{building.normalPopulation}</span>
                </div>
                <div>
                  <label>Hours Of Operation:&nbsp;</label>
                  <span>{building.hoursOfOperation}</span>
                </div>
                <div>
                  <label>Owner Contact:&nbsp;</label>
                  <span>{building.ownerContact}</span>
                </div>
                <div>
                  <label>Owner Phone:&nbsp;</label>
                  <span>{building.ownerPhone}</span>
                </div>
                <div>
                  <label>Original Pre-Plan:&nbsp;</label>
                  <span>{originalPrePlan}</span>
                </div>
                <div>
                  <label>Last Reviewed On:&nbsp;</label>
                  <span>{lastReviewedOn}</span>
                </div>
                <div>
                  <label>Last Reviewed By:&nbsp;</label>
                  <span>{building.lastReviewedBy}</span>
                </div>
                <div>
                  <label>Notes:&nbsp;</label>
                  <span>{building.notes}</span>
                </div>
              </div>
            ) : (
              <div className="section-row">No building info.</div>
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
                  <BuildingDataForm
                    {...{
                      handleFormSubmit: this.props.onBuildingFormSubmit,
                      handleFormChange: this.props.onBuildingFormChange,
                      onCancel: this.props.onCancelPrePlan,
                      formBuilding: this.props.buildingDataForm,
                    }}
                  />
                ) : (
                  <div>
                    <Alert bsStyle="info">
                      <strong>To continue:</strong> Select the Location.
                    </Alert>
                    <div className="preplanning-actions">
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

export default BuildingData;
