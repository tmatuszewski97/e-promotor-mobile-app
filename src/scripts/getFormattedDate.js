const getFormattedDate = (date_input) => {
  let array = date_input.split(" ");
  let date = array[0];
  let time = array[array.length - 1];
  let time_array = time.split(":");
  const hour = time_array[0];
  const minutes = time_array[1];
  return date.toString() + ` o ` + hour + `:` + minutes;
};

export default getFormattedDate;
