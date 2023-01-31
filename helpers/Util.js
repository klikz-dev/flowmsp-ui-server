export const ZOOM_LEVELS = {
  clusterThreshold: 15
}

export const getMarkerIcon = (isMine, dryHydrant, inService, pinColor, isSelected, zoomlevel) => {
  if (zoomlevel) {
	  if (zoomlevel <= ZOOM_LEVELS.clusterThreshold) {
		  return '/images/fire-hydrant-clust.png';
	  }
  }
  
  if (pinColor) {
    const markerIcon = '/images/icons/hydrants/hydrant-';
    let markerColor;
    if (pinColor === 'RED') {
      markerColor = 'red';
    } else if (pinColor === 'GREEN') {
      markerColor = 'green';
    } else if (pinColor === 'BLUE') {
      markerColor = 'blue';
    } else if (pinColor === 'YELLOW') {
      markerColor = 'yellow';
    } else if (pinColor === 'ORANGE') {
      markerColor = 'orange';
    } else if (pinColor === 'DRY') {
      markerColor = 'dry';
    }
    if (dryHydrant) {
    	markerColor = 'dry';
    }
    if (inService === false) {
    	markerColor = markerColor + '-cross';
    }
    if (isMine === false) {
    	markerColor = markerColor + '-partner';
    }    
    return markerIcon +
           markerColor +
           ((isSelected !== undefined) ? (`-small${  isSelected ? '-selected.png' : '.png'}`) : '.png');
  }
  if (isMine === false) {
	  return `/images/icons/hydrants/hydrant-yellow-partner-small${  isSelected ? '-selected.png' : '.png'}`;
  }
  return `/images/icons/hydrants/hydrant-yellow-small${  isSelected ? '-selected.png' : '.png'}`;
};
