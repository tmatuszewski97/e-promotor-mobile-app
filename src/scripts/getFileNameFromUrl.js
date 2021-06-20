const getFileNameFromUrl = (url) => {
  const filename = url.split("/").pop();
  return filename.toString();
};

export default getFileNameFromUrl;
