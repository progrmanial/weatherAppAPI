const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data){
    let error = {};

    // convert empty fields to an empty string in order to use validator
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    // Registation Data Check
    if (Validator.isEmpty(data.email)) {
        error.email = "Email field cannot be empty";
    }else if(!Validator.isEmail(data.email)){
        error.email = "Email is not valid";
    }

    if (Validator.isEmpty(data.password)) {
        error.password = "Password field is reuqired";
    }

    return {
        error, isValid: isEmpty(error)
    };
};