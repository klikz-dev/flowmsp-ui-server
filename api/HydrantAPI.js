import * as AJAXUtil from "./AJAXUtil";
import {
  addCustomerHydrant,
  editCustomerHydrant,
  deleteCustomerHydrant,
  deleteCustomerHydrantAll,
} from "../actions/customer-actions";
import axios from "axios";

export function addHydrant(dispatch, hydrant, successCallback, errorCallback) {
  AJAXUtil.AJAX({
    method: "PUT",
    url: JSON.parse(sessionStorage.hydrant).href,
    data: hydrant,
  })
    .then((res) => {
      dispatch(addCustomerHydrant(res.data));
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

export function editHydrant(
  dispatch,
  id,
  hydrant,
  successCallback,
  errorCallback
) {
  AJAXUtil.AJAX({
    method: "PATCH",
    url: `${JSON.parse(sessionStorage.hydrant).href}/${id}`,
    data: hydrant,
  })
    .then((res) => {
      dispatch(editCustomerHydrant(res.data));
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

export function deleteHydrant(dispatch, id, successCallback, errorCallback) {
  AJAXUtil.AJAX({
    method: "DELETE",
    url: `${JSON.parse(sessionStorage.hydrant).href}/${id}`,
  })
    .then((res) => {
      if (res.data) {
        if (res.data.success) {
          dispatch(deleteCustomerHydrant(id));
          if (typeof successCallback === "function") {
            successCallback();
          }
        } else {
          if (typeof errorCallback === "function") {
            errorCallback(res);
          }
        }
      } else {
        if (typeof errorCallback === "function") {
          errorCallback();
        }
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

export function deleteAllHydrants(dispatch, successCallback, errorCallback) {
  AJAXUtil.AJAX({
    method: "DELETE",
    url: `${JSON.parse(sessionStorage.hydrant).href}`,
  })
    .then((res) => {
      dispatch(deleteCustomerHydrantAll());
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

export function uploadHydrant(
  data,
  successCallback,
  errorCallback,
  uploadConfig
) {
  const config = {
    headers: {
      Authorization: `${sessionStorage.tokenType} ${sessionStorage.jwt}`,
      "Content-Type": "multipart/form-data",
      "X-FlowMSP-Source": "Web",
      "X-FlowMSP-Version": "2.40.0",
    }, // TODO: Replace with localStorage config or something
    onUploadProgress: function (progressEvent) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      if (typeof uploadConfig === "function") {
        uploadConfig(percentCompleted);
      }
    },
  };
  const url = `${JSON.parse(sessionStorage.hydrant).href}/upload`;
  axios
    .put(url, data, config)
    .then((res) => {
      if (res.data) {
        if (res.data.successFlag === 0) {
          if (typeof successCallback === "function") {
            const msg = res.data.log;
            successCallback(msg);
          }
        } else {
          if (typeof errorCallback === "function") {
            const msg = res.data.log;
            errorCallback(msg);
          }
        }
      } else {
        if (typeof errorCallback === "function") {
          errorCallback("Error processing file");
        }
      }
    })
    .catch(function (error) {
      if (typeof errorCallback === "function") {
        errorCallback("Error while uploading file");
      }
    });
}
