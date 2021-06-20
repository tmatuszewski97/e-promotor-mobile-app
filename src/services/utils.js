import API_URL from "./api_url";

const fetchData = (url, requestOptions) => {
  return fetch(API_URL + url, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Request couldn't be processed`);
      }
      return (
        response
          .json()
          .then((json) => {
            return json;
          })
          //Catch block for situation when response isn't able to parse into json
          .catch((error) => {
            return response;
          })
      );
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export default fetchData;
