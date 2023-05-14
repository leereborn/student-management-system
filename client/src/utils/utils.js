import moment from "moment";

export function isValidEmail(email) {
  // Email validation regex
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function getAgeFromBirthday(dateString) {
  const today = moment();
  const birthdate = moment(dateString, "YYYY-MM-DD");
  return today.diff(birthdate, "years");
}
