import * as AJAXUtil from "./AJAXUtil";
import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, {
  retries: 50,
  retryCondition: (err) => {
    return err.response?.status === 404 || err.response?.status === 403;
  },
});

import {
  addCustomerLocation,
  deleteCustomerLocation,
  editCustomerLocation,
  addLocationImage,
  updateLocationImage,
  deleteLocationImage,
} from "../actions/customer-actions";

export const uploadImage = (data, dispatch) => {
  const formData = new FormData();
  formData.append("file", data.image);
  return AJAXUtil.AJAX({
    method: "POST",
    url: `${JSON.parse(sessionStorage.location).href}/${data.locationId}/image`,
    data: formData,
  })
    .then(({ data: image }) => {
      dispatch(addLocationImage(data.locationId, image));
      return image;
    })
    .then((image) => {
      return axios.get(image.href).then(() => {
        return image;
      });
    });
};

export const deleteImage = (locationId, imageId, dispatch) => {
  return AJAXUtil.AJAX({
    method: "DELETE",
    url: `${
      JSON.parse(sessionStorage.location).href
    }/${locationId}/image/${imageId}`,
  }).then(() => {
    dispatch(deleteLocationImage(locationId, imageId));
  });
};

export const reorderImage = (
  locationId,
  images,
  dispatch,
  successCallback,
  errorCallback
) => {
  return AJAXUtil.AJAX({
    method: "POST",
    url: `${
      JSON.parse(sessionStorage.location).href
    }/${locationId}/imageReorder`,
    data: images,
  })
    .then((res) => {
      if (res.status === 200 || res.status === 204) {
        if (typeof successCallback === "function") {
          successCallback(locationId);
        }
      } else {
        if (typeof errorCallback === "function") {
          errorCallback(locationId);
        }
      }
    })
    .catch((e) => {
      if (typeof errorCallback === "function") {
        errorCallback(locationId, e);
      }
    });
};

export function getPreplan(
  locationCoords,
  storey,
  storeyBelow,
  successCallback
) {
  AJAXUtil.AJAX({
    method: "POST",
    data: { locationCoords, storey, storeyBelow },
    url: JSON.parse(sessionStorage.preplan).href,
  }).then((res) => {
    if (typeof successCallback === "function") {
      successCallback(res.data);
    }
  });
}

export function getPreplanByLocation(location, successCallback) {
  AJAXUtil.AJAX({
    method: "GET",
    url: `${JSON.parse(sessionStorage.location).href}/${location.id}/preplan`,
  }).then((res) => {
    if (typeof successCallback === "function") {
      successCallback(location, res.data);
    }
  });
}

export function addLocation(dispatch, location, successCallback) {
  AJAXUtil.AJAX({
    method: "PUT",
    url: JSON.parse(sessionStorage.location).href,
    data: location,
  }).then((res) => {
    dispatch(addCustomerLocation(res.data));
    if (typeof successCallback === "function") {
      successCallback();
    }
  });
}

export function editLocation(dispatch, id, location, successCallback) {
  AJAXUtil.AJAX({
    method: "PATCH",
    url: `${JSON.parse(sessionStorage.location).href}/${id}`,
    data: location,
  }).then((res) => {
    dispatch(editCustomerLocation(res.data));
    if (typeof successCallback === "function") {
      successCallback();
    }
  });
}

export function deleteLocation(dispatch, location, successCallback) {
  AJAXUtil.AJAX({
    method: "DELETE",
    url: `${JSON.parse(sessionStorage.location).href}/${location.id}`,
  }).then((res) => {
    dispatch(deleteCustomerLocation(location.id));
    if (typeof successCallback === "function") {
      successCallback();
    }
  });
}

export function saveAnnotation(
  locationId,
  imageId,
  annotationJson,
  annotationSVG,
  dispatch
) {
  return AJAXUtil.AJAX({
    method: "PUT",
    url: `${
      JSON.parse(sessionStorage.location).href
    }/${locationId}/image/${imageId}/annotation`,
    data: { annotationJson, annotationSVG },
  }).then(({ data }) => {
    dispatch(updateLocationImage(locationId, data));
  });
}

export function getAnnotation(locationId, imageId) {
  return AJAXUtil.AJAX({
    method: "GET",
    url: `${
      JSON.parse(sessionStorage.location).href
    }/${locationId}/image/${imageId}/annotation`,
  });
}

export function saveTags(locationId, imageId, tagJson, dispatch) {
  return AJAXUtil.AJAX({
    method: "PUT",
    url: `${
      JSON.parse(sessionStorage.location).href
    }/${locationId}/image/${imageId}/tags`,
    data: tagJson,
  }).then(({ data }) => {
    dispatch(updateLocationImage(locationId, data));
  });
}

export function getTags(locationId, imageId) {
  return AJAXUtil.AJAX({
    method: "GET",
    url: `${
      JSON.parse(sessionStorage.location).href
    }/${locationId}/image/${imageId}/tags`,
  });
}

export function uploadPrePlan(
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
  const url = `${JSON.parse(sessionStorage.location).href}/upload`;
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
