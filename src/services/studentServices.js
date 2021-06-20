import { addObjectToFormData } from "../scripts";
import fetchData from "./utils";
import * as mime from "react-native-mime-types";

const URL = `student/`;

const bulkDeleteStudent = (token, userIds) => {
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

const bulkRegisterStudent = (token, file) => {
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

const deleteStudent = (token, studentId) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(`${URL}${studentId.toString()}/`, requestOptions);
};

const getStudentList = (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(URL, requestOptions);
};

const getStudentDetail = (token, studentId) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(`${URL}${studentId.toString()}/`, requestOptions);
};

const registerStudent = (token, data) => {
  let formData = new FormData();

  let user = {
    email: data.email,
    password: data.password,
    password2: data.password,
    first_name: data.firstName,
    last_name: data.lastName,
  };
  addObjectToFormData(user, "user", formData);
  formData.append("index", parseInt(data.index, 10));
  formData.append("cycle_degree", data.cycleDegree);
  formData.append("specialization", data.specialization);

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

const updateStudent = (token, studentId, data) => {
  let formData = new FormData();

  let user = {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
  };
  addObjectToFormData(user, "user", formData);
  formData.append("index", parseInt(data.index, 10));
  formData.append("cycle_degree", data.cycleDegree);
  formData.append("specialization", data.specialization);

  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: "Token " + token,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  };

  return fetchData(`${URL}${studentId.toString()}/`, requestOptions);
};

export {
  bulkDeleteStudent,
  bulkRegisterStudent,
  deleteStudent,
  getStudentList,
  getStudentDetail,
  registerStudent,
  updateStudent,
};
