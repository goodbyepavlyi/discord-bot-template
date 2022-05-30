/*
    *IMPORTING NODE CLASSES
*/
const fetch = require('cross-fetch')

function getIdFromString(id) {
    if (!id) return

    let userId = id.replace(/\D/g, '')
    return userId
}

async function request(url) {
    try {
        if (!url) return

        let request = await fetch(url)
        let response = await request.json().catch(() => { return {} })

        return response;
    } catch(error) {
        throw Error(error);
    }
}

module.exports = {
    getIdFromString,
    request
}