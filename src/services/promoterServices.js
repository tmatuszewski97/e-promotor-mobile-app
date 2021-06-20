import fetchData from "./utils";
import { addObjectToFormData, getFileNameFromUrl } from "../scripts";
import * as mime from "react-native-mime-types";

const URL = `promoter/`;

const bulkDeletePromoter = (token, userIds) => {
  let data = [];
  userIds.map((id) => {
    const obj = {
      id: id,
    };
    data.push(obj);
  });
  data = JSON.stringify(data);

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: "Token " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: data,
  };
  return fetchData(`${URL}bulk-delete/`, requestOptions);
};

const bulkRegisterPromoter = (token, file) => {
  let formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    name: file.name,
    type: mime.lookup(file.name),
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: "Token " + token,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  };
  return fetchData(`${URL}bulk-register/`, requestOptions);
};

const deletePromoter = (token, promoterId) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(`${URL}${promoterId.toString()}/`, requestOptions);
};

const getPromoterList = (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(URL, requestOptions);
};

const getPromoterListForRecord = (token, recordId) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(
    `student/record/${recordId.toString()}/promoter/`,
    requestOptions
  );
};

const getPromoterDetail = (token, promoterId) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(`${URL}${promoterId.toString()}/`, requestOptions);
};

const getPromoterDetailForRecord = (token, promoterId, recordId) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(
    `student/record/${recordId.toString()}/promoter/${promoterId.toString()}/`,
    requestOptions
  );
};

const registerPromoter = (token, data) => {
  let formData = new FormData();

  let user = {
    email: data.email,
    password: data.password,
    password2: data.password,
    first_name: data.firstName,
    last_name: data.lastName,
  };
  addObjectToFormData(user, "user", formData);
  formData.append("title", data.title);
  formData.append("max_students_number", parseInt(data.maxStudentsNumber, 10));

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: "Token " + token,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  };

  return fetchData(`${URL}register/`, requestOptions);
};

const updatePromoter = (token, promoterId, data) => {
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
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
  };
  addObjectToFormData(user, "user", formData);
  formData.append("title", data.title);
  formData.append("proposed_topics", data.proposedTopics);
  formData.append("unwanted_topics", data.unwantedTopics);
  formData.append("interests", data.interests);
  formData.append("contact", data.contact);
  formData.append("max_students_number", parseInt(data.maxStudentsNumber, 10));

  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: "Token " + token,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  };

  return fetchData(`${URL}${promoterId.toString()}/`, requestOptions);
};

export {
  bulkDeletePromoter,
  bulkRegisterPromoter,
  deletePromoter,
  getPromoterList,
  getPromoterListForRecord,
  getPromoterDetail,
  getPromoterDetailForRecord,
  registerPromoter,
  updatePromoter,
};
