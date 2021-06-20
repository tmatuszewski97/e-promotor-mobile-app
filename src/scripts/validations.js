const isPositiveNumber = (number) => {
  let numberStr = number.toString().trim();
  const regex = /^[1-9]\d*$/g;
  if (regex.test(numberStr) && numberStr.length >= 1) {
    return true;
  } else {
    return false;
  }
};

const isValidEmail = (email) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regex.test(email)) {
    return true;
  } else {
    return false;
  }
};

const isValidFirstOrLastName = (text) => {
  const regex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/i;
  if (regex.test(text) && text.trim().length >= 1) {
    return true;
  } else {
    return false;
  }
};

const isValidIndex = (index) => {
  let indexStr = index.toString().trim();
  const regex = /^[0-9]\d*$/g;
  if (regex.test(indexStr) && indexStr.length == 6) {
    return true;
  } else {
    return false;
  }
};

const isValidPassword = (password) => {
  // const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,15}$/;
  if (password.trim().length >= 5) {
    return true;
  } else {
    return false;
  }
};

const isValidSpecialization = (text) => {
  const regex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/i;
  if (regex.test(text) && text.trim().length >= 1) {
    return true;
  } else {
    return false;
  }
};

export {
  isPositiveNumber,
  isValidEmail,
  isValidFirstOrLastName,
  isValidIndex,
  isValidPassword,
  isValidSpecialization,
};
