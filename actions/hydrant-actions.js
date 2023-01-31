import * as types from './types';

export function setHydrantProps(hydrant, props) {
  return {
    type: types.SET_HYDRANT_PROPS,
    hydrant: hydrant,
    props: props
  };
}

export function clearSelectedHydrants() {
  return {
    type: types.CLEAR_SELECTED_HYDRANTS
  };
}

export function selectHydrantsByLocation(locationHydrantIds) {
  return {
    type: types.SELECT_HYDRANTS_BY_LOCATION,
    locationHydrantIds: locationHydrantIds
  };
}
