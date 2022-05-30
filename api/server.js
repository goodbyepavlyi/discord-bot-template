/*
    *IMPORTING NODE CLASSES
*/
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const useragent = require('express-useragent');
const { Client } = require('discord.js');

/*
    *INITIALIZING WEB SERVER
*/
const app = express();
app.use(cors());
app.use(useragent.express());

/*
    *REGISTERING ROUTES
*/
let routes = fs.readdirSync('./api/routes').filter(file => file.endsWith('.js'));
for (let routeName of routes) {
    let route = require(`./routes/${routeName}`);

    app.use('/', route);
};

/*
    *ROUTE FOR 404'S
*/
app.get('/*', (req, res) => res.send({
    status: 404,
    error: true,
    message: 'You have entered an invalid route!'
}));
    
/*
    *ROUTE FOR LOGGING
*/
app.use((req, res, next) => {
    let { headers, ip: remoteIp, _remoteAddress, httpVersionMajor, httpVersionMinor, method, originalUrl, url: link } = req;
    let { statusCode } = res;

    let ip = headers['x-forwarded-for'] || remoteIp || _remoteAddress || '-';
    let useragent = headers['user-agent'] || '-';
    let httpVersion = `${httpVersionMajor}.${httpVersionMinor}` || '-';
    let referrer = headers.referer || headers.referrer || '-';
    let date = new Date().toUTCString() || '-';
    let url = originalUrl || link || '-';

    console.apiLog(`${ip} - [${date}] "${method} ${url} HTTP/${httpVersion}" ${statusCode} "${referrer}" "${useragent}"`);
    next();
});

/**
 * @param {string} port 
 * @param {Client} client 
 */
function launch(port) {
    app.listen(port, () => {
        console.apiLog(`Listening on port ${port}!`);
    });
}

module.exports = {
    launch
}