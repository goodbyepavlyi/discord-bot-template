/*
    *IMPORTING NODE CLASSES
*/
const ms = require('ms');
const formatMilliseconds = require('pretty-ms');
const formatSeconds = require('pretty-seconds');

function milliseconds(duration) {
    if (!duration) return;
    return formatMilliseconds(duration, { verbose: true, secondsDecimalDigits: 0})
}

function seconds(duration) {
    if (!duration) return;
    return formatSeconds(duration);
}

function stringToUnix(duration) {
    if (!duration) return;
    return ms(duration);
}

function bytesToMegabytes(bytes) {
    if (!bytes) return;
    if (bytes === 0) return '0MB';
    
    return `${(bytes / (1024 * 1024)).toFixed(0)}MB`
}

function numberToShort(number) {
    if (!number) return;
    if(number > 999 && number < 1000000) return (number/1000).toFixed(0) + 'K';
    if(number > 1000000) return (number/1000000).toFixed(0) + 'M';
    
    return number;
}

module.exports = {
    milliseconds,
    seconds,
    stringToUnix,
    bytesToMegabytes,
    numberToShort
};
