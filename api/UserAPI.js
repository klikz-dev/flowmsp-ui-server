import * as AJAXUtil from "./AJAXUtil";
import { setUser } from "../actions/user-actions";
import axios from "axios";

export function getUser(dispatch) {
  AJAXUtil.AJAX({
    method: "GET",
    url: JSON.parse(sessionStorage.user).href,
  }).then((res) => {
    dispatch(setUser(res.data));
  });
}

export function changePassword(form, successCallback, errorCallback, dispatch) {
  AJAXUtil.AJAX({
    method: "POST",
    data: form,
    url: `${JSON.parse(sessionStorage.user).href}/password`,
  })
    .then((res) => {
      if (typeof successCallback === "function") {
        successCallback("Password changed successfully");
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

export function editMyProfile(form, successCallback, errorCallback, dispatch) {
  AJAXUtil.AJAX({
    method: "PATCH",
    data: form,
    url: JSON.parse(sessionStorage.user).href,
  })
    .then((res) => {
      if (typeof successCallback === "function") {
        successCallback("Successfully your profile is updated");
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

export function uploadUser(data, successCallback, errorCallback, uploadConfig) {
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
  const url = `${JSON.parse(sessionStorage.user).href}/upload`;
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
