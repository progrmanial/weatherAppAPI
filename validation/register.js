const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data){
    let error = {};

    // convert empty fields to an empty string in order to use validator
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    // Registation Data Check
    if (Validator.isEmpty(data.name)) {
        error.name = "Name field is required";
    }

    if (Validator.isEmpty(data.email)) {
        error.email = "Email field cannot be empty";
    }else if(!Validator.isEmail(data.email)){
        error.email = "Email is not valid";
    }

    if (Validator.isEmpty(data.password)) {
        error.password = "Password field is reuqired";
    }

    if (Validator.isEmpty(data.password2)) {
        error.password2 = "Confirm Password field is reuqired";
    }

    if (!Validator.isLength(data.password, {min: 6, max: 30})) {
        error.password = "Password must be at least 6 characters";
    }

    if (!Validator.equals(data.password, data.password2)) {
        error.password2 = "Passwords must match";
    }

    return {
        error, isValid: isEmpty(error)
    };
};