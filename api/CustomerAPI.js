import * as AJAXUtil from "./AJAXUtil";
import {
  setCustomer,
  setCustomerConfig,
  setCustomerHydrants,
  setPartnerHydrants,
  setPartnerHydrantsFirst,
  setCustomerLocations,
  setPartnerLocationsFirst,
  setPartnerLocations,
  setCustomerLocation,
  setCustomerUsers,
  setCustomerList,
  setCustomerRadiusList,
  setCustomerPartnersList,
  setCustomerSMS,
  setNewMessage,
  setBackLogMessage,
  setCustomerFilterLocations,
  setLocationKounter,
} from "../actions/customer-actions";

import getNextConfig from "next/config";

const { publicRuntimeConfig } = getNextConfig();

function getHydrantsChain(
  dispatch,
  showLoader,
  successCallback,
  errorCallback
) {
  const hydrantsLink = JSON.parse(sessionStorage.hydrant);
  showLoader("Loading Hydrant Information", 5, 5);
  AJAXUtil.AJAX({
    method: hydrantsLink.op,
    url: hydrantsLink.href,
  })
    .then((res) => {
      if (res.data) {
        dispatch(setCustomerHydrants(res.data));
      }
      showLoader("Loaded Hydrants Information", 5, 5);
      if (typeof successCallback === "function") {
        const message =
          res.data.data && res.data.data.length > 0
            ? null
            : "No hydrant found. Right click on the Map to add a hydrant.";
        successCallback(message);
      }
    })
    .catch(function (error) {
      showLoader("Error Loading Hydrants Information", 5, 5);
      if (typeof errorCallback === "function") {
        errorCallback("Error Loading Hydrants");
      }
    });
}

function getHydrantsPRecursive(
  dispatch,
  showLoader,
  successCallback,
  errorCallback,
  urlArr,
  index,
  length
) {
  if (index >= length) {
    getHydrantsChain(dispatch, showLoader, successCallback, errorCallback);
    return;
  }
  showLoader(`Loading Hydrants- Partner ${index + 1}/${length}`, 4, 5);
  AJAXUtil.AJAX({
    method: "GET",
    url: urlArr[index],
  })
    .then((res) => {
      if (res.data.data) {
        dispatch(setPartnerHydrants(res.data));
      }
      showLoader(`Loaded Hydrants- Partner ${index + 1}/${length}`, 4, 5);
      getHydrantsPRecursive(
        dispatch,
        showLoader,
        successCallback,
        errorCallback,
        urlArr,
        index + 1,
        length
      );
    })
    .catch(function (error) {
      showLoader(
        `Error Loading Hydrants - Partner ${index + 1}/${length}`,
        4,
        5
      );
      if (typeof errorCallback === "function") {
        errorCallback("Error Loading Hydrants");
      }
    });
}

function getHydrantsPChain(
  dispatch,
  showLoader,
  successCallback,
  errorCallback
) {
  dispatch(setPartnerHydrantsFirst());
  const hydrantsLink = JSON.parse(sessionStorage.hydrant);
  const partnersArrayStr = sessionStorage.myPartners;
  if (partnersArrayStr === "") {
    getHydrantsChain(dispatch, showLoader, successCallback, errorCallback);
  } else {
    const partnersLinkArray = [];
    const partnersArray = JSON.parse(partnersArrayStr);
    for (let ii = 0; ii < partnersArray.length; ii++) {
      const url = `${hydrantsLink.href}/partners/${partnersArray[ii].partnerId}`;
      partnersLinkArray.push(url);
    }
    getHydrantsPRecursive(
      dispatch,
      showLoader,
      successCallback,
      errorCallback,
      partnersLinkArray,
      0,
      partnersLinkArray.length
    );
  }
}

function getLocationsChain(
  dispatch,
  showLoader,
  successCallback,
  errorCallback
) {
  const locationsLink = JSON.parse(sessionStorage.location);
  showLoader("Loading Pre-Planning Information", 4, 5);
  AJAXUtil.AJAX({
    method: locationsLink.op,
    url: locationsLink.href,
  })
    .then((res) => {
      if (res.data) {
        dispatch(setCustomerLocations(res.data));
      }
      showLoader("Loaded Pre-Planning Information", 4, 5);
      getHydrantsPChain(dispatch, showLoader, successCallback, errorCallback);
    })
    .catch(function (error) {
      showLoader("Error Loading Pre-Planning Information", 4, 5);
      if (typeof errorCallback === "function") {
        errorCallback("Error Loading Pre-Planning");
      }
    });
}

