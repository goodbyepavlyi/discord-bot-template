/*
    *IMPORTING FILES
*/
const config = require('../../config.json');

function auth(req, res, next) {
    let token = config.server.token;
    let providedToken = req.headers.authorization;

    if (token != providedToken) return res.json({
        status: 403,
        error: true,
        message: 'The communication token you provided does not match!'
    });

    next();
}

module.exports = auth;