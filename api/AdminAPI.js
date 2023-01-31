import * as AJAXUtil from "./AJAXUtil";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export function getLog(parameters, successCallback, errorCallback, dispatch) {
  AJAXUtil.AJAX({
    method: "GET",
    url: `${publicRuntimeConfig.API_BASE_URL}/api/debugPanel?${parameters}`,
  })
    .then((res) => {
      if (typeof successCallback === "function") {
        successCallback(res.data);
      }
    })
    .catch(function (error) {
      let eMessage = "Something went wrong";
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.msg
      ) {
        eMessage = error.response.data.msg;
      }
      if (typeof errorCallback === "function") {
        errorCallback(eMessage);
      }
    });
}

export function getUsersList(successCallback, errorCallback, dispatch) {
  AJAXUtil.AJAX({
    method: "GET",
    url: `${publicRuntimeConfig.API_BASE_URL}/api/debugPanel/allUsersList`,
  })
    .then((res) => {
      if (typeof successCallback === "function") {
        successCallback(res.data);
      }
    })
    .catch(function (error) {
      let eMessage = "Something went wrong";
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.msg
      ) {
        eMessage = error.response.data.msg;
      }
      if (typeof errorCallback === "function") {
        errorCallback(eMessage);
      }
    });
}
