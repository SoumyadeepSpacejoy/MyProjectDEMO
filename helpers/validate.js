'use strict';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\d{10}$/;
const validateEmail = (email) => {
    return emailPattern.test(email) ? true : false;
};

const validateNumber = (number) => {
    return phonePattern.test(number) ? true : false;
};

module.exports = {
    validateEmail,
    validateNumber,
};
