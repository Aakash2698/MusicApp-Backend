const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateSignUp(data) {
  let errors = {};
  console.log("==>", data);

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.gender = !isEmpty(data.gender) ? data.gender : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : "";

  if (Validator.isEmpty(data.firstName)) {
    errors.Error = "First Name field is required";
  }
  if (Validator.isEmpty(data.lastName)) {
    errors.Error = "Last Name field is required";
  }
  if (Validator.isEmpty(data.gender)) {
    errors.Error = "Select one gender field";
  }

  if (Validator.isEmpty(data.email)) {
    errors.Error = "Email is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.Error = "Email is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errors.Error = "Password is required";
  }
  if (!Validator.isLength(data.password, { min: 5, max: 30 })) {
    errors.Error = "Password must be atleast 5 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