function getLocationsPRecursive(
  dispatch,
  showLoader,
  successCallback,
  errorCallback,
  urlArr,
  index,
  length
) {
  if (index >= length) {
    getLocationsChain(dispatch, showLoader, successCallback, errorCallback);
    return;
  }
  showLoader(
    `Loading Pre-Planning Information- Partner ${index + 1}/${length}`,
    4,
    5
  );
  AJAXUtil.AJAX({
    method: "GET",
    url: urlArr[index],
  })
    .then((res) => {
      if (res.data.data) {
        dispatch(setPartnerLocations(res.data));
      }
      showLoader(
        `Loaded Pre-Planning Information- Partner ${index + 1}/${length}`,
        4,
        5
      );
      getLocationsPRecursive(
        dispatch,
        showLoader,
        successCallback,
        errorCallback,
        urlArr,
        index + 1,
        length
      );
    })
    .catch(function (error) {
      showLoader(
        `Error Loading Pre-Planning Information - Partner ${
          index + 1
        }/${length}`,
        4,
        5
      );
      if (typeof errorCallback === "function") {
        errorCallback("Error Loading Pre-Planning");
      }
    });
}

function getLocationsPChain(
  dispatch,
  showLoader,
  successCallback,
  errorCallback
) {
  const locationsLink = JSON.parse(sessionStorage.location);
  const partnersLinkArray = [];
  const partnersArrayStr = sessionStorage.myPartners;
  const partnersArray = JSON.parse(partnersArrayStr);
  for (let ii = 0; ii < partnersArray.length; ii++) {
    const url = `${locationsLink.href}/partners/${partnersArray[ii].partnerId}`;
    partnersLinkArray.push(url);
  }
  getLocationsPRecursive(
    dispatch,
    showLoader,
    successCallback,
    errorCallback,
    partnersLinkArray,
    0,
    partnersLinkArray.length
  );
}

function getCustomerPartnersChain(
  dispatch,
  showLoader,
  successCallback,
  errorCallback
) {
  sessionStorage.setItem("myPartners", "");
  showLoader("Loading Partners Information", 3, 5);
  AJAXUtil.AJAX({
    method: "GET",
    url: `${JSON.parse(sessionStorage.customerPartnersLink).href}`,
  })
    .then((res) => {
      showLoader("Loaded Partners Information", 3, 5);
      dispatch(setCustomerPartnersList(res.data));
      dispatch(setPartnerLocationsFirst());
      if (res.data.data) {
        sessionStorage.setItem("myPartners", JSON.stringify(res.data.data));
        getLocationsPChain(
          dispatch,
          showLoader,
          successCallback,
          errorCallback
        );
      } else {
        getLocationsChain(dispatch, showLoader, successCallback, errorCallback);
      }
    })
    .catch(function (error) {
      showLoader("Error Loading Partners Information", 3, 5);
      if (typeof errorCallback === "function") {
        errorCallback("Error Loading Partners Information");
      }
    });
}

function getCustomersUserChain(
  dispatch,
  showLoader,
  successCallback,
  errorCallback
) {
  showLoader("Loading User Specific Information", 2, 5);
  const customerUsersLink = JSON.parse(sessionStorage.customeruserslink);
  AJAXUtil.AJAX({
    method: customerUsersLink.op,
    url: customerUsersLink.href,
  })
    .then((res) => {
      showLoader("Loaded User Specific Information", 2, 5);
      if (res.data) {
        dispatch(setCustomerUsers(res.data));
      }
      getCustomerPartnersChain(
        dispatch,
        showLoader,
        successCallback,
        errorCallback
      );
    })
    .catch(function (error) {
      showLoader("Error Loading User Specific Information", 2, 5);
      if (typeof errorCallback === "function") {
        errorCallback("Error Loading User Specific Information");
      }
    });
}

