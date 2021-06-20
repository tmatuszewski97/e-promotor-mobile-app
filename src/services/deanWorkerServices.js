import fetchData from "./utils";

const URL = `dean-worker/`;

const getDeanWorkerList = (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(URL, requestOptions);
};

const getDeanWorkerDetail = (token, deanWorkerId) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: "Token " + token,
    },
  };
  return fetchData(`${URL}${deanWorkerId.toString()}/`, requestOptions);
};

export { getDeanWorkerList, getDeanWorkerDetail };
