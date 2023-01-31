/* global google */

import * as types from "../actions/types";
import moment from "moment";

const defaultState = {
  pinLegend: {},
  config: {},
  hydrants: [],
  selectedHydrants: [],
  partnerLocations: [],
  locations: [],
  origLocations: [],
  currentLocation: null,
  users: [],
  customerList: [],
  customerRadiusList: [],
  partners: [],
  smsList: [],
  customerId: null,
  locationChangeKounter: null,
  locationFilterApplied: null,
  locationKounter: 0,
  locationsFetched: null,
  hydrantsFetched: null,
};

const getHydrant = (hydrantData, isMine) => {
  return {
    id: hydrantData.id,
    // position: new google.maps.LatLng(
    //   hydrantData.latLon.latitude,
    //   hydrantData.latLon.longitude
    // ),
    lat: hydrantData.latLon.latitude,
    lon: hydrantData.latLon.longitude,
    showInfo: false,
    hydrantSize: hydrantData.size ? hydrantData.size.toString() : null,
    hydrantFlowRate: hydrantData.flow ? hydrantData.flow : null,
    hydrantNotes: hydrantData.notes,
    isSelected: false,
    pinColor:
      hydrantData.flowRange && hydrantData.flowRange.pinColor
        ? hydrantData.flowRange.pinColor
        : null,
    address: hydrantData.streetAddress ? hydrantData.streetAddress : "",
    externalRef: hydrantData.externalRef ? hydrantData.externalRef : "",
    inService: hydrantData.inService ? hydrantData.inService : false,
    dryHydrant: hydrantData.dryHydrant ? hydrantData.dryHydrant : false,
    outServiceDate: hydrantData.outServiceDate
      ? hydrantData.outServiceDate
      : null,
    isMine: isMine,
  };
};