export function getCustomer(
  dispatch,
  showLoader,
  successCallback,
  errorCallback
) {
  if (typeof showLoader === "function") {
    showLoader("Loading Customer Information", 1, 5);
  }

  AJAXUtil.AJAX({
    method: "GET",
    url: JSON.parse(sessionStorage.customer).href,
  })
    .then((res) => {
      dispatch(setCustomer(res.data));
      if (typeof showLoader === "function") {
        showLoader("Loaded Customer Information", 1, 5);
      }

      const hydrantsLink = res.data.links.find((x) => x.rel === "hydrants");
      sessionStorage.setItem("hydrant", JSON.stringify(hydrantsLink));
      const locationsLink = res.data.links.find((x) => x.rel === "locations");
      sessionStorage.setItem("location", JSON.stringify(locationsLink));
      sessionStorage.setItem(
        "preplan",
        JSON.stringify(res.data.links.find((x) => x.rel === "preplan"))
      );
      const customerUsersLink = res.data.links.find((x) => x.rel === "users");
      sessionStorage.setItem(
        "customeruserslink",
        JSON.stringify(customerUsersLink)
      );
      const customerPartnersLink = res.data.links.find(
        (x) => x.rel === "partners"
      );
      sessionStorage.setItem(
        "customerPartnersLink",
        JSON.stringify(customerPartnersLink)
      );
      const symbolLink = res.data.links.find((x) => x.rel === "symbols");
      sessionStorage.setItem("symbolLink", JSON.stringify(symbolLink));

      getCustomersUserChain(
        dispatch,
        showLoader,
        successCallback,
        errorCallback
      );
    })
    .catch(function (error) {
      if (typeof showLoader === "function") {
        showLoader("Error Loading Customer Information", 1, 5);
      }
      let errorMsg = "Oops! Something went wrong in getCustomer!";
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.errorMessage
      ) {
        errorMsg = error.response.data.errorMessage;
      }
      if (typeof errorCallback === "function") {
        errorCallback(errorMsg);
      }
    });
}

function getCustomerPartnersChain2(
  dispatch,
  showLoader,
  successCallback,
  errorCallback
) {
  if (typeof showLoader === "function") {
    showLoader("Loading Partners Information", 3, 5);
  }
  AJAXUtil.AJAX({
    method: "GET",
    url: `${JSON.parse(sessionStorage.customerPartnersLink).href}`,
  })
    .then((res) => {
      if (typeof showLoader === "function") {
        showLoader("Loaded Partners Information", 3, 5);
      }
      dispatch(setCustomerPartnersList(res.data));
      if (typeof successCallback === "function") {
        successCallback();
      }
    })
    .catch(function (error) {
      if (typeof showLoader === "function") {
        showLoader("Error Loading Partners Information", 3, 5);
      }
      if (typeof errorCallback === "function") {
        errorCallback("Error Loading Partners Information");
      }
    });
}

function getCustomersUserChain2(
  dispatch,
  showLoader,
  successCallback,
  errorCallback
) {
  if (typeof showLoader === "function") {
    showLoader("Loading User Specific Information", 2, 5);
  }
  const customerUsersLink = JSON.parse(sessionStorage.customeruserslink);
  AJAXUtil.AJAX({
    method: customerUsersLink.op,
    url: customerUsersLink.href,
  })
    .then((res) => {
      if (typeof showLoader === "function") {
        showLoader("Loaded User Specific Information", 2, 5);
      }
      if (res.data) {
        dispatch(setCustomerUsers(res.data));
      }
      getCustomerPartnersChain2(
        dispatch,
        showLoader,
        successCallback,
        errorCallback
      );
    })
    .catch(function (error) {
      if (typeof showLoader === "function") {
        showLoader("Error Loading User Specific Information", 2, 5);
      }
      if (typeof errorCallback === "function") {
        errorCallback("Error Loading User Specific Information");
      }
    });
}

