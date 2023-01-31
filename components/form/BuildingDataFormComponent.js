import React from "react";
import Form from "./FormComponent";
import moment from "moment";
import { dpstyles } from "../../styles/react-datepicker.module.scss";
import DatePicker from "react-datepicker";
import timezone from "moment-timezone";

class BuildingDataForm extends React.Component {
  constructor(props) {
    super();

    const formBuilding = props.formBuilding;
    this.state = {
      form: {
        locationId: formBuilding.locationId,
        occupancyType:
          formBuilding && formBuilding.occupancyType
            ? formBuilding.occupancyType
            : "",
        constructionType:
          formBuilding && formBuilding.constructionType
            ? formBuilding.constructionType
            : "",
        roofType:
          formBuilding && formBuilding.roofType ? formBuilding.roofType : "",
        roofConstruction:
          formBuilding && formBuilding.roofConstruction
            ? formBuilding.roofConstruction
            : "",
        roofMaterial:
          formBuilding && formBuilding.roofMaterial
            ? formBuilding.roofMaterial
            : "",
        sprinklered:
          formBuilding && formBuilding.sprinklered
            ? formBuilding.sprinklered
            : "",
        standPipe:
          formBuilding && formBuilding.standPipe ? formBuilding.standPipe : "",
        fireAlarm:
          formBuilding && formBuilding.fireAlarm ? formBuilding.fireAlarm : "",
        normalPopulation:
          formBuilding && formBuilding.normalPopulation
            ? formBuilding.normalPopulation
            : "",
        hoursOfOperation:
          formBuilding && formBuilding.hoursOfOperation
            ? formBuilding.hoursOfOperation
            : "",
        ownerContact:
          formBuilding && formBuilding.ownerContact
            ? formBuilding.ownerContact
            : "",
        ownerPhone:
          formBuilding && formBuilding.ownerPhone
            ? formBuilding.ownerPhone
            : "",
        originalPrePlan:
          formBuilding && formBuilding.originalPrePlan
            ? formBuilding.originalPrePlan
            : "",
        lastReviewedOn:
          formBuilding && formBuilding.lastReviewedOn
            ? formBuilding.lastReviewedOn
            : "",
        lastReviewedBy:
          formBuilding && formBuilding.lastReviewedBy
            ? formBuilding.lastReviewedBy
            : "",
        notes: formBuilding && formBuilding.notes ? formBuilding.notes : "",
        action: formBuilding.action,
      },
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  handleFormSubmit(form) {
    this.props.handleFormSubmit(form);
  }

  handleFormChange(form) {
    this.props.handleFormChange(form);
  }

  render() {
    const formFields = [
      {
        label: "Occupancy Type",
        id: "occupancyType",
        name: "occupancyType",
        type: "select",
        options: [
          {
            key: "Select Occupancy Type",
            value: "",
          },
          {
            key: "Assembly",
            value: "Assembly",
          },
          {
            key: "Board & Care",
            value: "Board & Care",
          },
          {
            key: "Business / Mercantile",
            value: "Business / Mercantile",
          },
          {
            key: "Day-Care",
            value: "Day-Care",
          },
          {
            key: "Detention & Correctional",
            value: "Detention & Correctional",
          },
          {
            key: "Educational",
            value: "Educational",
          },
          {
            key: "High Hazard",
            value: "High Hazard",
          },
          {
            key: "Industrial",
            value: "Industrial",
          },
          {
            key: "Medical Care / Institutional",
            value: "Medical Care / Institutional",
          },
          {
            key: "Multi-Family",
            value: "Multi-Family",
          },
          {
            key: "Residential",
            value: "Residential",
          },
          {
            key: "Special Structures",
            value: "Special Structures",
          },
          {
            key: "Storage",
            value: "Storage",
          },
        ],
        required: false,
      },
      {
        label: "Construction Type",
        id: "constructionType",
        name: "constructionType",
        type: "select",
        options: [
          {
            key: "Select Construction Type",
            value: "",
          },
          {
            key: "Not Classified",
            value: "Not Classified",
          },
          {
            key: "Type IA - Fire Resistive, Non-combustible",
            value: "Type IA - Fire Resistive, Non-combustible",
          },
          {
            key: "Type IB - Fire Resistive, Non-combustible",
            value: "Type IB - Fire Resistive, Non-combustible",
          },
          {
            key: "Type IIA - Protective, Non-combustible",
            value: "Type IIA - Protective, Non-combustible",
          },
          {
            key: "Type IIB - Unprotective, Non-combustible",
            value: "Type IIB - Unprotective, Non-combustible",
          },
          {
            key: "Type IIIA - Protected Ordinary",
            value: "Type IIIA - Protected Ordinary",
          },
          {
            key: "Type IIIB - Unprotected Ordinary",
            value: "Type IIIB - Unprotected Ordinary",
          },
          {
            key: "Type IV - Heavy Timber",
            value: "Type IV - Heavy Timber",
          },
          {
            key: "Type VA - Protected Combustible",
            value: "Type VA - Protected Combustible",
          },
          {
            key: "Type VB - Unprotected Combustible",
            value: "Type VB - Unprotected Combustible",
          },
        ],
        required: false,
      },
      {
        label: "Roof Type",
        id: "roofType",
        name: "roofType",
        type: "select",
        options: [
          {
            key: "Select Roof Type",
            value: "",
          },
          {
            key: "Bonnet",
            value: "Bonnet",
          },
          {
            key: "Bowstring Truss",
            value: "Bowstring Truss",
          },
          {
            key: "Butterfly",
            value: "Butterfly",
          },
          {
            key: "Combination",
            value: "Combination",
          },
          {
            key: "Curved",
            value: "Curved",
          },
          {
            key: "Dome",
            value: "Dome",
          },
          {
            key: "Flat",
            value: "Flat",
          },
          {
            key: "Gable",
            value: "Gable",
          },
          {
            key: "Gambrel",
            value: "Gambrel",
          },
          {
            key: "Hip",
            value: "Hip",
          },
          {
            key: "Jerkinhead",
            value: "Jerkinhead",
          },
          {
            key: "Mansard",
            value: "Mansard",
          },
          {
            key: "Pyramid",
            value: "Pyramid",
          },
          {
            key: "Saltbox",
            value: "Saltbox",
          },
          {
            key: "Sawtooth",
            value: "Sawtooth",
          },
          {
            key: "Skillion",
            value: "Skillion",
          },
        ],
        required: false,
      },
      {
        label: "Roof Construction",
        id: "roofConstruction",
        name: "roofConstruction",
        type: "select",
        options: [
          {
            key: "Select Roof Construction",
            value: "",
          },
          {
            key: "Beam - Concrete",
            value: "Beam - Concrete",
          },
          {
            key: "Beam - Steel",
            value: "Beam - Steel",
          },
          {
            key: "Beam - Wood",
            value: "Beam - Wood",
          },
          {
            key: "Steel Truss - Open Web",
            value: "Steel Truss - Open Web",
          },
          {
            key: "Wood / Steel - Closed Web",
            value: "Wood / Steel - Closed Web",
          },
          {
            key: "Wood / Steel - Open Web",
            value: "Wood / Steel - Open Web",
          },
          {
            key: "Wood Truss - Closed Web",
            value: "Wood Truss - Closed Web",
          },
          {
            key: "Wood Truss - Open Web",
            value: "Wood Truss - Open Web",
          },
        ],
        required: false,
      },
      {
        label: "Roof Material",
        id: "roofMaterial",
        name: "roofMaterial",
        type: "select",
        options: [
          {
            key: "Select Roof Material",
            value: "",
          },
          {
            key: "Built-Up",
            value: "Built-Up",
          },
          {
            key: "Composition Shingles",
            value: "Composition Shingles",
          },
          {
            key: "Membrane - Plastic elastomer",
            value: "Membrane - Plastic elastomer",
          },
          {
            key: "Membrane - Synthetic elastomer",
            value: "Membrane - Synthetic elastomer",
          },
          {
            key: "Metal",
            value: "Metal",
          },
          {
            key: "Metal - Corrugated",
            value: "Metal - Corrugated",
          },
          {
            key: "Metal - Shake",
            value: "Metal - Shake",
          },
          {
            key: "Metal - Standing Seam",
            value: "Metal - Standing Seam",
          },
          {
            key: "Roof Covering Not Class",
            value: "Roof Covering Not Class",
          },
          {
            key: "Roof Covering Undetermined/Not Reported",
            value: "Roof Covering Undetermined/Not Reported",
          },
          {
            key: "Shingle - Asphalt / Composition",
            value: "Shingle - Asphalt / Composition",
          },
          {
            key: "Slate - Composition",
            value: "Slate - Composition",
          },
          {
            key: "Slate - Natural",
            value: "Slate - Natural",
          },
          {
            key: "Structure Without Roof",
            value: "Structure Without Roof",
          },
          {
            key: "Tile - Clay",
            value: "Tile - Clay",
          },
          {
            key: "Tile - Concrete",
            value: "Tile - Concrete",
          },
          {
            key: "Tile (clay, cement, slate, etc.)",
            value: "Tile (clay, cement, slate, etc.)",
          },
          {
            key: "Wood - Shingle/Shake",
            value: "Wood - Shingle/Shake",
          },
          {
            key: "Wood Shakes/Shingles (Treated)",
            value: "Wood Shakes/Shingles (Treated)",
          },
          {
            key: "Wood Shakes/Shingles (Untreated)",
            value: "Wood Shakes/Shingles (Untreated)",
          },
        ],
        required: false,
      },
      {
        label: "Sprinklered",
        id: "sprinklered",
        name: "sprinklered",
        type: "select",
        options: [
          {
            key: "Select Sprinkler Type",
            value: "",
          },
          {
            key: "Dry System",
            value: "Dry System",
          },
          {
            key: "Wet System",
            value: "Wet System",
          },
          {
            key: "Both",
            value: "Both",
          },
          {
            key: "None",
            value: "None",
          },
        ],
        required: false,
      },
      {
        label: "Stand Pipe",
        id: "standPipe",
        name: "standPipe",
        type: "select",
        options: [
          {
            key: "Select Stand Pipe",
            value: "",
          },
          {
            key: "Yes",
            value: "Yes",
          },
          {
            key: "No",
            value: "No",
          },
        ],
        required: false,
      },
      {
        label: "Fire Alarm",
        id: "fireAlarm",
        name: "fireAlarm",
        type: "select",
        options: [
          {
            key: "Select Fire Alarm",
            value: "",
          },
          {
            key: "Yes",
            value: "Yes",
          },
          {
            key: "No",
            value: "No",
          },
        ],
        required: false,
      },
      {
        label: "Normal Population",
        id: "normalPopulation",
        name: "normalPopulation",
        type: "select",
        options: [
          {
            key: "Select Normal Population",
            value: "",
          },
          {
            key: "Vacant",
            value: "Vacant",
          },
          {
            key: "1 - 10",
            value: "1 - 10",
          },
          {
            key: "11 - 50",
            value: "11 - 50",
          },
          {
            key: "51 - 100",
            value: "51 - 100",
          },
          {
            key: "101 - 500",
            value: "101 - 500",
          },
          {
            key: "501 - 1000",
            value: "501 - 1000",
          },
        ],
        required: false,
      },
      {
        label: "Hours Of Operation",
        id: "hoursOfOperation",
        name: "hoursOfOperation",
        type: "text",
        placeholder: "",
      },
      {
        label: "Owner Contact",
        id: "ownerContact",
        name: "ownerContact",
        type: "text",
        placeholder: "",
      },
      {
        label: "Owner Phone",
        id: "ownerPhone",
        name: "ownerPhone",
        type: "text",
        placeholder: "",
      },
      {
        label: "Notes (Optional)",
        id: "notes",
        name: "notes",
        type: "textarea",
        placeholder: "",
      },
    ];
    return (
      <Form
        {...{
          form: this.state.form,
          handleFormSubmit: this.handleFormSubmit,
          handleFormChange: this.handleFormChange,
          formFields: formFields,
          showCancelButton: true,
          onCancel: this.props.onCancel,
        }}
      />
    );
  }
}

export default BuildingDataForm;
