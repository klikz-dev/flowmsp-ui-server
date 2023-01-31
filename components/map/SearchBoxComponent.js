/* global google */

import React from "react";
import _ from "lodash";
import SearchBox from "react-google-maps/lib/components/places/SearchBox";

class AddressSearchBox extends React.Component {
  constructor(props) {
    super();
  }

  onSearchBoxMounted = (searchBox) => {
    this._searchBox = searchBox;
  };

  handlePlacesChanged = () => {
    const places = this._searchBox.getPlaces();
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    const nextMarkers = places.map((place) => ({
      position: place.geometry.location,
    }));
    const nextCenter = _.get(nextMarkers, "0.position", this.props.mapCenter);
    this.props.setMapCenter(nextCenter);
    this.props.setMarkersFromSearch(nextMarkers);
    // Uncomment the following line when you want Google Maps API to set the zoom level automatically
    // this.props.fitMapBounds(bounds);
  };

  render() {
    return (
      <SearchBox
        ref={this.onSearchBoxMounted}
        bounds={this.props.bounds}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={this.handlePlacesChanged}
      >
        <input
          type="text"
          placeholder="Search a location"
          style={{
            boxSizing: "border-box",
            border: "1px solid transparent",
            width: "300px",
            height: "29px",
            marginTop: "10px",
            padding: "0 12px",
            borderRadius: "3px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            fontSize: "14px",
            outline: "none",
            textOverflow: "ellipses",
          }}
        />
      </SearchBox>
    );
  }
}

export default AddressSearchBox;
