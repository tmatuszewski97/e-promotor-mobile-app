import fetchData from "./utils";
import * as mime from "react-native-mime-types";

const URL = `file/`;

const createFile = (token, file, sharedFor) => {
  let formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    name: file.name,
    type: mime.lookup(file.name),
  });
  formData.append("shared_for", sharedFor);

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: "Token " + token,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  };
  return fetchData(`${URL}add/`, requestOptions);
};

const deleteFile = (token, fileId) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(`${URL}${fileId.toString()}/`, requestOptions);
};

const getFileDetail = (token, fileId) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(`${URL}${fileId.toString()}/`, requestOptions);
};

const getFileList = (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(URL, requestOptions);
};

const updateFile = (token, fileId, sharedFor) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: "Token " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shared_for: sharedFor,
    }),
  };
  return fetchData(`${URL}${fileId.toString()}/`, requestOptions);
};

export { createFile, deleteFile, getFileDetail, getFileList, updateFile };