export function getCustomerMini(
  dispatch,
  showLoader,
  successCallback,
  errorCallback
) {
  if (typeof showLoader === "function") {
    showLoader("Refreshing Customer Information", 1, 5);
  }
  AJAXUtil.AJAX({
    method: "GET",
    url: JSON.parse(sessionStorage.customer).href,
  })
    .then((res) => {
      dispatch(setCustomer(res.data));
      if (typeof showLoader === "function") {
        showLoader("Loaded Customer Information", 1, 5);
      }

      const hydrantsLink = res.data.links.find((x) => x.rel === "hydrants");
      sessionStorage.setItem("hydrant", JSON.stringify(hydrantsLink));
      const locationsLink = res.data.links.find((x) => x.rel === "locations");
      sessionStorage.setItem("location", JSON.stringify(locationsLink));
      sessionStorage.setItem(
        "preplan",
        JSON.stringify(res.data.links.find((x) => x.rel === "preplan"))
      );
      const customerUsersLink = res.data.links.find((x) => x.rel === "users");
      sessionStorage.setItem(
        "customeruserslink",
        JSON.stringify(customerUsersLink)
      );
      const customerPartnersLink = res.data.links.find(
        (x) => x.rel === "partners"
      );
      sessionStorage.setItem(
        "customerPartnersLink",
        JSON.stringify(customerPartnersLink)
      );
      const symbolLink = res.data.links.find((x) => x.rel === "symbols");
      sessionStorage.setItem("symbolLink", JSON.stringify(symbolLink));

      getCustomersUserChain2(
        dispatch,
        showLoader,
        successCallback,
        errorCallback
      );
    })
    .catch(function (error) {
      if (typeof showLoader === "function") {
        showLoader("Error Loading Customer Information", 1, 5);
      }
      let errorMsg = "Oops! Something went wrong in getCustomerMini!";
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.errorMessage
      ) {
        errorMsg = error.response.data.errorMessage;
      }
      if (typeof errorCallback === "function") {
        errorCallback(errorMsg);
      }
    });
}

export function getCustomerList(dispatch) {
  AJAXUtil.AJAX({
    method: "GET",
    url: `${publicRuntimeConfig.API_BASE_URL}/api/customer`,
  }).then((res) => {
    dispatch(setCustomerList(res.data));
  });
}

export function getCustomerRadius(
  radius,
  successCallback,
  errorCallback,
  dispatch
) {
  AJAXUtil.AJAX({
    method: "GET",
    url: `${
      JSON.parse(sessionStorage.customerPartnersLink).href
    }/radius/${radius}`,
  })
    .then((res) => {
      dispatch(setCustomerRadiusList(res.data));
      if (typeof successCallback === "function") {
        successCallback("Your search ended succesfully!!!");
      }
    })
    .catch(function (error) {
      let errorMsg = "Oops! Something went wrong in getCustomerList!";
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.errorMessage
      ) {
        errorMsg = error.response.data.errorMessage;
      }
      if (typeof errorCallback === "function") {
        errorCallback(errorMsg);
      }
    });
}

export function getCustomerPartners(
  dispatch,
  showLoader,
  successCallback,
  errorCallback
) {
  if (typeof showLoader === "function") {
    showLoader("Loading Partners Information", 4, 5);
  }
  AJAXUtil.AJAX({
    method: "GET",
    url: `${JSON.parse(sessionStorage.customerPartnersLink).href}`,
  })
    .then((res) => {
      dispatch(setCustomerPartnersList(res.data));
      if (typeof showLoader === "function") {
        showLoader("Loaded Partners Information", 4, 5);
      }
      if (typeof successCallback === "function") {
        successCallback();
      }
    })
    .catch(function (error) {
      if (typeof showLoader === "function") {
        showLoader("Error Loading Partners Information", 4, 5);
      }
      if (error && error.response) {
        if (typeof errorCallback === "function") {
          errorCallback();
        }
      }
    });
}

export function addCustomerPartners(
  partners,
  successCallback,
  errorCallback,
  dispatch
) {
  AJAXUtil.AJAX({
    method: "PUT",
    url: `${JSON.parse(sessionStorage.customerPartnersLink).href}`,
    data: partners,
  })
    .then((res) => {
      dispatch(setCustomerPartnersList(res.data));
      if (typeof successCallback === "function") {
        successCallback("Partner(s) preference saved succesfully!!!");
      }
    })
    .catch(function (error) {
      let errorMsg = "Oops! Something went wrong in addCustomerPartners!";
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.errorMessage
      ) {
        errorMsg = error.response.data.errorMessage;
      }
      if (typeof errorCallback === "function") {
        errorCallback(errorMsg);
      }
    });
}

export function getConfig(dispatch) {
  AJAXUtil.AJAX({
    method: "GET",
    url: `${JSON.parse(sessionStorage.customer).href}/uiconfig`,
  }).then((res) => {
    dispatch(setCustomerConfig(res.data));
  });
}

export function saveConfig(dispatch, uiConfig) {
  AJAXUtil.AJAX({
    method: "POST",
    data: uiConfig,
    url: `${JSON.parse(sessionStorage.customer).href}/uiconfig`,
  }).then((res) => {
    // TODO: For now there is no action after saving the config
  });
}

