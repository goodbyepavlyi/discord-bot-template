/*
    *IMPORTING NODE CLASSES
*/
const fs = require('fs');
const util = require('util');
const dayjs = require('dayjs');

async function logToFile(directory) {
    if (!fs.existsSync(directory)) fs.mkdirSync(directory);

    let logStdout = process.stdout;

    console.log = function () {
        let file = `logs/${dayjs().format('DD-MM-YYYY')}_out.log`;
        let logFile = fs.createWriteStream(file, { flags: 'a' });

        logFile.write(`[${dayjs().format('HH:mm:ss')}] ${util.format.apply(null, arguments)} \n`);
        logStdout.write(`[${dayjs().format('HH:mm:ss')}] ${util.format.apply(null, arguments)} \n`);
    }

    console.apiLog = function () {
        let file = `logs/${dayjs().format('DD-MM-YYYY')}_api_out.log`;
        let logFile = fs.createWriteStream(file, { flags: 'a' });

        logFile.write(`[${dayjs().format('HH:mm:ss')}] ${util.format.apply(null, arguments)} \n`);
        logStdout.write(`[${dayjs().format('HH:mm:ss')}] [API] ${util.format.apply(null, arguments)} \n`);
    }

    console.error = function () {
        let file = `logs/${dayjs().format('DD-MM-YYYY')}_error.log`;
        let logFile = fs.createWriteStream(file, { flags: 'a' });

        logFile.write(`[${dayjs().format('HH:mm:ss')}] ${util.format.apply(null, arguments)} \n`);
        logStdout.write(`[${dayjs().format('HH:mm:ss')}] [Error] ${util.format.apply(null, arguments)} \n`);
    }
}

module.exports = logToFile;