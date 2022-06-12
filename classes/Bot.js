/*
    *IMPORTING NODE CLASSES
*/
const { Snowflake } = require('discord.js');
const fetch = require('cross-fetch');

/**
 * @param {Snowflake} id 
 */
function getIdFromString(id) {
    if (!id) return;

    let userId = id.replace(/\D/g, '');
    return userId;
}

/**
 * @param {string} url 
 */
async function request(url) {
    try {
        if (!url) return;

        let request = await fetch(url);
        let response = await request.json().catch(() => { return {} });

        return response;
    } catch(error) {
        throw Error(error);
    }
}

module.exports = {
    getIdFromString,
    request
}