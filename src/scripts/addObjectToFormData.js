const addObjectToFormData = (object, objectName, formData) => {
  for (let key in object) {
    formData.append(`${objectName.toString()}.${key}`, object[key]);
  }
  return formData;
};

export default addObjectToFormData;
