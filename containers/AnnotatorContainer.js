import React, { Component } from "react";
import { connect } from "react-redux";
import { keys, map } from "lodash";
import { Annotator } from "react-annotator";
import {
  Button,
  ButtonToolbar,
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import ColorPicker from "../components/annotator/ColorPicker";
import Gallery from "react-grid-gallery";

const KeyCodes = {
  comma: 188,
  enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const manipulationTools = ["Select", "Delete"];
const drawingTools = ["Pencil", "Line", "Circle", "Rectangle"];
const lineWidthOptions = [3, 5, 7, 9, 11];
const fontSizeOptions = [14, 18, 22, 26, 30, 34, 38, 42];
const symbolOptionsHazardousMaterials = [
  "preplan/Alarm_Detectors_Detailed/Annunciator-Panel",
  "preplan/Fire_Suppression_Detailed/DETAIL_Fire-Department-Connection--FDC1",
  "preplan/Key_or_Knox_Box/Plain",
  "extended/Gas",
  "extended/Electric",
  "extended/A",
  "extended/B",
  "extended/C",
  "extended/D",
  "extended/RoofAccess",
  "extended/GenericHazard",
  "extended/SprinklerConnection",
  "extended/StandpipeConnection",
  "extended/TrussedRoof",
  "Hazardous_Materials/Class-1-Blasting-Agent-15",
  "Hazardous_Materials/Class-1-Explosives-11",
  "Hazardous_Materials/Class-1-Explosives-12",
  "Hazardous_Materials/Class-1-Explosives-13",
  "Hazardous_Materials/Class-1-Explosives-14",
  "Hazardous_Materials/Class-1-Explosives-15",
  "Hazardous_Materials/Class-1-Explosives-16",
  "Hazardous_Materials/Class-1-Explosives",
  "Hazardous_Materials/Class-2-Chlorine",
  "Hazardous_Materials/Class-2-Flammable-Gas-21",
  "Hazardous_Materials/Class-2-Flammable-Gas",
  "Hazardous_Materials/Class-2-Flammable-Liquid",
  "Hazardous_Materials/Class-2-Flammable-Solid",
  "Hazardous_Materials/Class-2-Inhalation-Hazards-23",
  "Hazardous_Materials/Class-2-Non-Flammable-Gas-22",
  "Hazardous_Materials/Class-2-Oxygen-22",
  "Hazardous_Materials/Class-3-Combustible",
  "Hazardous_Materials/Class-3-Flammable",
  "Hazardous_Materials/Class-3-Fuel-Oil",
  "Hazardous_Materials/Class-3-Gasoline",
  "Hazardous_Materials/Class-4-Dangerous-When-Wet",
  "Hazardous_Materials/Class-4-Flammable-Solids",
  "Hazardous_Materials/Class-4-Spontaneously-Combustible",
  "Hazardous_Materials/Class-5-Organic-Peroxides-51",
  "Hazardous_Materials/Class-5-Organic-Peroxides-52",
  "Hazardous_Materials/Class-5-Oxidizers-51",
  "Hazardous_Materials/Class-6-Infectious",
  "Hazardous_Materials/Class-6-Inhalation-Hazards",
  "Hazardous_Materials/Class-6-Poison-Gas",
  "Hazardous_Materials/Class-6-Poisons",
  "Hazardous_Materials/Class-6-Toxic-Gas",
  "Hazardous_Materials/Class-6-Toxic",
  "Hazardous_Materials/Class-7-Radioactive",
  "Hazardous_Materials/Class-8-Acids",
  "Hazardous_Materials/Class-8-Alkaline",
  "Hazardous_Materials/Class-8-Corrosive",
  "Hazardous_Materials/Class-9",
  "Hazardous_Materials/Class-Other-DANGEROUS",
  "Hazardous_Materials/Class-Other-HOT",
  "Hazardous_Materials/Class-Other-Store-Away-From-Food",
  "Hazardous_Materials/Class-Other-V2",
  "Hazardous_Materials/Class-Other-V3",
  "Hazardous_Materials/Class-Other",
];

export class AnnotatorContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tool: "Pencil",
      color: "black",
      lineWidth: 3,
      fontSize: 16,
    };
    this.json = {};
    this.svg = {};
    this._annotator;
  }

  renderButton(tool, label) {
    const { tool: activeTool } = this.state;

    return (
      <Button
        key={tool}
        bsStyle={tool === activeTool ? "primary" : "default"}
        active={tool === activeTool}
        onClick={(e) => this.setState({ tool })}
      >
        {label}
      </Button>
    );
  }

  myTileViewportStyleFn() {
    const style = {
      height: "60px",
      width: "60px",
    };
    return style;
  }

  myThumbnailStyleFn() {
    const style = {
      height: "60px",
      width: "60px",
    };
    return style;
  }

  renderSymbolDropdown() {
    const { tool: activeTool } = this.state;
    const allowSymbolOption = activeTool === "Symbol";
    const symbolToolActive = activeTool === "Symbol";
    const IMAGES = [];
    for (let ii = 0; ii < symbolOptionsHazardousMaterials.length; ii++) {
      const path =
        "/images/NASPGLib/" +
        symbolOptionsHazardousMaterials[ii] +
        "_256x256.png";
      //This is to test the icon in development environment
      //const path = 'https://s3-us-west-2.amazonaws.com/flowmsp-test-image-bucket2/icons/NASPGLib/Hazardous_Materials/' + symbolOptionsHazardousMaterials[ii] + '_256x256.png';
      const image = {
        src: path,
        thumbnail: path,
        thumbnailWidth: 50,
        thumbnailHeight: 50,
        caption: symbolOptionsHazardousMaterials[ii],
        isSelected: symbolToolActive
          ? this.state.symbolType === symbolOptionsHazardousMaterials[ii]
          : false,
      };
      IMAGES.push(image);
    }
    return (
      <Gallery
        images={IMAGES}
        enableLightbox={false}
        thumbnailStyle={this.myThumbnailStyleFn}
        tileViewportStyle={this.myTileViewportStyleFn}
        enableImageSelection={symbolToolActive}
        onClickThumbnail={(index) => {
          if (!symbolToolActive) {
            return;
          }
          const path = IMAGES[index].src;
          const option = IMAGES[index].caption;
          this._annotator.setImage(path);
          this.setState({ symbolType: option, symbolPath: path });
        }}
        onSelectImage={(index) => {
          if (!symbolToolActive) {
            return;
          }
          const path = IMAGES[index].src;
          const option = IMAGES[index].caption;
          this._annotator.setImage(path);
          this.setState({ symbolType: option, symbolPath: path });
        }}
      />
    );
  }

  renderSizeDropdown() {
    const { tool: activeTool } = this.state;
    const allowSizeOption = activeTool === "Line" || activeTool === "Pencil";
    const textToolActive = activeTool === "Text";

    if (textToolActive) {
      return (
        <DropdownButton
          title={"Font Size"}
          disabled={!textToolActive}
          id="fontSize"
        >
          {map(fontSizeOptions, (option) => (
            <Dropdown.Item
              eventKey={`${option}`}
              key={`${option}`}
              onSelect={() => {
                this._annotator.setFontSize(option);
                this.setState({ fontSize: option });
              }}
              active={option === this.state.fontSize}
            >
              {`${option}`}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      );
    }
    return (
      <DropdownButton
        title={"Line Width"}
        disabled={!allowSizeOption}
        id="lineWidth"
      >
        {map(lineWidthOptions, (option) => (
          <Dropdown.Item
            eventKey={`${option}`}
            key={`${option}`}
            onSelect={() => this.setState({ lineWidth: option })}
            active={option === this.state.lineWidth}
          >
            {`${option}px`}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    );
  }

  render() {
    const { tool: activeTool } = this.state;
    const allowSizeOption = activeTool === "Line" || activeTool === "Pencil";
    const allowColorOption = activeTool !== "Delete";
    const textToolActive = activeTool === "Text";
    const symbolToolActive = activeTool === "Symbol";

    return (
      <div className="content-wrapper">
        <div className="content">
          <div className="annotator-container">
            <div className="tool-bar">
              <ButtonGroup>
                {map(manipulationTools, (tool) =>
                  this.renderButton(tool, tool)
                )}
              </ButtonGroup>
              <span style={{ margin: "10px" }} />
              <ButtonGroup>
                {map(drawingTools, (tool) => this.renderButton(tool, tool))}
              </ButtonGroup>
              <span style={{ margin: "5px" }} />
              <ButtonGroup>{this.renderButton("Symbol", "Symbol")}</ButtonGroup>
              <span style={{ margin: "10px" }} />
              <ButtonGroup>
                {this.renderButton("Text", "Text Label")}
                {this.renderButton("Text Bubble", "Text Bubble")}

                <Button
                  disabled={!textToolActive}
                  onClick={(e) => this._annotator.setBold()}
                >
                  Bold
                </Button>
                <Button
                  disabled={!textToolActive}
                  onClick={(e) => this._annotator.setItalic()}
                >
                  Italic
                </Button>
                <Button
                  disabled={!textToolActive}
                  onClick={(e) => this._annotator.setUnderline()}
                >
                  Underline
                </Button>
              </ButtonGroup>
              <span style={{ margin: "10px" }} />
              <ColorPicker
                onChange={(color) =>
                  this.setState({
                    color,
                  })
                }
                color={{ r: 0, g: 0, b: 0 }}
                disabled={!allowColorOption}
              />
              {this.renderSizeDropdown()}
              <span style={{ margin: "10px" }} />
              <ButtonGroup>
                <Button
                  bsStyle="warning"
                  onClick={() => this.props.onCancel(this.json, this.svg)}
                >
                  Cancel
                </Button>
                <Button
                  bsStyle="success"
                  onClick={() =>
                    this.props.onSave(this.json, this.svg, this.state.tags)
                  }
                >
                  Save
                </Button>
              </ButtonGroup>
            </div>
            <div className="grid-symbol">
              Available Symbols
              {this.renderSymbolDropdown()}
            </div>
            <Annotator
              className="annotator"
              ref={(c) => (this._annotator = c)}
              height={window.innerHeight - 150}
              color={this.state.color}
              lineWidth={allowSizeOption ? this.state.lineWidth : 5}
              fontSize={this.state.fontSize}
              tool={this.state.tool}
              imageUrl={
                this.props.image.href
              } /*Eventually change this to this._annotator.toJSON()*/
              onChange={(json, svg) => {
                this.json = json;
                this.svg = svg;
              }}
              defaultData={this.props.json}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(AnnotatorContainer);
