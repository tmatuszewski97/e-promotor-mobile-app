import fetchData from "./utils";

const URL = `login/`;

const login = (email, password) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: email,
      password: password,
    }),
  };
  return fetchData(URL, requestOptions);
};

export { login };
