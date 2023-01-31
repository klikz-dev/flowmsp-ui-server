/* global google */

import debounce from "lodash/debounce";
import { Component, default as React } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  Polygon,
  withGoogleMap,
} from "react-google-maps/lib";
import { MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel";
import * as util from "../../helpers/Util";
import DrawingTools from "./DrawingToolsComponent";
import MarkerInfo from "./MarkerInfoComponent";
import SearchBox from "./SearchBoxComponent";

const getGoogleMapProps = (props) => {
  return {
    ref: props.onMapMounted,
    center: props.center,
    mapTypeId: props.mapTypeId,
    zoom: props.zoom,
    onZoomChanged: props.onZoomChanged,
    onDragEnd: props.onDragEnd,
    onClick: props.onMapClick,
    onRightClick: props.onMapRightClick,
    onMapTypeIdChanged: props.onTypeIdChanged,
    onBoundsChanged: props.onBoundsChanged,
    onIdle: props.onIdle,
  };
};

const getMarkerProps = (props, marker, kounter) => {
  return {
    position: marker.position,
    onClick: () =>
      props.onMarkerEvent(
        marker,
        { isSelected: !marker.isSelected, showInfo: true },
        true
      ),
    onRightClick: (e) => props.onMarkerRightClick(e, marker),
    onMouseOut: () => props.onMarkerEvent(marker, { showInfo: false }, false),
    options: {
      icon: {
        url: util.getMarkerIcon(
          marker.isMine,
          marker.dryHydrant,
          marker.inService,
          marker.pinColor,
          marker.isSelected,
          props.zoom
        ),
        anchor: {
          x: marker.isSelected ? 25 : 7,
          y: marker.isSelected ? 29 : 13,
        },
        optimized: false,
      },
    },
  };
};

const getBlackMarkerProps = (props, marker) => {
  return {
    position: marker.position,
    options: {
      icon: {
        url: util.getMarkerIcon(
          marker.isMine,
          marker.dryHydrant,
          marker.inService,
          marker.pinColor,
          marker.isSelected,
          props.zoom
        ),
        anchor: {
          x: marker.isSelected ? 25 : 7,
          y: marker.isSelected ? 29 : 13,
        },
      },
    },
  };
};

const getLocationProps = (props, location) => {
  let polygonFillColor = "#678b9c";
  let strokeColor = "#388aa6";
  if (location.isMine) {
    if (location.isSelected) {
      polygonFillColor = "#ba646a";
    }
  } else {
    strokeColor = "#008000";
    polygonFillColor = "#808000";
    if (location.isSelected) {
      polygonFillColor = "#FF0000";
    }
  }
  return {
    options: {
      paths: location.coords,
      strokeColor: strokeColor,
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: polygonFillColor,
      fillOpacity: 0.7,
    },
    onClick: () => props.onLocationClick(location),
    onRightClick: (e) => props.onLocationRightClick(e, location),
  };
};

const getDrawingToolsProps = (props) => {
  return {
    show: props.showDrawingTools,
    showOption: props.showDrawingToolsOption,
    prevPolylineData: props.prevPolylineData,
    ref: (instance) => {
      props._this.drawingTools = instance;
    },
    onPolygonComplete: props.onPolygonComplete,
    onPolylineComplete: props.onPolylineComplete,
  };
};

const getSearchBoxProps = (props) => {
  return {
    bounds: props.bounds,
    fitMapBounds: props.fitMapBounds,
    mapCenter: props.center,
    setMapCenter: props.setCenter,
    setMarkersFromSearch: props.setMarkersFromSearch,
  };
};

const midPoint = (coords) => {
  const lats = [];
  const lngs = [];
  const coordsLength = coords.length - 1;

  for (let ii = 0; ii < coordsLength; ii++) {
    lngs.push(coords[ii].lng);
    lats.push(coords[ii].lat);
  }

  lats.sort();
  lngs.sort();
  const lowx = lats[0];
  const highx = lats[coordsLength - 1];
  const lowy = lngs[0];
  const highy = lngs[coordsLength - 1];
  const centerX = lowx + (highx - lowx) / 2;
  const centerY = lowy + (highy - lowy) / 2;
  return new google.maps.LatLng(centerX, centerY);
};

const CustomMap = withGoogleMap((props) => {
  let doClustering = props.zoom <= util.ZOOM_LEVELS.clusterThreshold;

  console.log("Zoom:", props.zoom);
  let markers = [];

  markers.push(
    !doClustering &&
      props.markersVisible.map((marker, index) => (
        <Marker key={index} {...getMarkerProps(props, marker, index)}>
          {marker.showInfo && (
            <InfoWindow
              onCloseClick={() => props.onMarkerClose(marker)}
              options={{ disableAutoPan: true }}
            >
              <MarkerInfo marker={marker} />
            </InfoWindow>
          )}
        </Marker>
      ))
  );

  markers.push(
    doClustering &&
      props.markersVisible
        .sort(function (a, b) {
          return (
            a.position.lat() +
            a.position.lng() -
            (b.position.lat() + b.position.lng())
          );
        })
        .filter(
          (marker, index, array) =>
            index === 0 ||
            index === Math.ceil(array.length / 2) ||
            index === array.length - 1
        )
        .map((marker, index) => (
          <Marker key={index} {...getBlackMarkerProps(props, marker)} />
        ))
  );

  markers.push(
    props.markersFromSearch.map((marker, index) => (
      <Marker key={index} position={marker.position} />
    ))
  );

  markers.push(
    props.zoom > 14 &&
      props.bounds &&
      props.locations
        .filter(
          (location) =>
            props.bounds.contains(location.coords[0]) ||
            props.bounds.contains(location.coords[1]) ||
            props.bounds.contains(location.coords[2]) ||
            props.bounds.contains(location.coords[3])
        )
        .map((location, index) => (
          <Polygon key={index} {...getLocationProps(props, location)} />
        ))
  );

  //  other circle markers? next 3 are all the same, except font size gets largert as you zoom in
  markers.push(
    props.zoom > 14 &&
      props.zoom < 18 &&
      props.bounds &&
      props.locations
        .filter(
          (location) =>
            props.bounds.contains(location.coords[0]) ||
            props.bounds.contains(location.coords[1]) ||
            props.bounds.contains(location.coords[2]) ||
            props.bounds.contains(location.coords[3])
        )
        .filter((location) => location.lotNumber)
        .map((location, index) => (
          <MarkerWithLabel
            key={index}
            position={midPoint(location.coords)}
            labelAnchor={new google.maps.Point(0, 0)}
            labelStyle={{
              backgroundColor: "white",
              fontSize: "6px",
              fontWeight: "bold",
              padding: "1px",
            }}
            icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 0 }}
          >
            <div>{location.lotNumber}</div>
          </MarkerWithLabel>
        ))
  );

  markers.push(
    props.zoom >= 18 &&
      props.zoom < 19 &&
      props.bounds &&
      props.locations
        .filter(
          (location) =>
            props.bounds.contains(location.coords[0]) ||
            props.bounds.contains(location.coords[1]) ||
            props.bounds.contains(location.coords[2]) ||
            props.bounds.contains(location.coords[3])
        )
        .filter((location) => location.lotNumber)
        .map((location, index) => (
          <MarkerWithLabel
            key={index}
            position={midPoint(location.coords)}
            labelAnchor={new google.maps.Point(0, 0)}
            labelStyle={{
              backgroundColor: "white",
              fontSize: "8px",
              fontWeight: "bold",
              padding: "1px",
            }}
            icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 0 }}
          >
            <div>{location.lotNumber}</div>
          </MarkerWithLabel>
        ))
  );

  markers.push(
    props.zoom >= 19 &&
      props.bounds &&
      props.locations
        .filter(
          (location) =>
            props.bounds.contains(location.coords[0]) ||
            props.bounds.contains(location.coords[1]) ||
            props.bounds.contains(location.coords[2]) ||
            props.bounds.contains(location.coords[3])
        )
        .filter((location) => location.lotNumber)
        .map((location, index) => (
          <MarkerWithLabel
            key={index}
            position={midPoint(location.coords)}
            labelAnchor={new google.maps.Point(0, 0)}
            labelStyle={{
              backgroundColor: "white",
              fontSize: "10px",
              fontWeight: "bold",
              padding: "1px",
            }}
            icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 0 }}
          >
            <div>{location.lotNumber}</div>
          </MarkerWithLabel>
        ))
  );
  markers.push();

  console.log(markers);

  return (
    <GoogleMap {...getGoogleMapProps(props)}>
      {markers}

      <DrawingTools {...getDrawingToolsProps(props)} />
      {/* <SearchBox {...getSearchBoxProps(props)} /> */}
    </GoogleMap>
  );
});

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markersLoaded: false,
      locationChangeKounter: null,
      locations: props.locations,
      bounds: null,
      markersFromSearch: [],
      visibleMarkers: [],
    };
    this.getClickLocation = this.getClickLocation.bind(this);
    this.handleMarkerEvent = this.handleMarkerEvent.bind(this);
    this.handleMapMounted = this.handleMapMounted.bind(this);
    this.handleZoomChanged = this.handleZoomChanged.bind(this);
    this.handleDragged = this.handleDragged.bind(this);
    this.handleLocationClick = this.handleLocationClick.bind(this);
    this.handleLocationRightClick = this.handleLocationRightClick.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMapRightClick = this.handleMapRightClick.bind(this);
    this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
    this.handleMarkerClose = this.handleMarkerClose.bind(this);
    this.handleTypeIdChanged = this.handleTypeIdChanged.bind(this);

    // Debounce
    this.handleZoomChanged = debounce(this.handleZoomChanged, 1000);
  }

  UNSAFE_componentWillMount() {
    this.geocoder = new google.maps.Geocoder();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.locationChangeKounter !== nextProps.locationChangeKounter) {
      this.setState({
        locationChangeKounter: nextProps.locationChangeKounter,
        locations: nextProps.locations,
      });
    }
  }

  refreshLocations(plocations) {
    if (plocations) {
      this.setState({ locations: plocations });
    } else {
      this.setState({ locations: this.props.locations });
    }
  }

  getClickLocation(latLng) {
    const projection = this._map.getProjection();
    const bounds = this._map.getBounds();
    const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
    const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
    const scale = Math.pow(2, this._map.getZoom());
    const worldPoint = projection.fromLatLngToPoint(latLng);
    return {
      x: Math.floor((worldPoint.x - bottomLeft.x) * scale) + 40,
      y: Math.floor((worldPoint.y - topRight.y) * scale) + 20,
    };
  }

  handleMapMounted(map) {
    this._map = map;
  }

  handleZoomChanged() {
    const nextZoom = this._map.getZoom();
    if (nextZoom !== this.props.zoom) {
      this.props.handleZoomChanged(nextZoom);
    }
    this.setState({ bounds: this._map.getBounds() });
  }

  handleDragged = (e) => {
    this.setCenter();
  };

  handleBoundsChanged = (e) => {
    this.setState({ bounds: this._map.getBounds() });
  };

  handleOnIdle = (e) => {
    this.setCenter();
    this.setVisibleMarkers();
  };

  handleTypeIdChanged() {
    this.props.handleMapTypeChanged(this._map.getMapTypeId());
  }

  handleMarkerEvent(targetMarker, markerProps, handleHydrantClick) {
    this.props.setMarkerProps(targetMarker, markerProps);
  }

  handleLocationClick(targetLocation, isEdit) {
    let isLocationSelected = false;
    this.setState(
      {
        locations: this.state.locations.map((location) => {
          if (location.id === targetLocation.id) {
            if (isEdit) {
              isLocationSelected = true;
            } else {
              isLocationSelected = !targetLocation.isSelected;
            }
            return {
              ...location,
              isSelected: isLocationSelected,
            };
          }
          return {
            ...location,
            isSelected: false,
          };
        }),
      },
      () => {
        this.props.selectMarkersByLocation(isLocationSelected, targetLocation);
        this.props.handleLocationClick(isLocationSelected, targetLocation);
      }
    );
  }

  handleLocationRightClick(e, targetLocation) {
    if (targetLocation.isMine) {
      this.props.handleLocationRightClick(
        this.getClickLocation(e.latLng),
        targetLocation
      );
    }
  }

  handleMapClick(e) {
    this.props.handleMapClick();
  }

  handleMapRightClick(e) {
    const _props = this.props;
    this.geocoder.geocode(
      {
        latLng: e.latLng,
      },
      function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            _props.handleMapRightClick(
              e.pixel,
              { lat: e.latLng.lat(), lng: e.latLng.lng() },
              results[0].formatted_address
            );
          }
        }
      }
    );
  }

  handleMarkerClose(marker) {
    this.props.setMarkerProps(marker, { showInfo: false }, false);
  }

  handleMarkerRightClick(e, marker) {
    if (marker.isMine) {
      this.props.handleHydrantRightClick(
        this.getClickLocation(e.latLng),
        marker
      );
    }
  }

  setCenter = (center) => {
    let nextLat;
    let nextLng;
    if (center) {
      nextLat = center.lat();
      nextLng = center.lng();
    } else {
      nextLat = this._map.getCenter().lat();
      nextLng = this._map.getCenter().lng();
    }
    if (
      nextLat !== this.props.center.lat &&
      nextLng !== this.props.center.lng
    ) {
      this.props.handleCenterChanged({ lat: nextLat, lng: nextLng });
    }
  };

  setZoom = (zoom) => {
    if (zoom) {
      this.props.handleZoomChanged(zoom);
    }
  };

  fitMapBounds = (bounds) => {
    this._map.fitBounds(bounds);
  };

  setMarkersFromSearch = (markers) => {
    this.setState({ markersFromSearch: markers });
  };

  setMarkersFromAddress = (markers) => {
    this.setState({ markersFromSearch: markers });
  };

  toRadian = (x) => {
    return (x * Math.PI) / 180;
  };

  getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6378137; // Earth'mean radius in meter
    const dLat = this.toRadian(lat2 - lat1);
    const dLong = this.toRadian(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadian(lat1)) *
        Math.cos(this.toRadian(lat2)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d / 1000; // returns the distance in kilometer
  };

  setVisibleMarkers() {
    const visibleMarkers = this.state.visibleMarkers;
    const drawMarkers = [];
    for (let ii = 0; ii < this.props.markers?.length; ii++) {
      if (this.state.bounds) {
        if (!this.state.bounds.contains(this.props.markers[ii].position)) {
          continue;
        }
      }
      drawMarkers.push(this.props.markers[ii]);
    }
    //If there is any difference only then set the state
    let isEqual = true;
    if (visibleMarkers.length === drawMarkers.length) {
      //Now check for
      for (let jj = 0; jj < visibleMarkers.length; jj++) {
        if (visibleMarkers[jj].position !== drawMarkers[jj].position) {
          isEqual = false;
          break;
        }
      }
      if (isEqual) {
        return;
      }
    }
    this.setState({ visibleMarkers: [] });
    this.setState({ visibleMarkers: drawMarkers });
  }

  getCustomMapProps(props) {
    return {
      ...props,
      _this: this,
      markers: this.props.markers,
      markersVisible: this.state.visibleMarkers,
      markersFromSearch: this.state.markersFromSearch,
      locations: this.state.locations,
      content: this.state.content,
      bounds: this.state.bounds,
      fitMapBounds: this.fitMapBounds,
      setCenter: this.setCenter,
      setMarkersFromSearch: this.setMarkersFromSearch,
      setMarkersFromAddress: this.setMarkersFromAddress,
      onMarkerEvent: this.handleMarkerEvent,
      onMapMounted: this.handleMapMounted,
      onZoomChanged: this.handleZoomChanged,
      onDragEnd: this.handleDragged,
      onLocationClick: this.handleLocationClick,
      onLocationRightClick: this.handleLocationRightClick,
      onMapClick: this.handleMapClick,
      onMapRightClick: this.handleMapRightClick,
      onMarkerRightClick: this.handleMarkerRightClick,
      onMarkerClose: this.handleMarkerClose,
      onTypeIdChanged: this.handleTypeIdChanged,
      onPolygonComplete: props.handlePolygonComplete,
      onPolylineComplete: props.handlePolylineComplete,
      onBoundsChanged: this.handleBoundsChanged,
      onIdle: this.handleOnIdle,
    };
  }

  render() {
    if (this.props.selectedLocation) {
      return (
        <div className="map-container">
          <CustomMap
            {...this.getCustomMapProps(this.props)}
            mapElement={<div style={{ height: "100%" }} />}
            containerElement={<div style={{ height: "100%" }} />}
          />
        </div>
      );
    }
    return (
      <div className="map-container1">
        <CustomMap
          {...this.getCustomMapProps(this.props)}
          mapElement={<div style={{ height: "100%" }} />}
          containerElement={<div style={{ height: "100%" }} />}
        />
      </div>
    );
  }
}

export default MapComponent;
