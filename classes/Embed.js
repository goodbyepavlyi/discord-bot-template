/*
    *IMPORTING FILES
*/
const config = require('../config.json');

/**
 * @param {string} colorType
 * @returns {string} The HEX Color
 */
function getColor(colorType) {
    return config.bot.embed.colors[colorType] || config.bot.embed.colors.accent
}

module.exports = {
    getColor
}