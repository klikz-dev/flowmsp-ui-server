import * as types from './types';

export function setCustomerLogOut(customer) {
	  return {
	    type: types.SET_CUSTOMER_LOGOUT,
	    customer
	  };
}

export function setCustomer(customer) {
  return {
    type: types.SET_CUSTOMER,
    customer
  };
}

export function setCustomerList(customers) {
	  return {
	    type: types.SET_CUSTOMER_LIST,
	    customers: customers.data
	  };
}

export function setCustomerRadiusList(customers) {
	  return {
	    type: types.SET_CUSTOMER_RADIUS_LIST,
	    customers: customers.data
	  };
}

export function setCustomerPartnersList(partners) {
	  return {
		    type: types.SET_CUSTOMER_PARTNERS_LIST,
		    partners: partners.data
		  };
}

export function setCustomerConfig(config) {
  return {
    type: types.SET_CUSTOMER_CONFIG,
    config
  };
}

export function setCustomerHydrants(hydrants) {
  return {
    type: types.SET_CUSTOMER_HYDRANTS,
    hydrants: hydrants.data
  };
}

export function setPartnerHydrants(hydrants) {
  return {
    type: types.SET_PARTNER_HYDRANTS,
    hydrants: hydrants.data
  };
}

export function setPartnerHydrantsFirst() {
	  return {
	    type: types.SET_PARTNER_HYDRANTS_FIRST,
	    hydrants: []
	  };
}

export function setCustomerLocations(locations) {
	  return {
	    type: types.SET_CUSTOMER_LOCATIONS,
	    locations: locations.data
	  };
}

export function setPartnerLocations(locations) {
	  return {
	    type: types.SET_PARTNER_LOCATIONS,
	    locations: locations.data
	  };
}

export function setPartnerLocationsFirst() {
	  return {
	    type: types.SET_PARTNER_LOCATIONS_FIRST,
	    locations: []
	  };
}

export function setCustomerLocation(location) {
	  return {
	    type: types.SET_CUSTOMER_LOCATION,
	    location: location
	  };
}

export function addCustomerLocation(location) {
  return {
    type: types.ADD_CUSTOMER_LOCATION,
    location: location
  };
}

export function deleteCustomerLocation(id) {
  return {
    type: types.DELETE_CUSTOMER_LOCATION,
    id: id
  };
}

export function editCustomerLocation(location) {
  return {
    type: types.EDIT_CUSTOMER_LOCATION,
    location: location
  };
}

export function addCustomerHydrant(hydrant) {
  return {
    type: types.ADD_CUSTOMER_HYDRANT,
    hydrant: hydrant
  };
}

export function editCustomerHydrant(hydrant) {
  return {
    type: types.EDIT_CUSTOMER_HYDRANT,
    hydrant: hydrant
  };
}

export function deleteCustomerHydrant(id) {
  return {
    type: types.DELETE_CUSTOMER_HYDRANT,
    id: id
  };
}

export function deleteCustomerHydrantAll() {
  return {
    type: types.DELETE_CUSTOMER_HYDRANT_ALL
  };
}

export function setCustomerDefaultState() {
  return {
    type: types.SET_CUSTOMER_DEFAULT_STATE
  };
}

export function setCustomerUsers(users) {
  return {
    type: types.SET_CUSTOMER_USERS,
    users: users
  };
}

//Images
export function addLocationImage(locationId, image) {
  return {
    type: types.ADD_LOCATION_IMAGE,
    locationId,
    image
  };
}

export function updateLocationImage(locationId, image) {
  return {
    type: types.UPDATE_LOCATION_IMAGE,
    locationId,
    image
  };
}

export function deleteLocationImage(locationId, imageId) {
  return {
    type: types.DELETE_LOCATION_IMAGE,
    locationId,
    imageId
  };
}

//SMS
export function setCustomerSMS(smsList) {
	  return {
	    type: types.SET_CUSTOMER_SMS,
	    smsList: smsList
	  };
}

export function setNewMessage(newSMS) {
	  return {
	    type: types.SET_NEW_MESSAGE,
	    newSMS: newSMS
	  };
}

export function setBackLogMessage(newSMS) {
	  return {
	    type: types.SET_BACKLOG_MESSAGE,
	    newSMS: newSMS
	  };
}

export function setCustomerFilterLocations(arr) {
	  return {
	    type: types.SET_CUSTOMER_FILTER_LOCATIONS,
	    filter: arr
	  };
}

export function setLocationKounter(locationKounter) {
  return{
    type: types.SET_LOCATION_KOUNTER,
    kounter: locationKounter
  };
}
