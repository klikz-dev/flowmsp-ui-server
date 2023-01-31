import axios from "axios";

export function AJAX(request) {
  let res;
  return axios({
    method: request.method,
    url: request.url,
    data: request.data,
    headers: {
      Authorization: `${sessionStorage.tokenType} ${sessionStorage.jwt}`,
      "X-FlowMSP-Source": "Web",
      "X-FlowMSP-Version": "2.40.0",
    }, // TODO: Replace with localStorage config or something
  }).then((response) => {
    res = response;
    return res;
  });
}

export function AJAXUpload(request) {
  return axios({
    method: request.method,
    url: request.url,
    data: request.data,
    headers: {
      Authorization: `${sessionStorage.tokenType} ${sessionStorage.jwt}`,
      "Content-Type": "multipart/form-data",
      "X-FlowMSP-Source": "Web",
      "X-FlowMSP-Version": "2.40.0",
    }, // TODO: Replace with localStorage config or something
    config: request.config,
  });
}
