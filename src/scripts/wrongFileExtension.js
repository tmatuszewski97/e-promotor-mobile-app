const wrongFileExtension = (file, expectedExtension) => {
  if (
    file &&
    file.name &&
    file.name.toString().split(".").pop() === expectedExtension
  ) {
    return false;
  } else {
    return true;
  }
};

export default wrongFileExtension;