export function createCustomer(form, successCallback, errorCallback) {
  AJAXUtil.AJAX({
    method: "POST",
    data: form,
    url: `${publicRuntimeConfig.API_BASE_URL}/api/signup`,
  })
    .then((res) => {
      if (typeof successCallback === "function") {
        successCallback();
      }
    })
    .catch(function (error) {
      if (error && error.response) {
        if (typeof errorCallback === "function") {
          errorCallback(error.response.data.errorMessage);
        }
      }
    });
}

export function eventSourceMessage(
  successCallback,
  errorCallback,
  connectCallback,
  closedCallback,
  dispatch
) {
  this.source = new EventSource(
    `${publicRuntimeConfig.API_BASE_URL}/eventsource?CustomerID=${
      JSON.parse(sessionStorage.customerID).href
    }&jwt=${encodeURIComponent(sessionStorage.jwt)}`
  );
  this.source.onmessage = function (event) {
    if (event.id === "CLOSE") {
      this.source.close();
      if (typeof closedCallback === "function") {
        closedCallback(event);
      }
    } else {
      dispatch(setNewMessage(event.data));
      if (typeof successCallback === "function") {
        successCallback(event.data);
      }
    }
  };
  this.source.onerror = function (event) {
    if (typeof errorCallback === "function") {
      errorCallback(event);
    }
  };
  this.source.onopen = function (event) {
    if (typeof connectCallback === "function") {
      connectCallback(event);
    }
  };
  this.source.addEventListener("backlog", function (event) {
    dispatch(setBackLogMessage(event.data));
    if (typeof successCallback === "function") {
      successCallback(event.data);
    }
  });
}

export function editCustomer(form, successCallback, errorCallback, dispatch) {
  AJAXUtil.AJAX({
    method: "PATCH",
    data: form,
    url: JSON.parse(sessionStorage.customer).href,
  })
    .then((res) => {
      dispatch(setCustomer(res.data));
      if (typeof successCallback === "function") {
        successCallback("Customer updated successfully");
      }
    })
    .catch(function (error) {
      if (error && error.response) {
        if (typeof errorCallback === "function") {
          const eMessage =
            error.response.data.errorMessage === undefined
              ? "Something went wrong"
              : error.response.data.errorMessage;
          errorCallback(eMessage);
        }
      }
    });
}

export function updateCustomerLatlon(successCallback, errorCallback, dispatch) {
  AJAXUtil.AJAX({
    method: "PATCH",
    url: `${JSON.parse(sessionStorage.customer).href}/latlon`,
  })
    .then((res) => {
      dispatch(setCustomer(res.data));
      if (typeof successCallback === "function") {
        successCallback("Customer updated successfully");
      }
    })
    .catch(function (error) {
      if (error && error.response) {
        if (typeof errorCallback === "function") {
          const eMessage =
            error.response.data.errorMessage === undefined
              ? "Something went wrong"
              : error.response.data.errorMessage;
          errorCallback(eMessage);
        }
      }
    });
}

export function updateCustomerConsent(
  successCallback,
  errorCallback,
  dispatch
) {
  AJAXUtil.AJAX({
    method: "PATCH",
    url: `${JSON.parse(sessionStorage.customer).href}/consent`,
  })
    .then((res) => {
      dispatch(setCustomer(res.data));
      if (typeof successCallback === "function") {
        successCallback("Customer updated successfully");
      }
    })
    .catch(function (error) {
      if (error && error.response) {
        if (typeof errorCallback === "function") {
          const eMessage =
            error.response.data.errorMessage === undefined
              ? "Something went wrong"
              : error.response.data.errorMessage;
          errorCallback(eMessage);
        }
      }
    });
}

export function editCustomerUser(
  form,
  successCallback,
  errorCallback,
  dispatch
) {
  const data = [];
  for (const key in form) {
    if (form.hasOwnProperty(key) && key !== "id") {
      const obj = {};
      obj.op = "replace";
      obj.path = `/${key}`;
      obj.value = form[key];
      data.push(obj);
    }
  }

  AJAXUtil.AJAX({
    method: "PATCH",
    data: data,
    url: `${JSON.parse(sessionStorage.customeruserslink).href}/${form.id}`,
  })
    .then((res) => {
      getCustomersUser(dispatch);
      if (typeof successCallback === "function") {
        const message = "User data updated successfully";
        successCallback(message, true);
      }
    })
    .catch(function (error) {
      let errorMsg = "Oops! Something went wrong in editCustomerUser!";
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.errorMessage
      ) {
        errorMsg = error.response.data.errorMessage;
      }
      if (typeof errorCallback === "function") {
        errorCallback(form, errorMsg);
      }
    });
}
export function getSMS(dispatch) {
  AJAXUtil.AJAX({
    method: "GET",
    url: `${JSON.parse(sessionStorage.customer).href}/mymsgs`,
  }).then((res) => {
    dispatch(setCustomerSMS(res.data));
  });
}

