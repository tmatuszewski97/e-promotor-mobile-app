import fetchData from "./utils";
import { addObjectToFormData, getFileNameFromUrl } from "../scripts";
import * as mime from "react-native-mime-types";

const URL = `user/`;

const changePassword = (token, data) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: "Token " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      old_password: data.oldPassword,
      password: data.newPassword,
      password2: data.newPassword2,
    }),
  };
  return fetchData(`${URL}change-password/`, requestOptions);
};

const getUserDetail = (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(URL, requestOptions);
};

const updateDeanWorkerUser = (token, data) => {
  let formData = new FormData();

  let user = {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
  };

  addObjectToFormData(user, "user", formData);
  formData.append("contact", data.contact);

  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: "Token " + token,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  };

  return fetchData(URL, requestOptions);
};

const updatePromoterUser = (token, data) => {
  let formData = new FormData();

  if (data.image != null) {
    let localUri = data.image;
    let imageName = getFileNameFromUrl(localUri);
    let type = mime.lookup(imageName);

    formData.append("image", {
      uri: localUri,
      name: imageName,
      type: type,
    });
  } else {
    formData.append("image", "");
  }

  let user = {
    first_name: data.firstName,
    last_name: data.lastName,
  };
  addObjectToFormData(user, "user", formData);
  formData.append("title", data.title);
  formData.append("proposed_topics", data.proposedTopics);
  formData.append("unwanted_topics", data.unwantedTopics);
  formData.append("interests", data.interests);
  formData.append("contact", data.contact);

  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: "Token " + token,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  };

  return fetchData(URL, requestOptions);
};

export {
  changePassword,
  getUserDetail,
  updateDeanWorkerUser,
  updatePromoterUser,
};
