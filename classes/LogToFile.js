/*
    *IMPORTING NODE CLASSES
*/
const fs = require('fs');
const util = require('util');
const colors = require('colors');
const dayjs = require('dayjs');

async function logToFile(directory) {
    if (!fs.existsSync(directory)) fs.mkdirSync(directory);

    let stdout = process.stdout;

    console.log = function (type, message) {
        const fileName = `logs/${dayjs().format('DD-MM-YYYY')}_out.log`;
        const file = fs.createWriteStream(fileName, { flags: 'a' });
        const time = dayjs().format('HH:mm:ss');

        file.write(`${time} ${type || 'None'} ${message} \n`);
        stdout.write(`${time.bgGray.brightWhite} ${type.bgMagenta || 'None'.bgMagenta} ${message} \n`);
    }

    console.error = function () {
        const fileName = `logs/${dayjs().format('DD-MM-YYYY')}_error.log`;
        const file = fs.createWriteStream(fileName, { flags: 'a' });
        const time = dayjs().format('HH:mm:ss');

        file.write(`${time} Error ${util.format.apply(null, arguments)} \n`);
        stdout.write(`${time.bgBrightRed.brightWhite} ${'Error'.bgRed} ${util.format.apply(null, arguments)} \n`);
    }
}

module.exports = logToFile;