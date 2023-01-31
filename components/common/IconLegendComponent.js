import React from "react";
import * as util from "../../helpers/Util";
import Image from "next/image";

class IconLegend extends React.Component {
  render() {
    const IconLegendRow = (props) => (
      <div className="section-row">
        <Image
          width={100}
          height={100}
          src={util.getMarkerIcon(true, false, true, props.legend.pinColor)}
          className="legend-image"
          alt="Marker"
        />
        <span className="legend-label">{props.legend.label}</span>
      </div>
    );

    return (
      <div className="icon-legend-container section-container">
        <div className="section-header">Icon Legend</div>
        <div className="section-content">
          {this.props.pinLegend.rangePinColors.map((iconLegend, index) => (
            <IconLegendRow key={index} legend={iconLegend} />
          ))}
          <IconLegendRow legend={this.props.pinLegend.unknownPinColor} />
          <div className="section-row">
            <Image
              width={100}
              height={100}
              src={util.getMarkerIcon(true, true, true, "DRY")}
              className="legend-image"
              alt="Marker"
            />
            <span className="legend-label">Dry Hydrant</span>
          </div>
        </div>
      </div>
    );
  }
}

export default IconLegend;
