import fetchData from "./utils";

const getElectionsStatus = (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(`record/status/`, requestOptions);
};

const getRecordListForPromoter = (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(`promoter/record/`, requestOptions);
};

const getRecordListForStudent = (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(`student/record/`, requestOptions);
};

const getRecordSummary = (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(`record/summary/`, requestOptions);
};

const updateRecordForPromoter = (token, recordId, wasSelected) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: "Token " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      was_selected: wasSelected,
    }),
  };
  return fetchData(`promoter/record/${recordId.toString()}/`, requestOptions);
};

const updateRecordForStudent = (token, recordId) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: "Token " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      promoter: null,
    }),
  };
  return fetchData(`student/record/${recordId.toString()}/`, requestOptions);
};

const selectPromoterForRecord = (token, promoterId, recordId) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: "Token " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  return fetchData(
    `student/record/${recordId.toString()}/promoter/${promoterId}/`,
    requestOptions
  );
};

const sendRequestToPromoters = (token) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: "Token " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  return fetchData(`student/record/`, requestOptions);
};

const recordSummaryToCsv = (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(`record/summary/csv/`, requestOptions);
};

const revokeRecords = (token) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: "Token " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  return fetchData(`record/revoke/`, requestOptions);
};

export {
  getElectionsStatus,
  getRecordListForPromoter,
  getRecordListForStudent,
  getRecordSummary,
  updateRecordForPromoter,
  updateRecordForStudent,
  selectPromoterForRecord,
  sendRequestToPromoters,
  recordSummaryToCsv,
  revokeRecords,
};