export function getCustomersUser(
  dispatch,
  showLoader,
  successCallback,
  errorCallback
) {
  if (typeof showLoader === "function") {
    showLoader("Loading User Specific Information", 3, 5);
  }
  const customerUsersLink = JSON.parse(sessionStorage.customeruserslink);
  AJAXUtil.AJAX({
    method: customerUsersLink.op,
    url: customerUsersLink.href,
  })
    .then((res) => {
      if (res.data) {
        dispatch(setCustomerUsers(res.data));
      }
      if (typeof successCallback === "function") {
        successCallback();
      }
    })
    .catch(function (error) {
      if (error && error.response) {
        if (typeof errorCallback === "function") {
          errorCallback();
        }
      }
    });
}

export function addCustomerUser(
  data,
  successCallback,
  errorCallback,
  dispatch
) {
  AJAXUtil.AJAX({
    method: "POST",
    data: data,
    url: JSON.parse(sessionStorage.customeruserslink).href,
  })
    .then((res) => {
      if (res.data) {
        getCustomersUser(dispatch);
      }
      if (typeof successCallback === "function") {
        const message = "User Added successfully";
        successCallback(message, true);
      }
    })
    .catch(function (error) {
      let errorMsg = "Oops! Something went wrong in addCustomerUser!";
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.errorMessage
      ) {
        errorMsg = error.response.data.errorMessage;
      }
      if (typeof errorCallback === "function") {
        errorCallback(errorMsg);
      }
    });
}

export function addCustomerUserMain(
  data,
  successCallback,
  errorCallback,
  dispatch
) {
  AJAXUtil.AJAX({
    method: "POST",
    data: data,
    url: `${JSON.parse(sessionStorage.customeruserslink).href}/createMain`,
  })
    .then((res) => {
      if (res.data) {
        getCustomersUser(dispatch);
      }
      if (typeof successCallback === "function") {
        const message = "User Added successfully";
        successCallback(message, true);
      }
    })
    .catch(function (error) {
      let errorMsg = "Oops! Something went wrong in addCustomerUser!";
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.errorMessage
      ) {
        errorMsg = error.response.data.errorMessage;
      }
      if (typeof errorCallback === "function") {
        errorCallback(errorMsg);
      }
    });
}

export function deleteUser(userId, successCallback, errorCallback, dispatch) {
  AJAXUtil.AJAX({
    method: "DELETE",
    url: `${JSON.parse(sessionStorage.customeruserslink).href}/${userId}`,
  })
    .then((res) => {
      getCustomersUser(dispatch);
      if (typeof successCallback === "function") {
        const message = "User Deleted successfully";
        successCallback(message, true);
      }
    })
    .catch(function (error) {
      let errorMsg = "Oops! Something went wrong in deleteUser!";
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.errorMessage
      ) {
        errorMsg = error.response.data.errorMessage;
      }
      if (typeof errorCallback === "function") {
        errorCallback(errorMsg);
      }
    });
}

