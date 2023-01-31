import { loginSuccess, loginError } from "../actions/session-actions";
import { push } from "react-router-redux";
import axios from "axios";

import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export function loginUser(
  dispatch,
  credentials,
  successCallback,
  errorCallback
) {
  const credString = btoa(`${credentials.email}:${credentials.password}`);
  axios
    .post(
      `${publicRuntimeConfig.API_BASE_URL}/api/auth/token`,
      {},
      {
        headers: { Authorization: `Basic ${credString}` },
      }
    )

    .then(function (response) {
      const errMsg = getLink(response.data.links, "msg");
      if (errMsg) {
        callCommonCallback(errorCallback);
        dispatch(loginError(errMsg.href));
      } else {
        sessionStorage.setItem("jwt", response.data.accessToken);
        sessionStorage.setItem(
          "customer",
          JSON.stringify(getLink(response.data.links, "customer"))
        );
        sessionStorage.setItem(
          "user",
          JSON.stringify(getLink(response.data.links, "user"))
        );
        sessionStorage.setItem("tokenType", response.data.tokenType);
        sessionStorage.setItem(
          "customerID",
          JSON.stringify(getLink(response.data.links, "customerID"))
        );
        if (typeof successCallback === "function") {
          const strComp = getLink(response.data.links, "user").href.split("/");
          const userId = strComp[strComp.length - 1];
          successCallback(credentials.email, userId);
        }
        dispatch(loginSuccess(response.data));
        dispatch(push("/"));
      }
    })
    .catch(function (error) {
      callCommonCallback(errorCallback);
      dispatch(loginError());
    });
}

function callCommonCallback(commonCallback) {
  if (typeof commonCallback === "function") {
    commonCallback();
  }
}

function getLink(links, rel) {
  return links.filter(function (obj) {
    return obj.rel === rel;
  })[0];
}

export function forgotPasswordResetRequest(data, showMessage) {
  axios
    .post(
      `${publicRuntimeConfig.API_BASE_URL}/api/passwordresetrequest`,
      data,
      {}
    )
    .then(function (response) {
      showMessage({
        status: "Success",
        message:
          "Your request successfully submitted. Please check your email for reset password link.",
      });
    })
    .catch(function (error) {
      showMessage({
        status: "Error",
        message: "Oops! something went wrong in forgotPasswordResetRequest.",
      });
    });
}

export function forgotPasswordReset(data, showMessage) {
  axios
    .post(
      `${publicRuntimeConfig.API_BASE_URL}/api/completepasswordreset`,
      data,
      {}
    )
    .then(function (response) {
      showMessage({
        status: "Success",
        message: "Password reset successfully",
      });
    })
    .catch(function (error) {
      showMessage({
        status: "Error",
        message: "Oops! something went wrong in forgotPasswordReset.",
      });
    });
}

export function submitSignUpSecondary(data, showMessage, linkPart) {
  axios
    .post(
      `${publicRuntimeConfig.API_BASE_URL}/api/registrationLink/${linkPart}/createSecondary`,
      data,
      {}
    )
    .then(function (response) {
      showMessage({ status: "Success", message: "Data sent successfully" });
    })
    .catch(function (error) {
      showMessage({ status: "Error", message: "Oops! something went wrong." });
    });
}

export function validateLinkPart(showMessage, onSuccess, linkPart) {
  axios
    .get(
      `${publicRuntimeConfig.API_BASE_URL}/api/registrationLink/${linkPart}/validate`,
      {}
    )
    .then(function (response) {
      if (response.data.success) {
        onSuccess();
      } else {
        showMessage({ status: "Error", message: "Link is Not Valid" });
      }
    })
    .catch(function (error) {
      showMessage({ status: "Error", message: "Link is Not Valid" });
    });
}

export function getUserFromLinkPart(showMessage, onSuccess, linkPart) {
  axios
    .get(
      `${publicRuntimeConfig.API_BASE_URL}/api/registrationLink/${linkPart}/user`,
      {}
    )
    .then(function (response) {
      onSuccess(response.data.email);
    })
    .catch(function (error) {
      showMessage({ status: "Error", message: "Link is Not Valid" });
    });
}
