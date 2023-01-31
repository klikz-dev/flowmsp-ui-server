/* global google */

import React from 'react';
import DrawingManager from 'react-google-maps/lib/components/drawing/DrawingManager';

let polygons = [];
let polyLines = [];

class DrawingTools extends React.Component {

  constructor(props) {
    super();
    this.handlePolygonComplete = this.handlePolygonComplete.bind(this);
    this.handlePolylineComplete = this.handlePolylineComplete.bind(this);
    this.removePolygons = this.removePolygons.bind(this);
    this.removePolylines = this.removePolylines.bind(this);
    this.handlePathChanged = this.handlePathChanged.bind(this);
    this.handleOverlayComplete = this.handleOverlayComplete.bind(this);
  }

  removePolygons() {
    for (let i = 0; i < polygons.length; i++) {
      polygons[i].setMap(null);
    }
    polygons = [];
  }
  
  removePolylines() {
    for (let ii = 0; ii < polyLines.length; ii ++) {
      polyLines[ii].setMap(null);
    }
    polyLines = [];
  }

  handlePolygonComplete(polygon) {
    const path = polygon.getPath();
    const coords = [];
    for (let i = 0; i < path.length; i++) {
      coords.push({
        lat: path.getAt(i).lat(),
        lng: path.getAt(i).lng()
      });
    }
    this.props.onPolygonComplete(coords);
  }
  
  handlePolylineComplete(polyline) {
    this.props.onPolylineComplete(polyline);
    this.removePolylines();    
    polyLines.push(polyline);
  }

  handlePathChanged(polyline) {
    this.props.onPolylineComplete(polyline);    
  }

  handleOverlayComplete(event) {
    const newShape = event.overlay;
    newShape.type = event.type;
    if (event.type === 'polygon') {
      polygons.push(newShape);
    } else {
      google.maps.event.addListener(newShape.getPath(), 'set_at', () => { this.handlePathChanged(newShape); });
    }
  }

  render() {
    let myDrawingMode = null;
    if (this.props.show) {
      if (this.props.showOption === 'Polyline') {
        this.removePolygons();
        myDrawingMode = google.maps.drawing.OverlayType.POLYLINE;
      } else {
        this.removePolylines();
        myDrawingMode = google.maps.drawing.OverlayType.POLYGON;
      }
    } else if (this.props.show === false) {
      this.removePolylines();
    }
    const drawingToolsProps = {
      drawingMode: myDrawingMode,
      options: {
        drawingControl: this.props.show,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [ myDrawingMode],
        },
        polygonOptions: {
          fillColor: '#678b9c',
          strokeColor: '#388aa6',
          strokeOpacity: 1,
          strokeWeight: 3,
          fillOpacity: 0.7
        },
        polylineOptions: {           
          strokeOpacity: 1,
          strokeColor: 'blue',
          strokeWeight: 6,       
          editable: true,
          icons: [         
        	  		{
			          icon: {
			                    path: google.maps.SymbolPath.CIRCLE,
			                    strokeOpacity: 1,
			                    strokeColor: 'red',
			                    strokeWeight: 10,
			                    scale: 3
			                 },
			          offset: '0%'
        	  		},
		          {
		            icon: {
		                    path: 'M -1,1 1,1',
		                    strokeOpacity: 1,
		                    strokeColor: 'yellow',
		                    strokeWeight: 2,
		                    scale: 1
		                  },
		            offset: '10%',
		            repeat: '20px'
		          },
		          {
		          icon: {
		                    path: google.maps.SymbolPath.CIRCLE,
		                    strokeOpacity: 1,
		                    strokeColor: 'red',
		                    strokeWeight: 10,
		                    scale: 3
		                  },
		            offset: '100%'
		          }
		  ]
        }
      },
      onOverlayComplete: this.handleOverlayComplete,      
      onPolygonComplete: this.handlePolygonComplete,
      onPolylineComplete: this.handlePolylineComplete,
      onMarkerComplete: this.handleMarkerComplete
    };

    return (
      <DrawingManager {...drawingToolsProps} />
    );

  }

}

export default DrawingTools;
