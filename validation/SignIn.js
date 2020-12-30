const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = validateLoginInput = (data) => {
  let errors = {};
  // Convert empty fileds to empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email)) {
    errors.Error = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.Error = "Email is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errors.Error = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