export default function customerReducer(state = defaultState, action) {
  switch (action.type) {
    case types.SET_CUSTOMER_LOGOUT: {
      return Object.assign({}, state, defaultState);
    }
    case types.SET_CUSTOMER: {
      const uiConfig = action.customer.uiConfig;
      const newCustomerState = {
        config: {
          lat: uiConfig && uiConfig.lastLat ? uiConfig.lastLat : null, //41.35, // Default Indianapolis lat
          lon: uiConfig && uiConfig.lastLon ? uiConfig.lastLon : null, //-88.84, // Default Indianapolis lon
          zoom: uiConfig && uiConfig.lastZoom ? uiConfig.lastZoom : 14,
          mapeType:
            uiConfig && uiConfig.lastMapType
              ? uiConfig.lastMapType
              : "satellite",
        },
        customerId: action.customer.id,
        pinLegend: action.customer.pinLegend,
        links: action.customer.links,
        name: action.customer.name,
        address: action.customer.address,
        address1: action.customer.address
          ? action.customer.address.address1
          : "",
        address2: action.customer.address
          ? action.customer.address.address2
          : "",
        city: action.customer.address ? action.customer.address.city : "",
        state: action.customer.address ? action.customer.address.state : "",
        zip: action.customer.address ? action.customer.address.zip : "",
        latitude:
          action.customer.address && action.customer.address.latLon
            ? action.customer.address.latLon.latitude
            : "",
        longitude:
          action.customer.address && action.customer.address.latLon
            ? action.customer.address.latLon.longitude
            : "",
        licence: action.customer.license,
        smsNumber: action.customer.smsNumber,
        smsFormat: action.customer.smsFormat,
        emailGateway: action.customer.emailGateway,
        emailFormat: action.customer.emailFormat,
        emailSignature: action.customer.emailSignature,
        emailSignatureLocation: action.customer.emailSignatureLocation,
        fromContains: action.customer.fromContains,
        toContains: action.customer.toContains,
        subjectContains: action.customer.subjectContains,
        bodyContains: action.customer.bodyContains,
        fromNotContains: action.customer.fromNotContains,
        toNotContains: action.customer.toNotContains,
        subjectNotContains: action.customer.subjectNotContains,
        bodyNotContains: action.customer.bodyNotContains,
        boundSWLat: action.customer.boundSWLat,
        boundSWLon: action.customer.boundSWLon,
        boundNELat: action.customer.boundNELat,
        boundNELon: action.customer.boundNELon,
        dataSharingConsent: action.customer.dataSharingConsent,
        dispatchSharingConsent: action.customer.dispatchSharingConsent,
        timeZone: action.customer.timeZone
          ? action.customer.timeZone
          : "America/Chicago",
      };
      return Object.assign({}, state, newCustomerState);
    }
    case types.SET_CUSTOMER_LIST: {
      const customers = action.customers;
      return Object.assign({}, state, { customerList: customers });
    }
    case types.SET_CUSTOMER_RADIUS_LIST: {
      const customers = action.customers;
      return Object.assign({}, state, { customerRadiusList: customers });
    }
    case types.SET_CUSTOMER_PARTNERS_LIST: {
      const partnersRec = action.partners;
      const partnersArr = [];
      if (partnersRec) {
        for (let ii = 0; ii < partnersRec.length; ii++) {
          partnersArr.push(partnersRec[ii].partnerId);
        }
      }
      return Object.assign({}, state, { partners: partnersArr });
    }
    case types.SET_CUSTOMER_CONFIG: {
      const newConfig = Object.assign({}, state.config);
      if (action.config && action.config.lastLat) {
        newConfig.lat = action.config.lastLat;
      }
      if (action.config && action.config.lastLon) {
        newConfig.lon = action.config.lastLon;
      }
      if (action.config && action.config.lastZoom) {
        newConfig.zoom = action.config.lastZoom;
      }
      if (action.config && action.config.lastMapType) {
        newConfig.mapeType = action.config.lastMapType;
      }
      return Object.assign({}, state, { config: newConfig });
    }

    case types.SET_CUSTOMER_HYDRANTS: {
      const hydrants = [];
      if (action.hydrants) {
        const hydrantsData = action.hydrants;
        if (hydrantsData.length > 0) {
          for (let i = 0; i < hydrantsData.length; i++) {
            hydrants.push(getHydrant(hydrantsData[i], true));
          }
        }
      }
      const partnerHydrants = Object.assign([], state.partnerHydrants);
      for (let i = 0; i < partnerHydrants.length; i++) {
        const lat = partnerHydrants[i].lat;
        const lon = partnerHydrants[i].lon;
        const alreadyPresent = hydrants.filter(
          (h) =>
            h.lat - lat >= -0.0000001 &&
            h.lat - lat <= 0.0000001 &&
            h.lon - lon >= -0.0000001 &&
            h.lon - lon <= 0.0000001
        );
        if (alreadyPresent && alreadyPresent.length <= 0) {
          hydrants.push(partnerHydrants[i]);
        }
      }

      return Object.assign({}, state, {
        hydrants: hydrants,
        hydrantsFetched: true,
      });
    }

    case types.SET_PARTNER_HYDRANTS_FIRST: {
      return Object.assign({}, state, { partnerHydrants: [] });
    }

    case types.SET_PARTNER_HYDRANTS: {
      const existPartnerHydrants = Object.assign([], state.partnerHydrants);
      if (action.hydrants) {
        const partnerHydrants = action.hydrants;
        if (partnerHydrants.length > 0) {
          for (let i = 0; i < partnerHydrants.length; i++) {
            existPartnerHydrants.push(getHydrant(partnerHydrants[i], false));
          }
        }
      }
      return Object.assign({}, state, {
        partnerHydrants: existPartnerHydrants,
      });
    }
    case types.SET_LOCATION_KOUNTER:
      return Object.assign({}, state, {
        locationKounter: action.kounter ? action.kounter : 0,
      });

    case types.SET_CUSTOMER_LOCATIONS: {
      const locationsArr = Object.assign([], state.partnerLocations);
      if (action.locations) {
        const locationsData = action.locations;
        if (locationsData.length > 0) {
          for (let ii = 0; ii < locationsData.length; ii++) {
            const row = locationsData[ii];
            row.isMine = true;
            const locationAlreadyPresent = locationsArr.filter(
              (l) => l.id === row.id
            );
            if (locationAlreadyPresent && locationAlreadyPresent.length <= 0) {
              locationsArr.push(row);
            }
          }
        }
      }
      const origLocationsArr = Object.assign([], locationsArr);
      return Object.assign({}, state, {
        locations: locationsArr,
        origLocations: origLocationsArr,
        locationsFetched: true,
        locationFilterApplied: null,
        locationChangeKounter: new Date().getTime(),
      });
    }

    case types.SET_PARTNER_LOCATIONS_FIRST:
      return Object.assign({}, state, { partnerLocations: [] });

    case types.SET_PARTNER_LOCATIONS: {
      const existPartnerLocations = Object.assign([], state.partnerLocations);
      if (action.locations) {
        const partnerLocations = action.locations;
        if (partnerLocations.length > 0) {
          for (let jj = 0; jj < partnerLocations.length; jj++) {
            const partnerRow = partnerLocations[jj];
            partnerRow.isMine = false;
            const locationAlreadyPresent = existPartnerLocations.filter(
              (l) => l.id === partnerRow.id
            );
            if (locationAlreadyPresent && locationAlreadyPresent.length <= 0) {
              existPartnerLocations.push(partnerRow);
            }
          }
        }
      }
      return Object.assign({}, state, {
        partnerLocations: existPartnerLocations,
      });
    }

    case types.SET_CUSTOMER_FILTER_LOCATIONS: {
      const locationsFilterData = action.filter;
      const locationFilterApplied = [];
      let prevLocationsArr = Object.assign([], state.origLocations);
      for (let knt1 = 0; knt1 < locationsFilterData.length; knt1++) {
        const eachFieldVal = locationsFilterData[knt1].value;
        const eachFieldName = locationsFilterData[knt1].field;
        if (eachFieldName === "excludePartner") {
          prevLocationsArr = prevLocationsArr.filter((x) => x.isMine);
          locationFilterApplied.push(" Exclude partner");
        } else if (eachFieldName === "selectBuildingInfo") {
          if (eachFieldVal === "Present") {
            locationFilterApplied.push(`Building info ${eachFieldVal}`);
            prevLocationsArr = prevLocationsArr.filter(
              (x) =>
                x.building &&
                (x.building.occupancyType ||
                  x.building.constructionType ||
                  x.building.roofType ||
                  x.building.roofConstruction ||
                  x.building.roofMaterial ||
                  x.building.sprinklered ||
                  x.building.standPipe ||
                  x.building.fireAlarm ||
                  x.building.normalPopulation ||
                  x.building.hoursOfOperation ||
                  x.building.ownerContact ||
                  x.building.ownerPhone)
            );
          } else if (eachFieldVal === "Not present") {
            prevLocationsArr = prevLocationsArr.filter(
              (x) =>
                !x.building ||
                (!x.building.occupancyType &&
                  !x.building.constructionType &&
                  !x.building.roofType &&
                  !x.building.roofConstruction &&
                  !x.building.roofMaterial &&
                  !x.building.sprinklered &&
                  !x.building.standPipe &&
                  !x.building.fireAlarm &&
                  !x.building.normalPopulation &&
                  !x.building.hoursOfOperation &&
                  !x.building.ownerContact &&
                  !x.building.ownerPhone)
            );
            locationFilterApplied.push(`Building info ${eachFieldVal}`);
          }
        } else if (eachFieldName === "commercial") {
          prevLocationsArr = prevLocationsArr.filter(
            (x) =>
              x.building &&
              (x.building.occupancyType === "Business / Mercantile" ||
                x.building.occupancyType === "Industrial")
          );
          locationFilterApplied.push(" Commercial");
        } else if (eachFieldName === "vacant") {
          prevLocationsArr = prevLocationsArr.filter(
            (x) => x.building && x.building.normalPopulation === "Vacant"
          );
          locationFilterApplied.push(" Vacant");
        } else if (eachFieldName === "sprinklered") {
          prevLocationsArr = prevLocationsArr.filter(
            (x) =>
              x.building &&
              (x.building.sprinklered === "Dry System" ||
                x.building.sprinklered === "Wet System" ||
                x.building.sprinklered === "Both")
          );
          locationFilterApplied.push(" Sprinklered");
        } else if (eachFieldName === "nonSprinklered") {
          prevLocationsArr = prevLocationsArr.filter(
            (x) =>
              x.building &&
              (!x.building.sprinklered ||
                (x.building.sprinklered &&
                  (x.building.sprinklered === "" ||
                    x.building.sprinklered === "None")))
          );
          locationFilterApplied.push(" Non sprinklered");
        } else if (eachFieldName === "withPictures") {
          prevLocationsArr = prevLocationsArr.filter((x) => x.imageLength > 0);
          locationFilterApplied.push(" With pictures");
        } else if (eachFieldName === "withoutPictures") {
          prevLocationsArr = prevLocationsArr.filter((x) => x.imageLength <= 0);
          locationFilterApplied.push(" Without pictures");
        } else if (eachFieldName === "trussRoof") {
          prevLocationsArr = prevLocationsArr.filter(
            (x) =>
              x.building &&
              (x.building.roofType === "Bowstring Truss" ||
                x.building.roofConstruction === "Steel Truss - Open Web" ||
                x.building.roofConstruction === "Wood Truss - Closed Web" ||
                x.building.roofConstruction === "Wood Truss - Open Web")
          );
          locationFilterApplied.push(" Truss Roof");
        } else if (eachFieldName === "standpipes") {
          prevLocationsArr = prevLocationsArr.filter(
            (x) => x.building && x.building.standPipe === "Yes"
          );
          locationFilterApplied.push(" Standpipes");
        } else if (eachFieldName === "fireAlarm") {
          prevLocationsArr = prevLocationsArr.filter(
            (x) => x.building && x.building.fireAlarm === "Yes"
          );
          locationFilterApplied.push(" Fire Alarms");
        } else if (eachFieldName === "multiFamily") {
          prevLocationsArr = prevLocationsArr.filter(
            (x) => x.building && x.building.occupancyType === "Multi-Family"
          );
          locationFilterApplied.push(" Multi-family");
        } else if (eachFieldName === "special") {
          prevLocationsArr = prevLocationsArr.filter(
            (x) =>
              x.building && x.building.occupancyType === "Special Structures"
          );
          locationFilterApplied.push(" Special Structures");
        } else if (eachFieldName === "selectPreplanAge") {
          const todaysDateTime = moment();
          if (eachFieldVal === "withinThirtyDays") {
            prevLocationsArr = prevLocationsArr.filter(
              (x) =>
                x.building &&
                todaysDateTime.diff(
                  moment.utc(x.building.originalPrePlan, "MM-DD-YYYY HH.mm.ss"),
                  "days"
                ) <= 30
            );
            locationFilterApplied.push(" Pre-plan within last 30 days");
          } else if (eachFieldVal === "olderThanAYear") {
            prevLocationsArr = prevLocationsArr.filter(
              (x) =>
                x.building &&
                todaysDateTime.diff(
                  moment.utc(x.building.originalPrePlan, "MM-DD-YYYY HH.mm.ss"),
                  "days"
                ) > 365
            );
            locationFilterApplied.push(" Pre-plan older than a year");
          }
        } else if (eachFieldName === "roofAreaMin") {
          prevLocationsArr = prevLocationsArr.filter(
            (x) => x.roofArea >= eachFieldVal
          );
          locationFilterApplied.push(` Area minimum  ${eachFieldVal}`);
        } else if (eachFieldName === "roofAreaMax") {
          prevLocationsArr = prevLocationsArr.filter(
            (x) => x.roofArea <= eachFieldVal
          );
          locationFilterApplied.push(` Area maximum ${eachFieldVal}`);
        }
      }
      return Object.assign({}, state, {
        locations: prevLocationsArr,
        locationFilterApplied: locationFilterApplied,
        locationChangeKounter: new Date().getTime(),
      });
    }

    case types.SET_CUSTOMER_LOCATION: {
      const allLocations = Object.assign([], state.locations);
      for (let kk = 0; kk < allLocations.length; kk++) {
        if (allLocations[kk].id === action.location.id) {
          allLocations[kk].images = action.location.images;
          allLocations[kk].building = action.location.building;
          allLocations[kk].imageLength = action.location.imageLength;
          break;
        }
      }
      const allLocationsOrig = Object.assign([], state.origLocations);
      for (let kk = 0; kk < allLocationsOrig.length; kk++) {
        if (allLocationsOrig[kk].id === action.location.id) {
          allLocationsOrig[kk].images = action.location.images;
          allLocationsOrig[kk].building = action.location.building;
          allLocationsOrig[kk].imageLength = action.location.imageLength;
          break;
        }
      }
      return Object.assign(
        {},
        state,
        { locations: allLocations },
        { origLocations: allLocationsOrig }
      );
    }

    case types.ADD_CUSTOMER_LOCATION: {
      const locations = Object.assign([], state.locations);
      const origLocations = Object.assign([], state.origLocations);
      const newLocation = action.location;
      newLocation.isMine = true;
      locations.push(newLocation);
      origLocations.push(newLocation);

      return Object.assign({}, state, {
        locations: locations,
        origLocations: origLocations,
        currentLocation: newLocation,
        locationChangeKounter: new Date().getTime(),
      });
    }

    case types.DELETE_CUSTOMER_LOCATION: {
      const locations = Object.assign([], state.locations);
      const origLocations = Object.assign([], state.origLocations);
      for (let i = 0; i < locations.length; i++) {
        if (locations[i].id === action.id) {
          locations.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < origLocations.length; i++) {
        if (origLocations[i].id === action.id) {
          origLocations.splice(i, 1);
          break;
        }
      }

      return Object.assign({}, state, {
        locations: locations,
        origLocations: origLocations,
        currentLocation: null,
        locationChangeKounter: new Date().getTime(),
      });
    }

    case types.EDIT_CUSTOMER_LOCATION: {
      const locations = Object.assign([], state.locations);
      const origLocations = Object.assign([], state.origLocations);
      const newLocation = action.location;
      newLocation.isMine = true;
      for (let i = 0; i < locations.length; i++) {
        if (locations[i].id === action.location.id) {
          locations[i] = action.location;
          break;
        }
      }

      for (let i = 0; i < origLocations.length; i++) {
        if (origLocations[i].id === action.location.id) {
          origLocations[i] = action.location;
          break;
        }
      }

      return Object.assign({}, state, {
        locations: locations,
        origLocations: origLocations,
        currentLocation: newLocation,
        locationChangeKounter: new Date().getTime(),
      });
    }

    case types.ADD_CUSTOMER_HYDRANT: {
      const hydrants = Object.assign([], state.hydrants);
      hydrants.push(getHydrant(action.hydrant, true));
      return Object.assign({}, state, { hydrants: hydrants });
    }

    case types.EDIT_CUSTOMER_HYDRANT: {
      const hydrants = Object.assign([], state.hydrants);
      for (let i = 0; i < hydrants.length; i++) {
        if (hydrants[i].id === action.hydrant.id) {
          hydrants[i] = getHydrant(action.hydrant, true);
          break;
        }
      }
      return Object.assign({}, state, { hydrants: hydrants });
    }

    case types.DELETE_CUSTOMER_HYDRANT: {
      const hydrants = Object.assign([], state.hydrants);
      for (let i = 0; i < hydrants.length; i++) {
        if (hydrants[i].id === action.id) {
          hydrants.splice(i, 1);
          break;
        }
      }
      return Object.assign({}, state, { hydrants: hydrants });
    }

    case types.DELETE_CUSTOMER_HYDRANT_ALL: {
      let hydrantArr = Object.assign([], state.hydrants);
      hydrantArr = hydrantArr.filter((hydrant) => hydrant.isMine !== true);
      return Object.assign({}, state, { hydrants: hydrantArr });
    }

    case types.SET_HYDRANT_PROPS: {
      const hydrants = Object.assign([], state.hydrants);
      const selectedHydrants = Object.assign([], state.selectedHydrants);
      for (let i = 0; i < hydrants.length; i++) {
        if (hydrants[i].id === action.hydrant.id) {
          for (const prop in action.props) {
            if (action.props[prop] !== undefined) {
              hydrants[i][prop] = action.props[prop];
            }
          }
          if (action.props.hasOwnProperty("isSelected")) {
            if (action.props.isSelected) {
              selectedHydrants.push(hydrants[i]);
            } else {
              for (let j = 0; j < selectedHydrants.length; j++) {
                if (selectedHydrants[j].id === action.hydrant.id) {
                  selectedHydrants.splice(j, 1);
                  break;
                }
              }
            }
          }
          break;
        }
      }
      return Object.assign({}, state, {
        hydrants: hydrants,
        selectedHydrants: selectedHydrants,
      });
    }

    case types.CLEAR_SELECTED_HYDRANTS: {
      const hydrants = Object.assign([], state.hydrants);
      for (let i = 0; i < hydrants.length; i++) {
        hydrants[i].isSelected = false;
      }
      return Object.assign({}, state, {
        hydrants: hydrants,
        selectedHydrants: [],
      });
    }

    case types.SET_CUSTOMER_USERS: {
      const users = action.users;
      return Object.assign({}, state, { users: users });
    }

    case types.SELECT_HYDRANTS_BY_LOCATION: {
      const hydrants = Object.assign([], state.hydrants);
      const selectedHydrants = Object.assign([], state.selectedHydrants);
      for (let i = 0; i < hydrants.length; i++) {
        if (action.locationHydrantIds.indexOf(hydrants[i].id) > -1) {
          hydrants[i].isSelected = true;
          selectedHydrants.push(hydrants[i]);
        }
      }
      return Object.assign({}, state, {
        hydrants: hydrants,
        selectedHydrants: selectedHydrants,
      });
    }

    case types.SET_CUSTOMER_DEFAULT_STATE: {
      return Object.assign({}, state, {
        pinLegend: {},
        config: {},
        hydrants: [],
        selectedHydrants: [],
        locations: [],
        origLocations: [],
        locationChangeKounter: null,
        locationFilterApplied: null,
        currentLocation: null,
      });
    }

    //IMAGES
    case types.ADD_LOCATION_IMAGE: {
      const addImageLocations = Object.assign([], state.locations);
      const addImageLocation =
        addImageLocations[
          addImageLocations.findIndex((l) => l.id === action.locationId)
        ];
      const addImageOrigLocations = Object.assign([], state.origLocations);
      const addImageOrigLocation =
        addImageOrigLocations[
          addImageOrigLocations.findIndex((l) => l.id === action.locationId)
        ];

      if (addImageLocation) {
        if (addImageLocation.images) {
          addImageLocation.images = [...addImageLocation.images, action.image];
        } else {
          addImageLocation.images = [action.image];
        }
        addImageLocation.imageLength = addImageLocation.images.length;
      }
      if (addImageOrigLocation) {
        if (addImageOrigLocation.images) {
          if (
            addImageOrigLocation.images.findIndex(
              (l) => l.id === action.image.id
            ) < 0
          ) {
            addImageOrigLocation.images = [
              ...addImageOrigLocation.images,
              action.image,
            ];
          }
        } else {
          addImageOrigLocation.images = [action.image];
        }
        addImageOrigLocation.imageLength = addImageOrigLocation.images.length;
      }

      return Object.assign({}, state, {
        locations: addImageLocations,
        origLocations: addImageOrigLocations,
      });
    }

    case types.DELETE_LOCATION_IMAGE: {
      const deleteImageLocations = Object.assign([], state.locations);
      const deleteImageLocation =
        deleteImageLocations[
          deleteImageLocations.findIndex((l) => l.id === action.locationId)
        ];
      deleteImageLocation.images = deleteImageLocation.images.filter(
        (i) => i.id !== action.imageId
      );
      deleteImageLocation.imageLength = deleteImageLocation.images.length;

      const deleteImageOrigLocations = Object.assign([], state.origLocations);
      const deleteImageOrigLocation =
        deleteImageOrigLocations[
          deleteImageOrigLocations.findIndex((l) => l.id === action.locationId)
        ];
      deleteImageOrigLocation.images = deleteImageOrigLocation.images.filter(
        (i) => i.id !== action.imageId
      );
      deleteImageOrigLocation.imageLength =
        deleteImageOrigLocation.images.length;

      return Object.assign({}, state, {
        locations: deleteImageLocations,
        origLocations: deleteImageOrigLocations,
      });
    }

    case types.UPDATE_LOCATION_IMAGE: {
      const updateImageLocations = Object.assign([], state.locations);
      const updateImageLocation =
        updateImageLocations[
          updateImageLocations.findIndex((l) => l.id === action.locationId)
        ];
      const updatedImages = [...updateImageLocation.images];
      const updatedImage = action.image;
      if (updatedImage.hrefAnnotated) {
        updatedImage.hrefAnnotated += `?ts=${Date.now()}`; // hack to make sure image isn't cached
      }
      updatedImages[updatedImages.findIndex((i) => i.id === action.image.id)] =
        updatedImage;
      updateImageLocation.images = updatedImages;

      const updateImageLocationsOrig = Object.assign([], state.origLocations);
      const updateImageLocationOrig =
        updateImageLocationsOrig[
          updateImageLocationsOrig.findIndex((l) => l.id === action.locationId)
        ];
      const updatedImagesOrig = [...updateImageLocationOrig.images];
      const updatedImageOrig = action.image;
      if (updatedImageOrig.hrefAnnotated) {
        updatedImageOrig.hrefAnnotated += `?ts=${Date.now()}`; // hack to make sure image isn't cached
      }
      updatedImagesOrig[
        updatedImagesOrig.findIndex((i) => i.id === action.image.id)
      ] = updatedImageOrig;
      updateImageLocationsOrig.images = updatedImagesOrig;

      return Object.assign({}, state, {
        locations: updateImageLocations,
        origLocations: updateImageLocationsOrig,
      });
    }

    case types.SET_CUSTOMER_SMS: {
      const uniqList = uniqBy(action.smsList, JSON.stringify);
      return Object.assign({}, state, { smsList: uniqList });
    }

    case types.SET_NEW_MESSAGE: {
      const newMsg = JSON.parse(action.newSMS);
      let smsList = state.smsList;
      let alreadyPresent = false;
      if (!state.dispatchSharingConsent && state.customerId) {
        if (JSON.parse(sessionStorage.customerID).href !== newMsg.customerID) {
          alreadyPresent = true;
        }
      } else {
        if (JSON.parse(sessionStorage.customerID).href !== newMsg.customerID) {
          newMsg.isOthers = true;
        }
      }
      for (let ii = 0; ii < smsList.length; ii++) {
        if (smsList[ii].sequence === newMsg.sequence) {
          alreadyPresent = true;
          break;
        }
      }
      if (!alreadyPresent) {
        smsList = [newMsg, ...state.smsList];
      }
      smsList.sort(function (a, b) {
        return b.sequence - a.sequence;
      });
      return Object.assign({}, state, { smsList: smsList });
    }

    case types.SET_BACKLOG_MESSAGE: {
      const backlogMsg = JSON.parse(action.newSMS);
      let backsmsList = state.smsList;
      let backalreadyPresent = false;
      if (!state.dispatchSharingConsent && state.customerId) {
        if (
          JSON.parse(sessionStorage.customerID).href !== backlogMsg.customerID
        ) {
          backalreadyPresent = true;
        }
      } else {
        if (
          JSON.parse(sessionStorage.customerID).href !== backlogMsg.customerID
        ) {
          backlogMsg.isOthers = true;
        }
      }
      for (let ii = 0; ii < backsmsList.length; ii++) {
        if (backsmsList[ii].sequence === backlogMsg.sequence) {
          backalreadyPresent = true;
          break;
        }
      }
      if (!backalreadyPresent) {
        backsmsList = [backlogMsg, ...state.smsList];
      }
      backsmsList.sort(function (a, b) {
        return b.sequence - a.sequence;
      });
      return Object.assign({}, state, { smsList: backsmsList });
    }
    default:
      return state;
  }
}

function uniqBy(a, key) {
  const seen = new Set();
  return a.filter((item) => {
    const k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
}
