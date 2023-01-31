import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import fs from "fs/promises";
import path from "path";
import Image from "next/image";
import getConfig from "next/config";

import {
  Tabs,
  Tab,
  ProgressBar,
  Button,
  FormControl,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";

import {
  setCustomer as setCustomerAction,
  setCustomerConfig as setCustomerConfigAction,
  setCustomerHydrants as setCustomerHydrantsAction,
  setPartnerHydrants as setPartnerHydrantsAction,
  setCustomerLocations as setCustomerLocationsAction,
  setPartnerLocationsFirst as setPartnerLocationsFirstAction,
  setPartnerLocations as setPartnerLocationsAction,
  setCustomerUsers as setCustomerUsersAction,
  setCustomerPartnersList as setCustomerPartnersListAction,
} from "../actions/customer-actions";
import {
  setHydrantProps as setHydrantPropsAction,
  clearSelectedHydrants as clearSelectedHydrantsAction,
  selectHydrantsByLocation as selectHydrantsByLocationAction,
} from "../actions/hydrant-actions";

import * as customerAPI from "../api/CustomerAPI";
import * as hydrantAPI from "../api/HydrantAPI";
import * as locationAPI from "../api/LocationAPI";
import * as UserAPI from "../api/UserAPI";

import Map from "../components/map/MapComponent";
import ContextMenu from "../components/common/ContextMenuComponent";
import MyLoader from "../components/common/LoaderComponent";
import FlowData from "../components/common/FlowDataComponent";
import SMSListInfo from "../components/common/SMSListComponent";
import HydrantsInfo from "../components/common/HydrantsInfoComponent";
import LocationData from "../components/common/LocationDataComponent";
import BuildingData from "../components/common/BuildingDataComponent";
import IconLegend from "../components/common/IconLegendComponent";
import Lightbox from "../components/common/LightboxComponent";
import Modal from "../components/common/ModalComponent";
import HydrantDetailsForm from "../components/form/HydrantDetailsFormComponent";
import ConfirmForm from "../components/form/ConfirmFormComponent";
import TagForm from "../components/form/TagFormComponent";
import DialogForm from "../components/form/DialogFormComponent";
import ImageStrip from "../components/imageStrip/ImageStrip";
import AnnotatorContainer from "../containers/AnnotatorContainer";
// import ReactDock from "../components/ReactDock/ReactDock";
import style from "../styles/ReactDock.module.scss";
import sliderToggle from "../styles/sliderToggle.module.scss";
import Capture from "html2canvas";
// import MainContainer from "../containers/MainContainer";

const CustomersFilePath = path.join(process.cwd(), "customers.json");
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

function saveCustomersToFile(customers) {
  const customerObj = {};
  for (let customer of customers) {
    customerObj[customer.slug] = customer;
  }
  return fs.writeFile(CustomersFilePath, JSON.stringify(customerObj));
}

async function readCustomerFromFile(slug) {
  const customersFile = await fs.readFile(CustomersFilePath);
  const customerObj = JSON.parse(customersFile.toString());
  return customerObj[slug];
}

const getLink = (links, rel) => {
  return links.filter(function (obj) {
    return obj.rel === rel;
  })[0];
};

const mapMenuItems = [
  {
    value: "ADD_HYDRANT",
    label: "Add Hydrant",
  },
  {
    value: "PREPLAN_LOCATION",
    label: "Pre-plan Location",
  },
];

const hydrantMenuItems = [
  {
    value: "EDIT_HYDRANT",
    label: "Edit Hydrant",
  },
  {
    value: "DELETE_HYDRANT",
    label: "Delete Hydrant",
  },
];

const locationMenuItems = [
  {
    value: "EDIT_LOCATION",
    label: "Edit Location",
  },
  {
    value: "REPLAN_LOCATION",
    label: "Re-plan Location",
  },
  {
    value: "DELETE_LOCATION",
    label: "Delete Location",
  },
];

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
    hydrantNotes: hydrantData.notes ? hydrantData.notes : null,
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

const fetcher = (url) => fetch(url).then((res) => res.json());

export async function getStaticPaths() {
  const allCustomersData = await axios.get(
    `${publicRuntimeConfig.API_BASE_URL}/api/customer`,
    {
      headers: {
        Authorization: `${serverRuntimeConfig.TOKEN}`,
        "X-FlowMSP-Source": "Web",
        "X-FlowMSP-Version": "2.40.0",
        "Accept-Encoding": "gzip",
      },
    }
  );

  await saveCustomersToFile(allCustomersData.data.data);

  // const paths = allCustomersData.data.data.map((customer) => ({
  //   params: { slug: customer.slug },
  // }));

  const paths = [{ params: { slug: "bellevillefi" } }];

  return { paths, fallback: "blocking" };
}

export async function getStaticProps(context) {
  // Pre-Stored Customer Information
  const { slug } = context.params;
  const customerStore = await readCustomerFromFile(slug);

  const customerUsersLink = getLink(customerStore.links, "users");
  const customerPartnersLink = getLink(customerStore.links, "partners");
  const hydrantsLink = getLink(customerStore.links, "hydrants");
  const locationsLink = getLink(customerStore.links, "locations");

  // Get Customer Users Data
  try {
    const customerUsersData = await axios.get(customerUsersLink.href, {
      headers: {
        Authorization: `${serverRuntimeConfig.TOKEN}`,
        "X-FlowMSP-Source": "Web",
        "X-FlowMSP-Version": "2.40.0",
        "Accept-Encoding": "gzip",
      },
    });
    const customerUsers = customerUsersData.data;

    // Get Customer Partners Data
    const customerPartnersData = await axios.get(customerPartnersLink.href, {
      headers: {
        Authorization: `${serverRuntimeConfig.TOKEN}`,
        "X-FlowMSP-Source": "Web",
        "X-FlowMSP-Version": "2.40.0",
        "Accept-Encoding": "gzip",
      },
    });
    const customerPartners = customerPartnersData.data;

    // Get Partner Locations and Hydrants Data
    const partnerLocations = [];
    const partnerHydrants = [];

    for (let i = 0; i < customerPartners.length; i++) {
      const customerPartner = customerPartners[i];

      const partnerLocationLink = `${locationsLink.href}/partners/${customerPartner.partnerId}`;
      const partnerHydrantLink = `${hydrantsLink.href}/partners/${customerPartner.partnerId}`;

      const partnerLocationData = await axios.get(partnerLocationLink, {
        headers: {
          Authorization: `${serverRuntimeConfig.TOKEN}`,
          "X-FlowMSP-Source": "Web",
          "X-FlowMSP-Version": "2.40.0",
          "Accept-Encoding": "gzip",
        },
      });
      const partnerLocation = partnerLocationData.data;

      const partnerHydrantData = await axios.get(partnerHydrantLink, {
        headers: {
          Authorization: `${serverRuntimeConfig.TOKEN}`,
          "X-FlowMSP-Source": "Web",
          "X-FlowMSP-Version": "2.40.0",
          "Accept-Encoding": "gzip",
        },
      });
      const partnerHydrant = partnerHydrantData.data;

      if (partnerLocation) {
        partnerLocations.push(partnerLocation);
      }

      if (partnerHydrant) {
        partnerHydrants.push(partnerHydrant);
      }
    }

    // Get Locations Data
    const myLocationsData = await axios.get(locationsLink.href, {
      headers: {
        Authorization: `${serverRuntimeConfig.TOKEN}`,
        "X-FlowMSP-Source": "Web",
        "X-FlowMSP-Version": "2.40.0",
        "Accept-Encoding": "gzip",
      },
    });
    const myLocations = myLocationsData.data;

    // Get Hydrants Data
    const myHydrantsData = await axios.get(hydrantsLink.href, {
      headers: {
        Authorization: `${serverRuntimeConfig.TOKEN}`,
        "X-FlowMSP-Source": "Web",
        "X-FlowMSP-Version": "2.40.0",
        "Accept-Encoding": "gzip",
      },
    });
    const myHydrants = myHydrantsData.data;

    return {
      props: {
        customer: customerStore,
        customerUsers: customerUsers,
        customerPartners: customerPartners,
        partnerLocations: partnerLocations,
        partnerHydrants: partnerHydrants,
        myLocations: myLocations,
        myHydrants: myHydrants,
      },
      revalidate: 15,
    };
  } catch (error) {
    return {
      props: {
        customer: customerStore,
      },
      revalidate: 15,
    };
  }
}

export default function MapContainer(props) {
  const dispatch = useDispatch();

  const { customer, user } = useSelector((state) => state);
  const {
    customerHydrants,
    selectedHydrants,
    locations,
    currentLocation,
    smsList,
  } = customer;

  /**
   * Start Initialize Redux States and Session Storage
   */
  useEffect(() => {
    if (props.customer) {
      dispatch(setCustomerAction(props.customer));
      dispatch(setCustomerUsersAction(props.customerUsers));
      dispatch(setCustomerPartnersListAction(props.customerPartners));
      dispatch(setPartnerLocationsFirstAction());
      for (let i = 0; i < props.partnerLocations.length; i++) {
        const partnerLocation = props.partnerLocations[i];
        dispatch(setPartnerLocationsAction(partnerLocation));
      }
      dispatch(setCustomerLocationsAction(props.myLocations));
      dispatch(setPartnerHydrantsAction(props.partnerHydrants));
      dispatch(setCustomerHydrantsAction(props.myHydrants));

      sessionStorage.setItem(
        "hydrant",
        JSON.stringify(props.customer.links.find((x) => x.rel === "hydrants"))
      );
      sessionStorage.setItem(
        "location",
        JSON.stringify(props.customer.links.find((x) => x.rel === "locations"))
      );
      sessionStorage.setItem(
        "preplan",
        JSON.stringify(props.customer.links.find((x) => x.rel === "preplan"))
      );
      sessionStorage.setItem(
        "customeruserslink",
        JSON.stringify(props.customer.links.find((x) => x.rel === "users"))
      );
      sessionStorage.setItem(
        "customerPartnersLink",
        JSON.stringify(props.customer.links.find((x) => x.rel === "partners"))
      );
      sessionStorage.setItem(
        "symbolLink",
        JSON.stringify(props.customer.links.find((x) => x.rel === "symbols"))
      );
      sessionStorage.setItem(
        "myPartners",
        JSON.stringify(props.customerPartners.data)
      );
    }
  }, [
    dispatch,
    props.customer,
    props.customerPartners,
    props.customerUsers,
    props.myHydrants,
    props.myLocations,
    props.partnerHydrants,
    props.partnerLocations,
  ]);

  /**
   * End Initialize Redux States and Session Storage
   */

  const [state, setState] = useState({
    loading: false,
    changeCounter: new Date().getTime(),
    showLightbox: false,
    showAnnotations: true,
    currentImageIndex: 0,
    selectedLocation: null,
    contextMenu: null,
    showModal: false,
    modal: {
      heading: null,
      body: null,
    },
    activeTabKey: 1,
    isPrePlanningMode: false,
    showDrawingTools: false,
    isPolygonDrawn: false,
    prePlanGeoOutline: [],
    locationDataForm: {
      lotNumber: null,
      storey: null,
      storeyBelow: null,
      roofArea: null,
      requiredFlow: null,
    },
    buildingDataForm: {
      occupancyType: null,
      constructionType: null,
      roofType: null,
      roofConstruction: null,
      roofMaterial: null,
      sprinklered: null,
      standPipe: null,
      fireAlarm: null,
      normalPopulation: null,
      hoursOfOperation: null,
      ownerContact: null,
      ownerPhone: null,
      originalPrePlan: null,
      lastReviewedOn: null,
      lastReviewedBy: null,
      notes: null,
    },
    isGettingPreplan: false,
    isAnnotationMode: false,
    imageTags: [],
    reDrawPolygon: false,
    locationKounter: null,
    getDistacebyPolyline: "",
    prevPolylineData: [],
    showDrawingToolsOption: null,
    formStorey: null,
    formStoreyBelow: null,
  });

  const [map, setMap] = useState({});

  const [geocoder, setGeocoder] = useState({});
  useEffect(() => {
    setGeocoder(new google.maps.Geocoder());
  }, []);

  /**
   * Start Props Functions
   */
  const locateLocation = (locationKounter) =>
    customerAPI.locateLocation(dispatch, locationKounter);
  const getFilteredLocations = (arr) =>
    customerAPI.getFilteredLocations(dispatch, arr);
  const getLocation = (
    locationLink,
    showLoader,
    successCallback,
    errorCallback
  ) =>
    customerAPI.getLocation(
      dispatch,
      locationLink,
      showLoader,
      successCallback,
      errorCallback
    );
  const addHydrant = (hydrant, successCallback, errorCallback) =>
    hydrantAPI.addHydrant(dispatch, hydrant, successCallback, errorCallback);
  const editHydrant = (id, hydrant, successCallback, errorCallback) => {
    hydrantAPI.editHydrant(
      dispatch,
      id,
      hydrant,
      successCallback,
      errorCallback
    );
  };
  const deleteHydrant = (id, successCallback, errorCallback) => {
    hydrantAPI.deleteHydrant(dispatch, id, successCallback, errorCallback);
  };
  const deleteAllHydrants = (successCallback, errorCallback) =>
    hydrantAPI.deleteAllHydrants(dispatch, successCallback, errorCallback);
  const setCustomerConfig = (config) =>
    dispatch(setCustomerConfigAction(config));
  const setHydrantProps = (hydrant, props) =>
    dispatch(setHydrantPropsAction(hydrant, props));
  const clearSelectedHydrants = () => dispatch(clearSelectedHydrantsAction());
  const selectHydrantsByLocation = (locationHydrantIds) =>
    dispatch(selectHydrantsByLocationAction(locationHydrantIds));
  const setDefaultState = () => dispatch(setCustomerDefaultStateAction());
  const getPreplan = (locationCoords, storey, storeyBelow, successCallback) =>
    locationAPI.getPreplan(
      locationCoords,
      storey,
      storeyBelow,
      successCallback
    );
  const addLocation = (location, successCallback) =>
    locationAPI.addLocation(dispatch, location, successCallback);
  const editLocation = (id, location, successCallback) =>
    locationAPI.editLocation(dispatch, id, location, successCallback);
  const getPreplanByLocation = (location, successCallback) =>
    locationAPI.getPreplanByLocation(location, successCallback);
  const deleteLocation = (location, successCallback) =>
    locationAPI.deleteLocation(dispatch, location, successCallback);
  const uploadImage = (data) => locationAPI.uploadImage(data, dispatch);
  const saveAnnotation = (locationId, imageId, annotationJson, annotationSVG) =>
    locationAPI.saveAnnotation(
      locationId,
      imageId,
      annotationJson,
      annotationSVG,
      dispatch
    );
  const saveTags = (locationId, imageId, tags) =>
    locationAPI.saveTags(locationId, imageId, tags, dispatch);
  const deleteImage1 = (locationId, imageId) =>
    locationAPI.deleteImage(locationId, imageId, dispatch);
  const getUser = () => UserAPI.getUser(dispatch);
  const setNewMessage = (
    successCallback,
    errorCallback,
    connectCallback,
    closedCallback
  ) =>
    customerAPI.eventSourceMessage(
      successCallback,
      errorCallback,
      connectCallback,
      closedCallback,
      dispatch
    );
  const reorderImage = (locationId, images, successCallback, errorCallback) =>
    locationAPI.reorderImage(
      locationId,
      images,
      dispatch,
      successCallback,
      errorCallback
    );
  /**
   * End Props Functions
   */

  /**
   * Start Redux State Changes
   */
  useEffect(() => {
    if (customer.config?.lat === null && customer.config?.lon === null) {
      const address =
        customer.address1 +
        " " +
        (customer.address2 ? customer.address2 + " " : "") +
        customer.city +
        " " +
        customer.state;
      geocoder.geocode({ address: address }, function (results, status) {
        if (status === "OK") {
          customer.config.lat = results[0].geometry.location.lat();
          customer.config.lon = results[0].geometry.location.lng();
        } else {
          geocoder.geocode(
            { address: customer.city + " " + customer.state },
            function (results, status) {
              if (status === "OK") {
                customer.config.lat = results[0].geometry.location.lat();
                customer.config.lon = results[0].geometry.location.lng();
              } else {
                customer.config.lat = 41.1209;
                customer.config.lon = -88.8354;
              }
            }
          );
        }
      });
    }
  }, [customer, geocoder]);
  /**
   * End Redux State Changes
   */

  /**
   * Start Main Functions
   */
  function handleNewMessageSuccess() {
    setState({
      ...state,
      newMsg: true,
      errorConnection: false,
      closedConnection: false,
    });
  }

  function handleNewMessageError() {
    setState({
      ...state,
      newMsg: false,
      errorConnection: true,
      closedConnection: false,
    });
  }

  function handleNewMessageConnect() {
    setState({
      ...state,
      errorConnection: false,
      closedConnection: false,
    });
  }

  function handleNewMessageClosed() {
    setState({
      ...state,
      newMsg: false,
      errorConnection: true,
      closedConnection: true,
    });
  }

  function showLoadingLocation() {
    setState({ ...state, loading: true });
  }

  function handleLocationSuccess(location) {
    const selectedLocation = locations.find((l) => l.id === location.id);
    if (state.selectedLocation) {
      if (state.selectedLocation.id !== selectedLocation.id) {
        setState({ ...state, isPrePlanningMode: false });
      }
    }
    setState({ ...state, selectedLocation: selectedLocation, loading: false });
  }

  function handleLocationError() {
    setState({ ...state, selectedLocation: null, loading: false });
    const message = "Oops.. Something went wrong!!";
    const newState = Object.assign({}, state);
    newState.modal.body = (
      <div>
        <div> {message} </div>
        <div> Check your internet connection and refresh the browser </div>
        <div className="text-align-right margin-top-10px">
          <Button type="button" bsStyle="primary" onClick={toggleModal}>
            OK
          </Button>
        </div>
      </div>
    );
    setState(newState);
    showModal();
  }

  function handleLocationClick(isLocationSelected, location) {
    closeContextMenu();

    //Check Location Reordering
    if (state.selectedLocation) {
      if (
        state.selectedLocationImageReorder &&
        state.selectedLocation.id === state.selectedLocationImageReorder
      ) {
        handleImageReordering();
        return;
      }
    }

    if (isLocationSelected) {
      const selectedLocation = locations.find((l) => l.id === location.id);
      if (state.selectedLocation) {
        if (state.selectedLocation.id !== selectedLocation.id) {
          setState({ ...state, isPrePlanningMode: false });
        }
      }
      if (selectedLocation.building && selectedLocation.images) {
        setState({
          ...state,
          selectedLocation: selectedLocation,
          loading: false,
        });
      } else {
        const locationsLink = selectedLocation.links.find(
          (x) => x.rel === "self"
        );
        getLocation(
          locationsLink,
          showLoadingLocation,
          handleLocationSuccess,
          handleLocationError
        );
      }
    } else {
      setState({ ...state, selectedLocation: null });
    }
    setState({ ...state, activeTabKey: 2, locationKounter: null }, () => {
      locateLocation(0);
    });
  }

  function handleMapClick() {
    closeContextMenu();
  }

  function handleMapRightClick(pixel, latLng, address) {
    if (state.activeTabKey === 5 || state.activeTabKey === 6) {
      return;
    }
    setState({
      ...state,
      contextMenu: {
        entity: {
          x: pixel.x + 35,
          y: pixel.y + 40,
          latLng: latLng,
          address: address,
        },
        items: mapMenuItems,
      },
    });
  }

  function handleHydrantRightClick(pixel, hydrant) {
    if (state.activeTabKey === 5 || state.activeTabKey === 6) {
      return;
    }
    setState({
      ...state,
      contextMenu: {
        entity: {
          id: hydrant.id,
          x: pixel.x,
          y: pixel.y,
          latLng: {
            lat: hydrant.position.lat(),
            lng: hydrant.position.lng(),
          },
          address: hydrant.address,
          flow: hydrant.hydrantFlowRate,
          size: hydrant.hydrantSize,
          description: hydrant.hydrantNotes,
          inService: hydrant.inService,
          dryHydrant: hydrant.dryHydrant,
          outServiceDate: hydrant.outServiceDate,
        },
        items: hydrantMenuItems,
      },
    });
  }

  function handleLocationRightClick(pixel, location) {
    if (state.activeTabKey === 5 || state.activeTabKey === 6) {
      return;
    }
    setState({
      ...state,
      contextMenu: {
        entity: {
          location: location,
          x: pixel.x,
          y: pixel.y,
        },
        items: locationMenuItems,
      },
    });
  }

  function handleContextMenuItemSelect(menuItem, entity) {
    closeContextMenu();
    switch (menuItem.value) {
      case "ADD_HYDRANT":
        setState({
          ...state,
          modal: {
            heading: "Add a Hydrant",
            body: (
              <HydrantDetailsForm
                hydrant={entity}
                handleFormSubmit={handleHydrantDetailsFormSubmit}
                action={menuItem.value}
              />
            ),
          },
        });
        toggleModal();
        break;

      case "EDIT_HYDRANT":
        setState({
          ...state,
          modal: {
            heading: "Edit a Hydrant",
            body: (
              <HydrantDetailsForm
                hydrant={entity}
                handleFormSubmit={handleHydrantDetailsFormSubmit}
                action={menuItem.value}
              />
            ),
          },
        });
        toggleModal();
        break;

      case "DELETE_HYDRANT":
        setState({
          ...state,
          modal: {
            heading: "Delete a Hydrant",
            body: (
              <ConfirmForm
                body="Are you sure you want to delete this hydrant?"
                onConfirm={handleHydrantDetailsFormSubmit}
                onDecline={toggleModal}
                form={{
                  action: menuItem.value,
                  entity: entity,
                }}
              />
            ),
          },
        });
        toggleModal();
        break;
      case "DELETE_HYDRANT_ALL":
        setState({
          ...state,
          modal: {
            heading: "Delete All Hydrants",
            body: (
              <ConfirmForm
                body="Are you sure you want to delete all hydrants?"
                onConfirm={handleHydrantDetailsFormSubmit}
                onDecline={toggleModal}
                form={{
                  action: menuItem.value,
                  entity: entity,
                }}
              />
            ),
          },
        });
        toggleModal();
        break;
      case "PREPLAN_LOCATION":
        if (state.selectedLocation) {
          if (
            state.selectedLocationImageReorder &&
            state.selectedLocation.id === state.selectedLocationImageReorder
          ) {
            handleImageReordering();
            return;
          }
        }
        setState({
          ...state,
          activeTabKey: 2,
          isPrePlanningMode: true,
          showDrawingTools: true,
          showDrawingToolsOption: "Polygon",
          selectedLocation: null,
        });
        clearSelectedHydrants();
        map.refreshLocations();
        break;

      case "EDIT_LOCATION":
        setState({
          ...state,
          activeTabKey: 2,
          isPrePlanningMode: true,
          isPolygonDrawn: true,
        });

        const editLocation = locations.find((l) => l.id === entity.location.id);
        populateLocationDataForm(editLocation, "EDIT_LOCATION");
        break;

      case "REPLAN_LOCATION":
        setState({
          ...state,
          isGettingPreplan: true,
          activeTabKey: 2,
          isPrePlanningMode: true,
          showDrawingTools: false,
          isPolygonDrawn: false,
        });

        const rePlanLocation = locations.find(
          (l) => l.id === entity.location.id
        );
        getPreplanByLocation(rePlanLocation, handleGetPreplanByLocationSuccess);
        break;

      case "DELETE_LOCATION":
        setState({
          ...state,
          modal: {
            heading: "Delete a Location",
            body: (
              <ConfirmForm
                body="Are you sure you want to delete this location?"
                onConfirm={handleLocationDeleteConfirm}
                onDecline={toggleModal}
                form={{
                  entity: entity.location,
                }}
              />
            ),
          },
        });
        toggleModal();
        break;

      default:
        break;
    }
  }

  function handleLocationNotSubmit(form) {
    toggleModal();
  }

  function handleHydrantDetailsFormSubmit(form) {
    const newState = Object.assign({}, state);
    newState.modal.body = (
      <div>
        {form.action === "ADD_HYDRANT" && <span> Adding Hydrant... </span>}
        {form.action === "EDIT_HYDRANT" && <span> Editing Hydrant... </span>}
        {form.action === "DELETE_HYDRANT" && <span> Deleting Hydrant... </span>}
        {form.action === "DELETE_HYDRANT_ALL" && (
          <span> Deleting All Hydrants... </span>
        )}
        <ProgressBar active now={100} />
      </div>
    );
    setState(newState);
    if (form.action === "ADD_HYDRANT") {
      handleAddHydrant(form);
    } else if (form.action === "EDIT_HYDRANT") {
      handleEditHydrant(form);
    } else if (form.action === "DELETE_HYDRANT") {
      handleDeleteHydrant(form.entity);
    } else if (form.action === "DELETE_HYDRANT_ALL") {
      deleteHydrantAll();
    }
  }

  function handleHydrantFormSubmissionSuccess() {
    toggleModal();
    clearSelectedHydrants();
    setState({ ...state, selectedLocation: null }, () => {
      map.refreshLocations(getLocationsSelected(locations));
    });
  }

  function handleHydrantFormSubmissionError(result) {
    const newState = Object.assign({}, state);
    if (result && result.data && result.data.conflictingLocations) {
      newState.modal.body = (
        <div>
          <span> Hydrant is binded to locations. Couldnt delete it. </span>
        </div>
      );
    } else {
      newState.modal.body = (
        <div>
          <span>
            {" "}
            Oops!Something went wrong in handleHydrantFormSubmissionError.
            Please try again.{" "}
          </span>
        </div>
      );
    }
    setState(newState);
  }

  function handleHydrantFormSubmissionSuccessAll() {
    falseModal();
    clearSelectedHydrants();
    setState(
      { ...state, selectedLocation: null, errorDeleteAll: false },
      () => {
        map.refreshLocations(getLocationsSelected(locations));
      }
    );
  }

  function handleHydrantFormSubmissionErrorAll() {
    const newState = Object.assign({}, state);
    newState.modal.body = (
      <div>
        <span>
          {" "}
          Oops!Something went wrong in handleHydrantFormSubmissionErrorAll.
          Please try again.{" "}
        </span>
      </div>
    );
    setState(newState);
    clearSelectedHydrants();
  }

  function handleTabSelect(key) {
    if (key === 4) {
      //Dispatch
      setState({ ...state, newMsg: false });
    } else {
      if (state.activeTabKey === 4) {
        setState({ ...state, newMsg: false });
      }
    }
    setState({ ...state, activeTabKey: key });
  }

  function handleMapZoomChanged(zoom) {
    setCustomerConfig({
      lastZoom: zoom,
    });
  }

  function handleMapCenterChanged(center) {
    setCustomerConfig({
      lastLat: center.lat,
      lastLon: center.lng,
    });
  }

  function handleMapTypeChanged(mapType) {
    setCustomerConfig({
      lastMapType: mapType,
    });
  }

  function handleGetHydrantsSuccess(message) {
    if (message) {
      const newState = Object.assign({}, state);
      newState.modal.body = (
        <div>
          <div> {message} </div>
          <div className="text-align-right margin-top-10px">
            <Button type="button" bsStyle="primary" onClick={toggleModal}>
              OK
            </Button>
          </div>
        </div>
      );
      setState(newState);
      showModal();
    } else {
      falseModal();
    }
  }

  function handleGetHydrantsError(msg) {
    let message = "Oops.. Something went wrong!!";
    if (msg) {
      message = msg;
    }
    const newState = Object.assign({}, state);
    newState.modal.body = (
      <div>
        <div> {message} </div>
        <div> Check your internet connection and refresh the browser </div>
        <div className="text-align-right margin-top-10px">
          <Button type="button" bsStyle="primary" onClick={toggleModal}>
            OK
          </Button>
        </div>
      </div>
    );
    setState(newState);
    showModal();
  }

  function handleCancelPrePlanLocation() {
    setState({
      ...state,
      modal: {
        heading: "Exit Pre-planning",
        body: (
          <ConfirmForm
            body="Are you sure you want to exit from Pre-planning?"
            onConfirm={handleCancelPrePlanConfirm}
            onDecline={toggleModal}
          />
        ),
      },
    });
    toggleModal();
  }

  function selectALocation(p) {
    //Check Location Reordering
    if (state.selectedLocation) {
      if (
        state.selectedLocationImageReorder &&
        state.selectedLocation.id === state.selectedLocationImageReorder
      ) {
        console.log("Location Change Detected Without Reorder");
        handleImageReorderingSelection(p);
        return false;
      }
      console.log("No Location Change Detected Without Reorder");
    }

    if (p.locationID) {
      const selectLocation =
        locations[locations.findIndex((l) => l.id === p.locationID)];
      setState(
        {
          isPrePlanningMode: false,
          showDrawingTools: false,
          isPolygonDrawn: false,
          prePlanGeoOutline: [],
          selectedLocation: selectLocation,
          isSelected: true,
          newMsg: false,
        },
        () => {
          map.refreshLocations(getLocationsSelected(locations));
          handleSelectHydrantsByLocation(true, selectLocation);
          handleLocationClick(true, selectLocation);
        }
      );
    } else {
      setState(
        {
          isPrePlanningMode: false,
          showDrawingTools: false,
          isPolygonDrawn: false,
          prePlanGeoOutline: [],
          selectedLocation: null,
          isSelected: false,
          newMsg: false,
        },
        () => {
          clearSelectedHydrants();
          map.refreshLocations(getLocationsSelected(locations));
        }
      );
    }

    if (p.latLon) {
      handleMapCenterChanged({
        lat: p.latLon.latitude,
        lng: p.latLon.longitude,
      });
      //18 is the zoom level where I can see the location well
      map.setZoom(18);
      map.setCenter();
      const marker = {
        position: { lat: p.latLon.latitude, lng: p.latLon.longitude },
      };
      const nextMarkers = [];
      nextMarkers.push(marker);
      map.setMarkersFromSearch(nextMarkers);
    }
    return true;
  }

  function handleSubmitLocationConfirmAdd() {
    const selectLocation =
      locations[locations.findIndex((l) => l.id === currentLocation.id)];
    toggleModal();
    setState(
      {
        isPrePlanningMode: false,
        activeTabKey: 2,
        selectedLocation: selectLocation,
        isSelected: true,
        showDrawingTools: false,
        isPolygonDrawn: false,
        prePlanGeoOutline: [],
      },
      () => {
        map.refreshLocations();
        map.drawingTools.removePolygons();
        handleSelectHydrantsByLocation(true, selectLocation);
      }
    );
  }

  function handleSubmitLocationConfirmEdit() {
    const selectLocation =
      locations[locations.findIndex((l) => l.id === currentLocation.id)];
    toggleModal();
    setState(
      {
        isPrePlanningMode: false,
        activeTabKey: 3,
        selectedLocation: selectLocation,
        isSelected: true,
        showDrawingTools: false,
        isPolygonDrawn: false,
        prePlanGeoOutline: [],
      },
      () => {
        map.refreshLocations();
        map.drawingTools.removePolygons();
        handleSelectHydrantsByLocation(true, selectLocation);
      }
    );
  }

  function handleSubmitLocationConfirm() {
    const selectLocation =
      locations[locations.findIndex((l) => l.id === currentLocation.id)];
    toggleModal();
    setState(
      {
        isPrePlanningMode: false,
        showDrawingTools: false,
        isPolygonDrawn: false,
        prePlanGeoOutline: [],
        activeTabKey: 2,
        selectedLocation: selectLocation,
        isSelected: true,
      },
      () => {
        map.refreshLocations();
        map.drawingTools.removePolygons();
        handleSelectHydrantsByLocation(true, selectLocation);
      }
    );
  }

  function handleSubmitPrePlanConfirm() {
    toggleModal();
    setState({
      isPrePlanningMode: false,
    });
    clearSelectedHydrants();
    map.refreshLocations();
    map.drawingTools.removePolygons();
  }

  function handleCancelPrePlanConfirm() {
    toggleModal();
    setState({
      isPrePlanningMode: false,
      showDrawingTools: false,
      isPolygonDrawn: false,
      prePlanGeoOutline: [],
      locationDataForm: {
        storey: null,
        lotNumber: null,
        storeyBelow: null,
        roofArea: null,
        requiredFlow: null,
      },
      buildingDataForm: {
        occupancyType: null,
        constructionType: null,
        roofType: null,
        roofConstruction: null,
        roofMaterial: null,
        sprinklered: null,
        standPipe: null,
        fireAlarm: null,
        normalPopulation: null,
        hoursOfOperation: null,
        ownerContact: null,
        ownerPhone: null,
        originalPrePlan: null,
        lastReviewedOn: null,
        lastReviewedBy: null,
        notes: null,
      },
      selectedLocation: null,
      reDrawPolygon: false,
    });
    clearSelectedHydrants();
    map.refreshLocations();
    map.drawingTools.removePolygons();
  }

  function handlePrePlanFormChange(form) {
    if (form.action === "REPLAN_LOCATION") {
      if (
        state.formStorey !== form.storey ||
        state.formStoreyBelow !== form.storeyBelow
      ) {
        setState({
          isGettingPreplan: true,
        });
        getPreplan(
          state.recentLocationCoords,
          form.storey,
          form.storeyBelow,
          handleGetPreplanSuccessRedrawFirst
        );
        setState({
          formStorey: form.storey,
          formStoreyBelow: form.storeyBelow,
        });
      }
    } else if (
      form.action === "ADD_LOCATION" ||
      form.action === "EDIT_LOCATION" ||
      form.action === "REPLAN_LOCATION"
    ) {
      if (
        state.locationDataForm.storey !== form.storey ||
        state.locationDataForm.storeyBelow !== form.storeyBelow
      ) {
        //need to fetch pre-plan as well
        //Uptill 1 there is no need
        let noOfStoriesState = 0;
        let noOfStories = 0;

        if (
          state.locationDataForm.storey &&
          state.locationDataForm.storey > 0
        ) {
          noOfStoriesState += state.locationDataForm.storey;
        }
        if (
          state.locationDataForm.storeyBelow &&
          state.locationDataForm.storeyBelow > 0
        ) {
          noOfStoriesState += state.locationDataForm.storeyBelow;
        }

        if (form.storey && form.storey > 0) {
          noOfStories += form.storey;
        }
        if (form.storeyBelow && form.storeyBelow > 0) {
          noOfStories += form.storeyBelow;
        }

        if (noOfStoriesState !== noOfStories) {
          setState({
            isGettingPreplan: true,
          });
          if (form.action === "REPLAN_LOCATION") {
            getPreplan(
              state.recentLocationCoords,
              form.storey,
              form.storeyBelow,
              handleGetPreplanSuccessRedraw
            );
          } else if (form.action === "EDIT_LOCATION") {
            getPreplan(
              state.selectedLocation.geoOutline,
              form.storey,
              form.storeyBelow,
              handleGetPreplanSuccessRedraw
            );
          } else {
            getPreplan(
              state.recentLocationCoords,
              form.storey,
              form.storeyBelow,
              handleGetPreplanSuccess
            );
          }
        }
      }
    }
    setState({
      locationDataForm: form,
    });
  }

  function handleBuildingFormChange(form) {
    setState({
      buildingDataForm: form,
    });
  }

  function handlePrePlanSubmit(form, locationForm, buildingForm) {
    const hydrants = [];
    selectedHydrants.map(function (hydrant) {
      hydrants.push(hydrant.id);
    });
    let location;
    if (form.action === "ADD_LOCATION" || form.action === "NEW_BUILDING") {
      location = {
        name: locationForm.locationName,
        geoOutline: state.prePlanGeoOutline,
        address: {
          address1: locationForm.address1,
          address2: locationForm.address2,
          city: locationForm.city,
          state: locationForm.state,
          zip: locationForm.zip,
        },
        storey: locationForm.storey,
        storeyBelow: locationForm.storeyBelow,
        lotNumber: locationForm.lotNumber,
        roofArea: locationForm.roofArea,
        requiredFlow: locationForm.requiredFlow,
        hydrants: hydrants,
        building: {
          occupancyType: buildingForm.occupancyType,
          constructionType: buildingForm.constructionType,
          roofType: buildingForm.roofType,
          roofConstruction: buildingForm.roofConstruction,
          roofMaterial: buildingForm.roofMaterial,
          sprinklered: buildingForm.sprinklered,
          standPipe: buildingForm.standPipe,
          fireAlarm: buildingForm.fireAlarm,
          normalPopulation: buildingForm.normalPopulation,
          hoursOfOperation: buildingForm.hoursOfOperation,
          ownerContact: buildingForm.ownerContact,
          ownerPhone: buildingForm.ownerPhone,
          notes: buildingForm.notes,
        },
      };
    } else if (
      form.action === "EDIT_LOCATION" ||
      form.action === "EDIT_BUILDING" ||
      form.action === "REPLAN_LOCATION"
    ) {
      const locationTmp = [
        {
          op: "replace",
          path: "/name",
          value: locationForm.locationName,
        },
        {
          op: "replace",
          path: "/address/address1",
          value: locationForm.address1,
        },
        {
          op: "replace",
          path: "/address/address2",
          value: locationForm.address2,
        },
        {
          op: "replace",
          path: "/address/city",
          value: locationForm.city,
        },
        {
          op: "replace",
          path: "/address/state",
          value: locationForm.state,
        },
        {
          op: "replace",
          path: "/address/zip",
          value: locationForm.zip,
        },
        {
          op: "replace",
          path: "/storey",
          value: locationForm.storey,
        },
        {
          op: "replace",
          path: "/storeyBelow",
          value: locationForm.storeyBelow,
        },
        {
          op: "replace",
          path: "/lotNumber",
          value: locationForm.lotNumber,
        },
        {
          op: "replace",
          path: "/roofArea",
          value: locationForm.roofArea,
        },
        {
          op: "replace",
          path: "/requiredFlow",
          value: locationForm.requiredFlow,
        },
        {
          op: "replace",
          path: "/hydrants",
          value: hydrants,
        },
        {
          op: "replace",
          path: "/building/occupancyType",
          value: buildingForm.occupancyType,
        },
        {
          op: "replace",
          path: "/building/constructionType",
          value: buildingForm.constructionType,
        },
        {
          op: "replace",
          path: "/building/roofType",
          value: buildingForm.roofType,
        },
        {
          op: "replace",
          path: "/building/roofConstruction",
          value: buildingForm.roofConstruction,
        },
        {
          op: "replace",
          path: "/building/roofMaterial",
          value: buildingForm.roofMaterial,
        },
        {
          op: "replace",
          path: "/building/sprinklered",
          value: buildingForm.sprinklered,
        },
        {
          op: "replace",
          path: "/building/standPipe",
          value: buildingForm.standPipe,
        },
        {
          op: "replace",
          path: "/building/fireAlarm",
          value: buildingForm.fireAlarm,
        },
        {
          op: "replace",
          path: "/building/normalPopulation",
          value: buildingForm.normalPopulation,
        },
        {
          op: "replace",
          path: "/building/hoursOfOperation",
          value: buildingForm.hoursOfOperation,
        },
        {
          op: "replace",
          path: "/building/ownerContact",
          value: buildingForm.ownerContact,
        },
        {
          op: "replace",
          path: "/building/ownerPhone",
          value: buildingForm.ownerPhone,
        },
        {
          op: "replace",
          path: "/building/notes",
          value: buildingForm.notes,
        },
      ];

      if (state.prePlanGeoOutline) {
        if (state.prePlanGeoOutline.length > 2) {
          locationTmp.push({
            op: "replace",
            path: "/geoOutline",
            value: state.prePlanGeoOutline,
          });
        }
      }
      location = [];
      //Remove all such items whose value is null or undefined
      for (let ii = 0; ii < locationTmp.length; ii++) {
        if (typeof locationTmp[ii].value === "undefined") {
          continue;
        }

        if (locationTmp[ii].value === null) {
          continue;
        }
        location.push(locationTmp[ii]);
      }
    }

    const newState = Object.assign({}, state);
    newState.modal.heading = "Pre-planning";
    newState.modal.body = (
      <div>
        {(form.action === "ADD_LOCATION" || form.action === "NEW_BUILDING") && (
          <span> Adding location... </span>
        )}
        {(form.action === "EDIT_LOCATION" ||
          form.action === "EDIT_BUILDING" ||
          form.action === "REPLAN_LOCATION") && (
          <span> Editing location... </span>
        )}
        <ProgressBar active now={100} />
      </div>
    );
    setState(newState);
    toggleModal();
    if (form.action === "ADD_LOCATION" || form.action === "NEW_BUILDING") {
      addLocation(location, handleAddLocationSuccess);
    } else if (
      form.action === "EDIT_LOCATION" ||
      form.action === "REPLAN_LOCATION"
    ) {
      editLocation(form.locationId, location, handleEditLocationSuccess);
    } else if (form.action === "EDIT_BUILDING") {
      editLocation(form.locationId, location, handlePrePlanSuccess);
    }
    setState({
      changeCounter: new Date().getTime(),
    });
  }

  function handleRePlanSubmit() {
    const form = state.locationDataForm;
    form.action = "REPLAN_LOCATION";
    const locationForm = state.locationDataForm;
    const buildingForm = state.buildingDataForm;
    handlePrePlanSubmit(form, locationForm, buildingForm);
  }

  function handleRePlanStart() {
    setState(
      {
        showDrawingTools: true,
        showDrawingToolsOption: "Polygon",
        isPolygonDrawn: false,
        prePlanGeoOutline: [],
        reDrawPolygon: true,
        formStorey: null,
        formStoreyBelow: null,
      },
      () => {
        clearSelectedHydrants();
        map.drawingTools.removePolygons();
      }
    );
  }

  function handlePrePlanFormSubmit(form) {
    const locationForm = form;
    const buildingForm = state.buildingDataForm;
    handlePrePlanSubmit(form, locationForm, buildingForm);
  }

  function handleBuildingFormSubmit(form) {
    const locationForm = state.locationDataForm;
    const buildingForm = form;
    handlePrePlanSubmit(form, locationForm, buildingForm);
  }

  function handlePolygonComplete(coords) {
    setState({
      isGettingPreplan: true,
    });
    const locationCoords = [];
    coords.map(function (coord) {
      locationCoords.push({
        latitude: coord.lat,
        longitude: coord.lng,
      });
    });
    locationCoords.push({
      latitude: coords[0].lat,
      longitude: coords[0].lng,
    });
    setState({
      recentLocationCoords: locationCoords,
    });
    if (state.locationDataForm) {
      if (state.locationDataForm.action === "REPLAN_LOCATION") {
        getPreplan(
          locationCoords,
          state.locationDataForm.storey,
          state.locationDataForm.storeyBelow,
          handleGetPreplanSuccess
        );
        return;
      }
    }
    getPreplan(locationCoords, 1, 0, handleGetPreplanSuccess);
  }

  const toRadian = (x) => {
    return (x * Math.PI) / 180;
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6378137; // Earth's mean radius in meter
    const dLat = toRadian(lat2 - lat1);
    const dLong = toRadian(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadian(lat1)) *
        Math.cos(toRadian(lat2)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 3.28084; // returns the distance in feets
  };

  function handlePolylineComplete(polyline) {
    const path = polyline.getPath();
    let dist = 0; // Distance in meters
    for (let ii = 1; ii < path.length; ii++) {
      dist += getDistance(
        path.getAt(ii - 1).lat(),
        path.getAt(ii - 1).lng(),
        path.getAt(ii).lat(),
        path.getAt(ii).lng()
      );
    }
    setState({
      getDistacebyPolyline: Math.round(dist) + "ft.",
    });
  }

  function handleDistanceMode(e) {
    if (e.target.checked) {
      setState({
        showDrawingTools: true,
        showDrawingToolsOption: "Polyline",
      });
    } else {
      setState({
        showDrawingTools: false,
        showDrawingToolsOption: null,
        getDistacebyPolyline: "",
      });
    }
  }

  function handleGetPreplanSuccessRedraw(preplanData) {
    const alocationDataForm = state.locationDataForm;
    alocationDataForm.roofArea = preplanData.roofArea;
    alocationDataForm.requiredFlow = preplanData.requiredFlow;
    setState({
      isPolygonDrawn: true,
      isPrePlanningMode: true,
      prePlanGeoOutline: preplanData.geoOutline,
      locationDataForm: alocationDataForm,
      isGettingPreplan: false,
      reDrawPolygon: false,
      showDrawingTools: false,
      showDrawingToolsOption: null,
      getDistacebyPolyline: "",
      formStorey: alocationDataForm.storey,
      formStoreyBelow: alocationDataForm.storeyBelow,
    });
    handleSelectHydrantsByLocation(true, preplanData);
  }

  function handleGetPreplanSuccessRedrawFirst(preplanData) {
    const alocationDataForm = state.locationDataForm;
    alocationDataForm.roofArea = preplanData.roofArea;
    alocationDataForm.requiredFlow = preplanData.requiredFlow;
    setState({
      isPolygonDrawn: true,
      isPrePlanningMode: true,
      prePlanGeoOutline: preplanData.geoOutline,
      locationDataForm: alocationDataForm,
      isGettingPreplan: false,
      reDrawPolygon: false,
      showDrawingTools: false,
      showDrawingToolsOption: null,
      getDistacebyPolyline: "",
    });
    handleSelectHydrantsByLocation(true, preplanData);
  }

  function handleGetPreplanSuccess(preplanData) {
    if (state.reDrawPolygon) {
      const alocationDataForm = state.locationDataForm;
      alocationDataForm.roofArea = preplanData.roofArea;
      alocationDataForm.requiredFlow = preplanData.requiredFlow;
      setState({
        isPolygonDrawn: true,
        isPrePlanningMode: true,
        prePlanGeoOutline: preplanData.geoOutline,
        locationDataForm: alocationDataForm,
        isGettingPreplan: false,
        reDrawPolygon: false,
        showDrawingTools: false,
        showDrawingToolsOption: null,
        getDistacebyPolyline: "",
      });
      handleSelectHydrantsByLocation(true, preplanData);
    } else {
      const locationDataForm = {
        storey: preplanData.storey,
        storeyBelow: preplanData.storeyBelow,
        roofArea: preplanData.roofArea,
        requiredFlow: preplanData.requiredFlow,
        action: "ADD_LOCATION",
      };
      const buildingDataForm = {
        occupancyType: null,
        constructionType: null,
        roofType: null,
        roofConstruction: null,
        roofMaterial: null,
        sprinklered: null,
        standPipe: null,
        fireAlarm: null,
        normalPopulation: null,
        hoursOfOperation: null,
        ownerContact: null,
        ownerPhone: null,
        originalPrePlan: null,
        lastReviewedOn: null,
        lastReviewedBy: null,
        notes: null,
        action: "NEW_BUILDING",
      };
      const _this = this;
      geocoder.geocode(
        {
          location: {
            lat: preplanData.planningCenter.latitude,
            lng: preplanData.planningCenter.longitude,
          },
        },
        function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              results[0].address_components.map(function (address) {
                const addressComponent = address.short_name;
                if (address.types && address.types[0] && addressComponent) {
                  switch (address.types[0]) {
                    case "street_number":
                      locationDataForm.address1 = addressComponent;
                      break;
                    case "route":
                      locationDataForm.address1 = `${locationDataForm.address1} ${addressComponent}`;
                      break;
                    case "locality":
                      locationDataForm.city = addressComponent;
                      break;
                    case "administrative_area_level_1":
                      locationDataForm.state = addressComponent;
                      break;
                    case "postal_code":
                      locationDataForm.zip = addressComponent;
                      break;
                    default:
                      break;
                  }
                }
              });
            }
          }
          _setState({
            isPolygonDrawn: true,
            isPrePlanningMode: true,
            prePlanGeoOutline: preplanData.geoOutline,
            locationDataForm: locationDataForm,
            buildingDataForm: buildingDataForm,
            isGettingPreplan: false,
            selectedLocation: null,
            isSelected: false,
          });
          _handleSelectHydrantsByLocation(true, preplanData);
        }
      );
    }
  }

  function handleAddLocationSuccess() {
    handleSubmitLocationConfirmAdd();
  }

  function handleEditLocationSuccess() {
    handleSubmitLocationConfirm();
  }

  function handlePrePlanSuccess() {
    handleSubmitLocationConfirmEdit();
  }

  function handleGetPreplanByLocationSuccess(location, preplanData) {
    populateLocationDataForm(location, "REPLAN_LOCATION", preplanData);
  }

  function handleLocationDeleteConfirm(form) {
    const newState = Object.assign({}, state);
    newState.modal.body = (
      <div>
        <span> Deleting Location... </span> <ProgressBar active now={100} />
      </div>
    );
    setState(newState);
    deleteLocation(form.entity, handleLocationDeleteSuccess);
  }

  function handleLocationDeleteSuccess() {
    setState({
      selectedLocation: null,
    });
    toggleModal();
    clearSelectedHydrants();
    map.refreshLocations();
  }

  function handleAddHydrant(form) {
    const hydrant = {
      latLon: {
        latitude: form.lat,
        longitude: form.lng,
      },
      streetAddress: form.address,
      flow: form.flow,
      size: form.size,
      inService: form.inService,
      notes: form.description,
      dryHydrant: form.dryHydrant,
      outServiceDate: moment(form.outServiceDate).format("YYYY-MM-DD HH:MM:SS"),
    };
    if (hydrant.inService === "false" || hydrant.inService === false) {
      hydrant.inService = false;
    } else {
      hydrant.inService = true;
      hydrant.outServiceDate = "";
    }
    addHydrant(
      hydrant,
      handleHydrantFormSubmissionSuccess,
      handleHydrantFormSubmissionError
    );
  }

  function handleEditHydrant(form) {
    const hydrant = [
      {
        op: "replace",
        path: "/streetAddress",
        value: form.address,
      },
      {
        op: "replace",
        path: "/flow",
        value: form.flow,
      },
      {
        op: "replace",
        path: "/size",
        value: form.size,
      },
      {
        op: "replace",
        path: "/notes",
        value: form.description,
      },
      {
        op: "replace",
        path: "/dryHydrant",
        value: form.dryHydrant,
      },
    ];
    if (form.inService === false || form.inService === "false") {
      hydrant.push({
        op: "replace",
        path: "/outServiceDate",
        value: moment(form.outServiceDate).format("YYYY-MM-DD HH:MM:SS"),
      });
      hydrant.push({
        op: "replace",
        path: "/inService",
        value: false,
      });
    } else {
      hydrant.push({
        op: "remove",
        path: "/outServiceDate",
        value: "",
      });
      hydrant.push({
        op: "replace",
        path: "/inService",
        value: true,
      });
    }
    editHydrant(
      form.id,
      hydrant,
      handleHydrantFormSubmissionSuccess,
      handleHydrantFormSubmissionError
    );
  }

  function handleDeleteHydrant(hydrant) {
    deleteHydrant(
      hydrant.id,
      handleHydrantFormSubmissionSuccess,
      handleHydrantFormSubmissionError
    );
  }

  function deleteHydrantAll() {
    deleteAllHydrants(
      handleHydrantFormSubmissionSuccessAll,
      handleHydrantFormSubmissionErrorAll
    );
  }

  function showModal() {
    setState({
      showModal: true,
    });
  }

  function falseModal() {
    setState({
      showModal: false,
    });
  }

  function toggleModal() {
    setState({
      showModal: !state.showModal,
    });
  }

  function getLocations(locationsData) {
    const locations = [];
    for (let i = 0; i < locationsData.length; i++) {
      const coordinates = locationsData[i].geoOutline;
      const locationCoordinates = [];
      for (let j = 0; j < coordinates.length; j++) {
        locationCoordinates.push({
          lat: coordinates[j].latitude,
          lng: coordinates[j].longitude,
        });
      }
      locations.push({
        id: locationsData[i].id,
        name: locationsData[i].name,
        address: locationsData[i].address,
        storey: locationsData[i].storey,
        storeyBelow: locationsData[i].storeyBelow,
        lotNumber: locationsData[i].lotNumber,
        roofArea: locationsData[i].roofArea,
        requiredFlow: locationsData[i].requiredFlow,
        coords: locationCoordinates,
        isSelected: false,
        images: locationsData[i].images,
        hydrants: locationsData[i].hydrants,
        building: locationsData[i].building,
        isMine: locationsData[i].siMine,
      });
    }
    return locations;
  }

  function getLocationsSelected(locationsData) {
    const locations = [];
    for (let i = 0; i < locationsData.length; i++) {
      const coordinates = locationsData[i].geoOutline;
      const locationCoordinates = [];
      for (let j = 0; j < coordinates.length; j++) {
        locationCoordinates.push({
          lat: coordinates[j].latitude,
          lng: coordinates[j].longitude,
        });
      }
      let selected = false;
      if (state.selectedLocation) {
        if (state.isSelected) {
          if (locationsData[i].id === state.selectedLocation.id) {
            selected = true;
          }
        }
      }
      locations.push({
        id: locationsData[i].id,
        name: locationsData[i].name,
        address: locationsData[i].address,
        storey: locationsData[i].storey,
        storeyBelow: locationsData[i].storeyBelow,
        lotNumber: locationsData[i].lotNumber,
        roofArea: locationsData[i].roofArea,
        requiredFlow: locationsData[i].requiredFlow,
        coords: locationCoordinates,
        isSelected: selected,
        images: locationsData[i].images,
        hydrants: locationsData[i].hydrants,
        building: locationsData[i].building,
        isMine: locationsData[i].isMine,
      });
    }
    return locations;
  }

  function selectImage(index) {
    setState({
      currentImageIndex: index,
    });
    toggleLightbox();
  }

  function leftImage(index) {
    const selectedLocationLocal = state.selectedLocation;
    if (!selectedLocationLocal.images) {
      //No Images
      return;
    }
    if (selectedLocationLocal.images.length <= 1) {
      //Only one image
      return;
    }
    if (index <= 0) {
      //Can't shift left the leftmost
      return;
    }
    // Save Originil Images
    if (
      state.selectedLocationImageReorder === null ||
      typeof state.selectedLocationImageReorder === "undefined"
    ) {
      //This is the first time Image is Reordered Lets Save Images Here
      const selectedLocationImageOriginal = [];
      if (selectedLocationLocal.images.length > 0) {
        for (let i = 0; i < selectedLocationLocal.images.length; i++) {
          selectedLocationImageOriginal.push(selectedLocationLocal.images[i]);
        }
      }
      setState({
        selectedLocationImageOriginal: selectedLocationImageOriginal,
      });
    }

    //Swap two images
    const tmp = selectedLocationLocal.images[index - 1];
    selectedLocationLocal.images[index - 1] =
      selectedLocationLocal.images[index];
    selectedLocationLocal.images[index] = tmp;

    setState({
      selectedLocation: selectedLocationLocal,
      currentImageIndex: index - 1,
      selectedLocationImageReorder: selectedLocationLocal.id,
    });
  }

  function rightImage(index) {
    const selectedLocationLocal = state.selectedLocation;
    if (!selectedLocationLocal.images) {
      //No Images
      return;
    }
    if (selectedLocationLocal.images.length <= 1) {
      //Only one image
      return;
    }
    if (index >= selectedLocationLocal.images.length - 1) {
      //Can't shift Right the Right Most
      return;
    }
    // Save Originil Images
    if (
      state.selectedLocationImageReorder === null ||
      typeof state.selectedLocationImageReorder === "undefined"
    ) {
      //This is the first time Image is Reordered Lets Save Images Here
      const selectedLocationImageOriginal = [];
      if (selectedLocationLocal.images.length > 0) {
        for (let i = 0; i < selectedLocationLocal.images.length; i++) {
          selectedLocationImageOriginal.push(selectedLocationLocal.images[i]);
        }
      }
      setState({
        selectedLocationImageOriginal: selectedLocationImageOriginal,
      });
    }
    //Swap two images

    const tmp = selectedLocationLocal.images[index + 1];
    selectedLocationLocal.images[index + 1] =
      selectedLocationLocal.images[index];
    selectedLocationLocal.images[index] = tmp;

    setState({
      selectedLocation: selectedLocationLocal,
      currentImageIndex: index + 1,
      selectedLocationImageReorder: selectedLocationLocal.id,
    });
  }

  function handleOkImageSuccess(locationID) {
    setState({
      selectedLocationImageReorder: null,
      selectedLocationImageOriginal: null,
    });
    toggleModal();
  }

  function handleOkImageError(locationID) {
    const newState = Object.assign({}, state);
    newState.modal.body = (
      <div>
        <span>
          {" "}
          Oops!Something went wrong in handleOkImageError. Please refresh the
          page and try again.{" "}
        </span>
      </div>
    );
    setState(newState);
    toggleModal();
  }

  function handleImageReordering() {
    setState({
      modal: {
        heading: "Image Reordering",
        body: (
          <ConfirmForm
            body="Are you sure you want to exit without saving the image re-order?"
            onConfirm={resetSelectedLocationConfirm}
            onDecline={resetSelectedLocationDecline}
          />
        ),
      },
    });
    toggleModal();
  }

  function handleImageReorderingSelection(p) {
    setState({
      lastSelectedLocationMessage: p,
    });
    setState({
      modal: {
        heading: "Image Reordering",
        body: (
          <ConfirmForm
            body="Are you sure you want to exit without saving the image re-order?"
            onConfirm={resetSelectedLocationConfirmSelection}
            onDecline={resetSelectedLocationDecline}
          />
        ),
      },
    });
    toggleModal();
  }

  function resetSelectedLocationConfirmSelection() {
    const selectedLocation =
      locations[
        locations.findIndex((l) => l.id === state.selectedLocationImageReorder)
      ];
    if (state.selectedLocationImageOriginal) {
      selectedLocation.images = state.selectedLocationImageOriginal;
    }
    setState(
      {
        selectedLocation: null,
        selectedLocationImageReorder: null,
        isSelected: false,
      },
      () => {
        clearSelectedHydrants();
        map.refreshLocations(getLocationsSelected(locations));
        selectALocation(state.lastSelectedLocationMessage);
      }
    );
    toggleModal();
  }

  function resetSelectedLocationConfirm() {
    const selectedLocation =
      locations[
        locations.findIndex((l) => l.id === state.selectedLocationImageReorder)
      ];
    if (state.selectedLocationImageOriginal) {
      selectedLocation.images = state.selectedLocationImageOriginal;
    }

    setState(
      {
        selectedLocation: null,
        selectedLocationImageReorder: null,
        isSelected: false,
      },
      () => {
        clearSelectedHydrants();
        map.refreshLocations(getLocationsSelected(locations));
      }
    );
    toggleModal();
  }

  function resetSelectedLocationDecline() {
    const selectedLocation =
      locations[
        locations.findIndex((l) => l.id === state.selectedLocationImageReorder)
      ];
    setState(
      {
        selectedLocation: selectedLocation,
        isSelected: true,
      },
      () => {
        map.refreshLocations(getLocationsSelected(locations));
        handleSelectHydrantsByLocation(true, selectedLocation);
      }
    );
    toggleModal();
  }

  function okImage(index) {
    const selectedLocationLocal = state.selectedLocation;
    if (!selectedLocationLocal.images) {
      //No Images
      return;
    }
    //Progress Bar On This
    const newState = Object.assign({}, state);
    newState.modal.heading = "Image Reordering";
    newState.modal.body = (
      <div>
        <span> Image reordering in process </span>
        <ProgressBar active now={99} />
      </div>
    );
    setState(newState);
    toggleModal();
    reorderImage(
      selectedLocationLocal.id,
      selectedLocationLocal.images,
      handleOkImageSuccess,
      handleOkImageError
    );
  }

  function cancelImage(index) {
    setState(
      {
        selectedLocation: null,
        isSelected: false,
      },
      () => {
        clearSelectedHydrants();
        map.refreshLocations(getLocationsSelected(locations));
        handleImageReordering();
      }
    );
  }

  function annotateImage(index) {
    const imageId = state.selectedLocation.images[index].id;
    const locationId = state.selectedLocation.id;
    locationAPI.getAnnotation(locationId, imageId).then((res, err) => {
      if (err) console.warn(err);
      let json = res.data;
      if (res.data === "") {
        json = null;
      } else if (res.data) {
        json = JSON.parse(res.data);
      }
      setState({
        currentImageIndex: index,
        annotationJson: json,
      });
      locationAPI.getTags(locationId, imageId).then((res1, err1) => {
        if (err1) console.warn(err1);
        let tags = [];
        if (res1.data === "") {
          tags = [];
        } else if (res1.data) {
          tags = [...res1.data];
        }
        const tagsRefined = [];
        for (let ii = 0; ii < tags.length; ii++) {
          const tag = { id: tags[ii], text: tags[ii] };
          tagsRefined.push(tag);
        }
        setState({
          isAnnotationMode: true,
          imageTags: tagsRefined,
        });
      });
    });
  }

  function onlyTagContent(pImages, tag) {
    if (!pImages) return null;
    const images = [];
    for (let ii = 0; ii < pImages.length; ii++) {
      if (!pImages[ii].tags) continue;
      for (let jj = 0; jj < pImages[ii].tags.length; jj++) {
        if (pImages[ii].tags[jj].toUpperCase() === tag.toUpperCase()) {
          images.push(pImages[ii]);
          break;
        }
      }
    }
    return images;
  }

  function tagPDF(index) {
    const pdfId = state.selectedLocation.images[index].id;
    const pdfName = state.selectedLocation.images[index].title;
    const locationId = state.selectedLocation.id;
    locationAPI.getTags(locationId, pdfId).then((res1, err1) => {
      if (err1) console.warn(err1);
      let tags = [];
      if (res1.data === "") {
        tags = [];
      } else if (res1.data) {
        tags = [...res1.data];
      }
      const tagsRefined = [];
      for (let ii = 0; ii < tags.length; ii++) {
        const tag = { id: tags[ii], text: tags[ii] };
        tagsRefined.push(tag);
      }
      setState({
        currentImageIndex: index,
        imageTags: tagsRefined,
      });
      setState({
        modal: {
          heading: "Tag File(Image & PDF)",
          body: (
            <TagForm
              onConfirm={(savedTags) => savePDFTags(savedTags)}
              onDecline={toggleModal}
              fileName={pdfName}
              tags={tagsRefined}
            />
          ),
        },
      });
      toggleModal();
    });
  }

  function uploadImages(files) {
    const { selectedLocation } = state;
    if (!selectedLocation) {
      setState({
        modal: {
          heading: "Location not selected",
          body: (
            <DialogForm
              body="Kindly select a location first"
              onConfirm={handleLocationNotSubmit}
              form={{
                action: null,
              }}
            />
          ),
        },
      });
      toggleModal();
      return Promise.resolve();
    }
    let currentIndex = 1;
    const totalIndex = files.length;
    let progressValue = 50;
    if (totalIndex > 0) {
      progressValue = Math.floor(100 / totalIndex);
    }

    let progressCurrent = progressValue;
    if (progressCurrent >= 100) {
      progressCurrent = 50;
    }

    const newState = Object.assign({}, state);
    newState.modal.heading = "Image Uploading";
    newState.modal.body = (
      <div>
        <span> Image upload in process... 0 \ {totalIndex} </span>
        <ProgressBar active now={progressCurrent} />
      </div>
    );
    setState(newState);
    toggleModal();

    const uploads = files.map((file) =>
      props
        .uploadImage({
          image: file,
          locationId: selectedLocation.id,
        })
        .then((e) => {
          progressCurrent = progressCurrent + progressValue;
          if (progressCurrent > 100) {
            progressCurrent = 99;
          }
          const newState2 = Object.assign({}, state);
          newState2.modal.heading = "Image Uploading";
          newState2.modal.body = (
            <div>
              <span>
                {" "}
                Image upload in process...{currentIndex} \ {totalIndex}{" "}
              </span>
              <ProgressBar active now={progressCurrent} />
            </div>
          );
          setState(newState2);
          currentIndex = currentIndex + 1;
        })
        .catch((err) => {
          progressCurrent = progressCurrent + progressValue;
          if (progressCurrent > 100) {
            progressCurrent = 99;
          }
          const newState2 = Object.assign({}, state);
          newState2.modal.heading = "Image Uploading";
          newState2.modal.body = (
            <div>
              <span>
                {" "}
                Error encountered during image upload ...{currentIndex} \{" "}
                {totalIndex}{" "}
              </span>
              <ProgressBar active now={progressCurrent} />
            </div>
          );
          setState(newState2);
          currentIndex = currentIndex + 1;
          return err;
        })
    );
    return Promise.all(uploads).then((e) => {
      falseModal();
    });
  }

  function confirmImageDelete(index) {
    setState({
      modal: {
        heading: "Delete an Image",
        body: (
          <ConfirmForm
            body="Are you sure you want to delete this image?"
            onConfirm={handleDeleteImage1}
            onDecline={toggleModal}
            entity={this}
            index={index}
          />
        ),
      },
    });
    toggleModal();
  }

  function handleDeleteImage1() {
    const index = index;
    const imageName = state.selectedLocation.images[index].title;
    toggleModal();
    const imageId = state.selectedLocation.images[index].id;
    const locationId = state.selectedLocation.id;
    deleteImage1(locationId, imageId)
      .then((res) => {
        //Deleted Successfully
        console.log("Deleted Image:" + imageName);
      })
      .catch((e) => {
        console.error(e);
        setState({
          modal: {
            heading: "Image Deletion",
            body: (
              <DialogForm
                body="Image deletion failed .. Refresh the page"
                onConfirm={toggleModal}
              />
            ),
          },
        });
        toggleModal();
        return state;
      });
    setState((prevState) => {
      prevState.selectedLocation.images.splice(index, 1);
      return prevState;
    });
  }

  function showSavingAnnotation(progress) {
    const newState = Object.assign({}, state);
    newState.modal.heading = "Wait";
    newState.modal.body = (
      <div>
        <span> Saving Annotated Image </span>
        <ProgressBar active now={progress} />
      </div>
    );
    setState(newState, () => {
      toggleModal();
    });
  }

  function savePDFTags(tags) {
    const pdfId = state.selectedLocation.images[state.currentImageIndex].id;
    const locationId = state.selectedLocation.id;
    const selectLocation =
      locations[locations.findIndex((l) => l.id === locationId)];

    showSavingAnnotation(75);
    saveTags(locationId, pdfId, tags).then((res1, err1) => {
      if (err1) console.warn(err1);
      showSavingAnnotation(100);
      toggleModal();
    });
  }

  function handleSaveAnnotation(json, svg, tags) {
    const imageId = state.selectedLocation.images[state.currentImageIndex].id;
    const locationId = state.selectedLocation.id;
    const selectLocation =
      locations[locations.findIndex((l) => l.id === locationId)];

    showSavingAnnotation(90);

    saveAnnotation(locationId, imageId, json, svg).then((res, err) => {
      if (err) console.warn(err);
      setState(
        {
          isAnnotationMode: false,
          selectedLocation: selectLocation,
          isSelected: true,
          changeCounter: new Date().getTime(),
        },
        () => {
          map.refreshLocations(getLocationsSelected(locations));
          handleSelectHydrantsByLocation(true, selectLocation);
          toggleModal();
        }
      );
    });
  }

  function cancelAnnotation() {
    const locationId = state.selectedLocation.id;
    const selectLocation =
      locations[locations.findIndex((l) => l.id === locationId)];
    setState(
      {
        isAnnotationMode: false,
        selectedLocation: selectLocation,
        isSelected: true,
        changeCounter: new Date().getTime(),
      },
      () => {
        map.refreshLocations(getLocationsSelected(locations));
        handleSelectHydrantsByLocation(true, selectLocation);
      }
    );
  }

  function toggleLightbox() {
    setState({
      showLightbox: !state.showLightbox,
      showAnnotations: true,
    });
  }

  function closeContextMenu() {
    setState({
      contextMenu: null,
    });
  }

  function handleSetHydrantProps(hydrant, props) {
    if (state.isPrePlanningMode && !hydrant.isMine) {
      return;
    }
    setHydrantProps(hydrant, props);
  }

  function handleSelectHydrantsByLocation(isLocationSelected, targetLocation) {
    clearSelectedHydrants();
    if (isLocationSelected && targetLocation.hydrants) {
      const targetLocationHydrantIds = [];
      for (let i = 0; i < targetLocation.hydrants.length; i++) {
        targetLocationHydrantIds.push(targetLocation.hydrants[i].id);
      }
      if (targetLocationHydrantIds.length > 0) {
        selectHydrantsByLocation(targetLocationHydrantIds);
      }
    }
  }

  function showInitialLoading(msg, stepIndex, stepTotal) {
    let progressKnt = 100;
    let stepMsg = null;
    if (stepIndex > 0 && stepTotal > 0) {
      progressKnt = (stepIndex / stepTotal) * 100;
      if (progressKnt > 100) {
        progressKnt = 100;
      }
      stepMsg = "Step " + stepIndex + "/" + stepTotal;
    }
    let msgStr = "Loading In Progress";
    if (msg) {
      msgStr = msg;
    }
    const newState = Object.assign({}, state);
    newState.modal.heading = "Loading";
    newState.modal.body = (
      <div>
        <span> {msgStr} </span>
        <div> {stepMsg} </div>
        <ProgressBar active now={progressKnt} />
      </div>
    );
    setState(newState);
    toggleModal();
  }

  function populateLocationDataForm(location, action, preplanData) {
    const locationDataForm = {
      locationId: location.id,
      locationName: location.name,
      action: action,
    };
    const buildingDataForm = {
      locationId: location.id,
      occupancyType:
        location.building && typeof location.building !== "undefined"
          ? location.building.occupancyType
          : null,
      constructionType:
        location.building && typeof location.building !== "undefined"
          ? location.building.constructionType
          : null,
      roofType:
        location.building && typeof location.building !== "undefined"
          ? location.building.roofType
          : null,
      roofConstruction:
        location.building && typeof location.building !== "undefined"
          ? location.building.roofConstruction
          : null,
      roofMaterial:
        location.building && typeof location.building !== "undefined"
          ? location.building.roofMaterial
          : null,
      sprinklered:
        location.building && typeof location.building !== "undefined"
          ? location.building.sprinklered
          : null,
      standPipe:
        location.building && typeof location.building !== "undefined"
          ? location.building.standPipe
          : null,
      fireAlarm:
        location.building && typeof location.building !== "undefined"
          ? location.building.fireAlarm
          : null,
      normalPopulation:
        location.building && typeof location.building !== "undefined"
          ? location.building.normalPopulation
          : null,
      hoursOfOperation:
        location.building && typeof location.building !== "undefined"
          ? location.building.hoursOfOperation
          : null,
      ownerContact:
        location.building && typeof location.building !== "undefined"
          ? location.building.ownerContact
          : null,
      ownerPhone:
        location.building && typeof location.building !== "undefined"
          ? location.building.ownerPhone
          : null,
      originalPrePlan:
        location.building && typeof location.building !== "undefined"
          ? location.building.originalPrePlan
          : null,
      lastReviewedOn:
        location.building && typeof location.building !== "undefined"
          ? location.building.lastReviewedOn
          : null,
      lastReviewedBy:
        location.building && typeof location.building !== "undefined"
          ? location.building.lastReviewedBy
          : null,
      notes:
        location.building && typeof location.building !== "undefined"
          ? location.building.notes
          : null,
      action: "EDIT_BUILDING",
    };
    if (action === "EDIT_LOCATION") {
      locationDataForm.storey = location.storey;
      locationDataForm.storeyBelow = location.storeyBelow;
      locationDataForm.lotNumber = location.lotNumber;
      locationDataForm.roofArea = location.roofArea;
      locationDataForm.requiredFlow = location.requiredFlow;
    } else if (action === "REPLAN_LOCATION") {
      locationDataForm.storey = location.storey;
      locationDataForm.storeyBelow = location.storeyBelow;
      locationDataForm.lotNumber = location.lotNumber;
      locationDataForm.roofArea = preplanData.roofArea;
      locationDataForm.requiredFlow = preplanData.requiredFlow;
    }
    for (const key in location.address) {
      if (location.address.hasOwnProperty(key)) {
        locationDataForm[key] = location.address[key];
      }
    }
    setState({
      locationDataForm: locationDataForm,
      buildingDataForm: buildingDataForm,
      isGettingPreplan: false,
    });
    map.handleLocationClick(location, true);
    if (action === "REPLAN_LOCATION") {
      handleSelectHydrantsByLocation(true, preplanData);
    }
  }

  function handleLocatorClick() {
    setLocation(1);
  }

  function setLocation(kounter) {
    //Check Location Reordering
    if (state.selectedLocation) {
      if (
        state.selectedLocationImageReorder &&
        state.selectedLocation.id === state.selectedLocationImageReorder
      ) {
        handleImageReordering();
        return false;
      }
    }
    let lKounter = kounter;
    if (lKounter < 1) {
      lKounter = 1;
    } else if (lKounter > locations.length) {
      lKounter = locations.length;
    }
    const selectLocation = locations[lKounter - 1];
    setState(
      {
        isPrePlanningMode: false,
        showDrawingTools: false,
        showDrawingToolsOption: null,
        getDistacebyPolyline: "",
        isPolygonDrawn: false,
        prePlanGeoOutline: [],
        selectedLocation: selectLocation,
        isSelected: true,
        newMsg: false,
        locationKounter: lKounter,
      },
      () => {
        if (selectLocation.building && selectLocation.images) {
          setState({
            loading: false,
          });
        } else {
          const locationsLink = selectLocation.links.find(
            (x) => x.rel === "self"
          );
          getLocation(
            locationsLink,
            showLoadingLocation,
            handleLocationSuccess,
            handleLocationError
          );
        }
        map.refreshLocations(getLocationsSelected(locations));
        handleSelectHydrantsByLocation(true, selectLocation);
        locateLocation(lKounter);
        let lat = 0;
        let lon = 0;
        for (let ii = 0; ii < selectLocation.geoOutline.length; ii++) {
          lat = lat + selectLocation.geoOutline[ii].latitude;
          lon = lon + selectLocation.geoOutline[ii].longitude;
        }
        lat = lat / selectLocation.geoOutline.length;
        lon = lon / selectLocation.geoOutline.length;
        handleMapCenterChanged({ lat: lat, lng: lon });
        //18 is the zoom level where I can see the location well
        map.setZoom(18);
        map.setCenter();
      }
    );
    return true;
  }

  function handlePrevLocatorClick() {
    setLocation(state.locationKounter - 1);
  }

  function handleNextLocatorClick() {
    setLocation(state.locationKounter + 1);
  }

  function handleFilterCriteria(arr) {
    setState(
      {
        selectedLocation: null,
      },
      () => {
        clearSelectedHydrants();
        map.refreshLocations();
        getFilteredLocations(arr);
      }
    );
  }

  function renderLightbox() {
    if (!state.showLightbox) return null;
    let lightboxProps = {
      images: state.selectedLocation.images,
      lightboxIsOpen: state.showLightbox,
      toggleLightbox: toggleLightbox,
      currentImageIndex: state.currentImageIndex,
    };
    if (state.activeTabKey === 5) {
      lightboxProps = {
        images: onlyTagContent(state.selectedLocation.images, "First In"),
        lightboxIsOpen: state.showLightbox,
        toggleLightbox: toggleLightbox,
        currentImageIndex: state.currentImageIndex,
      };
    } else if (state.activeTabKey === 6) {
      lightboxProps = {
        images: onlyTagContent(state.selectedLocation.images, "Command"),
        lightboxIsOpen: state.showLightbox,
        toggleLightbox: toggleLightbox,
        currentImageIndex: state.currentImageIndex,
      };
    }
    return <Lightbox {...lightboxProps} />;
  }

  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  function onScreenshot() {
    const whichClass = state.selectedLocation
      ? ".map-container"
      : ".map-container1";
    Capture(
      document.querySelector(
        ".map-image-container >" + whichClass + "> div > div > div"
      ),
      { useCORS: true }
    ).then((canvas) => {
      const imgData = canvas.toDataURL();
      const link = document.createElement("a");
      link.download = "mapImage.png";
      const blob = dataURLtoBlob(imgData);
      const objurl = URL.createObjectURL(blob);
      link.href = objurl;
      document.body.appendChild(link);
      link.click();
    });
  }

  function renderContext() {
    if (!state.contextMenu) return null;
    if (state.activeTabKey === 5 || state.activeTabKey === 6) return null;
    const contextMenuProps = {
      contextMenu: state.contextMenu,
      role: user.role,
      activeTabKey: state.activeTabKey,
      handleContextMenuItemSelect: handleContextMenuItemSelect,
    };
    return <ContextMenu {...contextMenuProps} />;
  }

  const mapProps = {
    locationChangeKounter: customer.locationChangeKounter,
    zoom: customer.config.zoom,
    center: {
      lat: customer.config.lat,
      lng: customer.config.lon,
    },
    mapTypeId: customer.config.mapeType,
    markers: customerHydrants,
    locations: getLocationsSelected(locations),
    selectedLocation: state.selectedLocation,
    handleHydrantRightClick: handleHydrantRightClick,
    handleLocationClick: handleLocationClick,
    handleLocationRightClick: handleLocationRightClick,
    handleMapClick: handleMapClick,
    handleMapRightClick: handleMapRightClick,
    handleZoomChanged: handleMapZoomChanged,
    handleCenterChanged: handleMapCenterChanged,
    handleMapTypeChanged: handleMapTypeChanged,
    handlePolygonComplete: handlePolygonComplete,
    handlePolylineComplete: handlePolylineComplete,
    setMarkerProps: handleSetHydrantProps,
    selectMarkersByLocation: handleSelectHydrantsByLocation,
    showDrawingTools: state.showDrawingTools,
    showDrawingToolsOption: state.showDrawingToolsOption,
    prevPolylineData: state.prevPolylineData,
  };

  const getFlowDataProps = () => {
    let totalHoses = 0;
    let totalFlowRate = 0;
    for (let i = 0; i < selectedHydrants.length; i++) {
      if (selectedHydrants[i].hydrantSize) {
        totalHoses = totalHoses + parseInt(selectedHydrants[i].hydrantSize);
      }
      const hydrantFlowRate =
        selectedHydrants[i].hydrantFlowRate === null ||
        selectedHydrants[i].hydrantFlowRate === undefined
          ? 500
          : parseInt(selectedHydrants[i].hydrantFlowRate);
      totalFlowRate = totalFlowRate + hydrantFlowRate;
    }
    return {
      selectedHydrantsLength: selectedHydrants.length,
      totalHoses: totalHoses,
      totalFlowRate: totalFlowRate,
    };
  };

  const locationDataProps = {
    customer: customer,
    location: state.selectedLocation,
    locationDataForm: state.locationDataForm,
    buildingDataForm: state.buildingDataForm,
    isPrePlanningMode: state.isPrePlanningMode,
    isPolygonDrawn: state.isPolygonDrawn,
    isGettingPreplan: state.isGettingPreplan,
    onCancelPrePlan: handleCancelPrePlanLocation,
    onPrePlanFormSubmit: handlePrePlanFormSubmit,
    onBuildingFormSubmit: handleBuildingFormSubmit,
    onPrePlanFormChange: handlePrePlanFormChange,
    onBuildingFormChange: handleBuildingFormChange,
    onRePlanSubmit: handleRePlanSubmit,
    onRePlanStart: handleRePlanStart,
    reDrawPolygon: state.reDrawPolygon,
  };

  const FlowDataAndHydrantsInfo = () => (
    <div>
      <FlowData {...getFlowDataProps()} />
      <HydrantsInfo
        {...{
          selectedHydrants: selectedHydrants,
        }}
      />
    </div>
  );

  const SMSInfo = () => (
    <div>
      <SMSListInfo
        {...{
          smsList: smsList,
          myProps: this,
        }}
      />
    </div>
  );

  const FIOInfo = () => (
    <div>
      <div className="roof-type-container section-container">
        <div className="section-header">Roof Type</div>
        {state.selectedLocation &&
          state.selectedLocation.building &&
          state.selectedLocation.building.roofType && (
            <div className="section-content">
              {state.selectedLocation.building.roofType}
            </div>
          )}
        {state.selectedLocation &&
          state.selectedLocation.building &&
          !state.selectedLocation.building.roofType && (
            <div className="section-content">{"Not defined"}</div>
          )}
      </div>
      <FlowDataAndHydrantsInfo />
    </div>
  );

  const CommandInfo = () => (
    <div>
      <div className="command-container section-container">
        <div className="section-content">{""}</div>
      </div>
    </div>
  );
  const canEditImage =
    user && (user.role === "ADMIN" || user.role === "PLANNER");
  const showMap =
    !!(customer.config.lat && customer.config.lon) && !state.isAnnotationMode;
  const customGlyphStyle = [
    {
      position: "absolute",
      top: "9px",
      zIndex: 1,
      right: "80px",
      padding: "2px",
      borderRadius: "5px",
      background: "#fff",
    },
    {
      marginRight: "5px",
    },
    {
      position: "absolute",
      zIndex: 1,
      background: "#fff",
      padding: "5px",
      borderRadius: "2px",
      top: "96px",
      right: "15px",
      cursor: "pointer",
    },
  ];

  const tooltip = (
    <Tooltip id="tooltip">
      <strong>Toggle distance mode</strong>
    </Tooltip>
  );

  /**
   * End Main Functions
   */

  return (
    <div className="content-wrapper">
      {state.loading && (
        <div className="loading-container">
          <MyLoader />
        </div>
      )}
      {showMap ? (
        <div style={style} className="content">
          <div className="map-image-container">
            <OverlayTrigger placement="bottom" overlay={tooltip}>
              <div style={customGlyphStyle[0]}>
                {state.getDistacebyPolyline && (
                  <span>{state.getDistacebyPolyline}</span>
                )}
                <Image
                  width={50}
                  height={50}
                  style={customGlyphStyle[1]}
                  src="/images/ruler.png"
                  alt="Ruler"
                />
                <label style={sliderToggle} className="switch">
                  <FormControl
                    type="checkbox"
                    checked={
                      state.showDrawingTools &&
                      state.showDrawingToolsOption === "Polyline"
                    }
                    onChange={handleDistanceMode}
                    name="distanceMode"
                  />
                  <span className="slider round" />
                </label>
              </div>
            </OverlayTrigger>
            {/* <ReactDock
              OnFilterChange={handleFilterCriteria}
              onLocatorClick={handleLocatorClick}
              onNextLocatorClick={handleNextLocatorClick}
              onPrevLocatorClick={handlePrevLocatorClick}
            /> */}
            <span
              style={customGlyphStyle[2]}
              onClick={onScreenshot}
              className="glyphicon glyphicon-camera"
            />
            <Map
              {...mapProps}
              ref={(instance) => {
                setMap(instance);
              }}
            />
            {state.selectedLocation &&
              state.activeTabKey !== 5 &&
              state.activeTabKey !== 6 && (
                <ImageStrip
                  images={state.selectedLocation.images}
                  selectedLocationImageReorder={
                    state.selectedLocationImageReorder
                      ? state.selectedLocationImageReorder
                      : null
                  }
                  selectedLocation={
                    state.selectedLocation ? state.selectedLocation : null
                  }
                  onSelection={(index) => selectImage(index)}
                  onAnnotation={(index) => annotateImage(index)}
                  onTagging={(index) => tagPDF(index)}
                  onUpload={(files) => uploadImages(files)}
                  onDelete={(index) => confirmImageDelete(index)}
                  onLeft={(index) => leftImage(index)}
                  onRight={(index) => rightImage(index)}
                  onOK={(index) => okImage(index)}
                  onCancel={(index) => cancelImage(index)}
                  isFIO={false}
                  isCommand={false}
                  canEditImage={canEditImage}
                  changeCounter={state.changeCounter}
                  locationLoading={state.loading}
                />
              )}
            {state.selectedLocation && state.activeTabKey === 5 && (
              <ImageStrip
                images={onlyTagContent(
                  state.selectedLocation.images,
                  "First In"
                )}
                selectedLocationImageReorder={
                  state.selectedLocationImageReorder
                    ? state.selectedLocationImageReorder
                    : null
                }
                selectedLocation={
                  state.selectedLocation ? state.selectedLocation : null
                }
                onSelection={(index) => selectImage(index)}
                onAnnotation={(index) => annotateImage(index)}
                onTagging={(index) => tagPDF(index)}
                onUpload={(files) => uploadImages(files)}
                onDelete={(index) => confirmImageDelete(index)}
                onLeft={(index) => leftImage(index)}
                onRight={(index) => rightImage(index)}
                onOK={(index) => okImage(index)}
                onCancel={(index) => cancelImage(index)}
                isFIO={true}
                isCommand={false}
                canEditImage={canEditImage}
                changeCounter={state.changeCounter}
                locationLoading={state.loading}
              />
            )}
            {state.selectedLocation && state.activeTabKey === 6 && (
              <ImageStrip
                images={onlyTagContent(
                  state.selectedLocation.images,
                  "Command"
                )}
                selectedLocationImageReorder={
                  state.selectedLocationImageReorder
                    ? state.selectedLocationImageReorder
                    : null
                }
                selectedLocation={
                  state.selectedLocation ? state.selectedLocation : null
                }
                onSelection={(index) => selectImage(index)}
                onAnnotation={(index) => annotateImage(index)}
                onTagging={(index) => tagPDF(index)}
                onUpload={(files) => uploadImages(files)}
                onDelete={(index) => confirmImageDelete(index)}
                onLeft={(index) => leftImage(index)}
                onRight={(index) => rightImage(index)}
                onOK={(index) => okImage(index)}
                onCancel={(index) => cancelImage(index)}
                isFIO={false}
                isCommand={true}
                canEditImage={canEditImage}
                changeCounter={state.changeCounter}
                locationLoading={state.loading}
              />
            )}
          </div>
          <div className="hydrants-info-tabs">
            <Tabs
              activeKey={state.activeTabKey}
              onSelect={handleTabSelect}
              id="info-tabs"
            >
              <Tab eventKey={1} title="Flow">
                {Object.keys(customer.pinLegend).length !== 0 && (
                  <IconLegend pinLegend={customer.pinLegend} />
                )}
                <FlowDataAndHydrantsInfo />
              </Tab>
              <Tab eventKey={2} title="Location">
                <LocationData {...locationDataProps} />
                <FlowDataAndHydrantsInfo />
              </Tab>
              <Tab eventKey={3} title="Building Data">
                <BuildingData {...locationDataProps} />
              </Tab>
              {state.errorConnection && !state.closedConnection && (
                <Tab
                  eventKey={4}
                  title={
                    <span>
                      Dispatch
                      <i className="glyphicon glyphicon-pause" />
                    </span>
                  }
                >
                  <SMSInfo />
                </Tab>
              )}
              {state.closedConnection && (
                <Tab
                  eventKey={4}
                  title={
                    <span>
                      Dispatch
                      <i className="glyphicon glyphicon-stop" />
                    </span>
                  }
                >
                  <SMSInfo />
                </Tab>
              )}
              {state.newMsg && state.activeTabKey !== 4 && (
                <Tab
                  eventKey={4}
                  title={
                    <span>
                      Dispatch
                      <i className="glyphicon glyphicon-bell" />
                    </span>
                  }
                >
                  <SMSInfo />
                </Tab>
              )}
              {!state.errorConnection &&
                !state.closedConnection &&
                !(state.newMsg && state.activeTabKey !== 4) && (
                  <Tab eventKey={4} title="Dispatch">
                    <SMSInfo />
                  </Tab>
                )}
              {state.selectedLocation && (
                <Tab eventKey={5} title={<span>First In</span>}>
                  <FIOInfo />
                </Tab>
              )}
              {state.selectedLocation && (
                <Tab eventKey={6} title={<span>Command</span>}>
                  <CommandInfo />
                </Tab>
              )}
            </Tabs>
          </div>
        </div>
      ) : null}
      {state.isAnnotationMode ? (
        <AnnotatorContainer
          image={state.selectedLocation.images[state.currentImageIndex]}
          onSave={(json, svg, tags) => handleSaveAnnotation(json, svg, tags)}
          onCancel={() => cancelAnnotation()}
          json={state.annotationJson}
          tags={state.imageTags}
        />
      ) : null}
      {renderLightbox()}
      {renderContext()}
      <Modal
        showModal={state.showModal}
        toggleModal={toggleModal}
        modal={state.modal}
      />
    </div>
  );
}
