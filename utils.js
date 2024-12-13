function checkIsString (str) {
    return typeof str === 'string';
}

function checkIsInteger (int) {
    return Number.isInteger(num) && num >= 0;
}

function checkIsNumber (num) {
    return typeof num === 'number';
}

module.exports = {
    checkIsString, checkIsNumber, checkIsInteger
}