export function updateLicence(
  customer,
  successCallback,
  errorCallback,
  dispatch
) {
  let updateLink = "";
  for (let i = 0; i < customer.links.length; i++) {
    const link = customer.links[i];
    if (link && link.rel === "customerUpdate") {
      updateLink = link;
      break;
    }
  }

  const customerData = [
    {
      op: "replace",
      path: "/license/licenseType",
      value: customer.license,
    },
    {
      op: "replace",
      path: "/license/expirationTimestamp",
      value: customer.licenseExpirationTimestamp,
    },
    {
      op: "replace",
      path: "/smsNumber",
      value: customer.smsNumber,
    },
    {
      op: "replace",
      path: "/emailGateway",
      value: customer.emailGateway,
    },
    {
      op: "replace",
      path: "/smsFormat",
      value: customer.smsFormat,
    },
    {
      op: "replace",
      path: "/emailFormat",
      value: customer.emailFormat,
    },
    {
      op: "replace",
      path: "/emailSignature",
      value: customer.emailSignature,
    },
    {
      op: "replace",
      path: "/emailSignatureLocation",
      value: customer.emailSignatureLocation,
    },
    {
      op: "replace",
      path: "/fromContains",
      value: customer.fromContains,
    },
    {
      op: "replace",
      path: "/toContains",
      value: customer.toContains,
    },
    {
      op: "replace",
      path: "/subjectContains",
      value: customer.subjectContains,
    },
    {
      op: "replace",
      path: "/bodyContains",
      value: customer.bodyContains,
    },
    {
      op: "replace",
      path: "/fromNotContains",
      value: customer.fromNotContains,
    },
    {
      op: "replace",
      path: "/toNotContains",
      value: customer.toNotContains,
    },
    {
      op: "replace",
      path: "/subjectNotContains",
      value: customer.subjectNotContains,
    },
    {
      op: "replace",
      path: "/bodyNotContains",
      value: customer.bodyNotContains,
    },
    {
      op: "replace",
      path: "/boundSWLat",
      value: customer.boundSWLat,
    },
    {
      op: "replace",
      path: "/boundSWLon",
      value: customer.boundSWLon,
    },
    {
      op: "replace",
      path: "/boundNELat",
      value: customer.boundNELat,
    },
    {
      op: "replace",
      path: "/boundNELon",
      value: customer.boundNELon,
    },
  ];

  AJAXUtil.AJAX({
    method: updateLink.op,
    url: updateLink.href,
    data: customerData,
  })
    .then((res) => {
      successCallback("License updated successfully.");
      getCustomerList(dispatch);
    })
    .catch(function (error) {
      let errorMsg = "Oops! Something went wrong in updateLicence!";
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.errorMessage
      ) {
        errorMsg = error.response.data.errorMessage;
      }
      if (typeof errorCallback === "function") {
        errorCallback(customer, errorMsg);
      }
    });
}

export function registerMeForDispatchMessages(
  successCallback,
  errorCallback,
  dispatch
) {
  const form = { jwt: `${sessionStorage.jwt}` };
  AJAXUtil.AJAX({
    method: "POST",
    data: form,
    url: `${JSON.parse(sessionStorage.customer).href}/registerMeForDispatch`,
  })
    .then((res) => {
      dispatch(setCustomer(res.data));
      if (typeof successCallback === "function") {
        successCallback("Registered for dispatch messages");
      }
    })
    .catch(function (error) {
      let eMessage = "Something went wrong";
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.errorMessage
      ) {
        eMessage = error.response.data.errorMessage;
      }
      if (typeof errorCallback === "function") {
        errorCallback(eMessage);
      }
    });
}

export function deRegisterMeForDispatchMessages(
  successCallback,
  errorCallback,
  dispatch
) {
  const form = { jwt: `${sessionStorage.jwt}` };
  AJAXUtil.AJAX({
    method: "POST",
    data: form,
    url: `${JSON.parse(sessionStorage.customer).href}/deRegisterMeForDispatch`,
  })
    .then((res) => {
      dispatch(setCustomer(res.data));
      if (typeof successCallback === "function") {
        successCallback("Dispatch messages unregistered");
      }
    })
    .catch(function (error) {
      let eMessage = "Something went wrong";
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.errorMessage
      ) {
        eMessage = error.response.data.errorMessage;
      }
      if (typeof errorCallback === "function") {
        errorCallback(eMessage);
      }
    });
}

export function getLocation(
  dispatch,
  locationLink,
  showLoader,
  successCallback,
  errorCallback
) {
  showLoader("Fetching Pre-Planning Information");
  AJAXUtil.AJAX({
    method: locationLink.op,
    url: locationLink.href,
  })
    .then((res) => {
      if (res.data) {
        dispatch(setCustomerLocation(res.data));
      }
      showLoader("Fetched Pre-Planning Information");
      if (typeof successCallback === "function") {
        successCallback(res.data);
      }
    })
    .catch(function (error) {
      showLoader("Error Fetching Pre-Planning Information");
      if (typeof errorCallback === "function") {
        errorCallback("Error Loading Pre-Planning");
      }
    });
}

export function getFilteredLocations(dispatch, arr) {
  dispatch(setCustomerFilterLocations(arr));
}

export function locateLocation(dispatch, locationKounter) {
  dispatch(setLocationKounter(locationKounter));
}
