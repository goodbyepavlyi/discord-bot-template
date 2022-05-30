/*
    *IMPORTING CLASSES
*/
const { MessageEmbed, Client, User, Guild } = require('discord.js');

/*
    *IMPORTING FILES
*/
const config = require('../config.json');
const messages = require('../assets/messages');
const { getColor } = require('../classes/Embed');

/**
 * @param {Client} client 
 * @param {User} user 
 * @param {string} action 
 * @param {string} actionName
 * @param {Guild} guild 
 * @param {boolean} reportError 
 * @returns 
 */
async function createErrorEmbed(client, user, error, action, actionName, guild, reportError = true) {
    let errorId = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);

    let embed = new MessageEmbed()
        .setColor(getColor('accent'))
        .setTitle(messages.ERROR_TITLE)
        .setDescription(messages.ERROR_DESCRIPTION)
        .addField('ID', `#${errorId}`);

    console.error(error);

    if (reportError) await report(client, error, errorId, action, actionName, user, guild);
    return { embeds: [embed] };
}

/**
 * @param {Client} client 
 * @param {number} errorId 
 * @param {string} action 
 * @param {string} actionName 
 * @param {User} user 
 * @param {Guild} guild 
 */
async function report(client, error, errorId, action, actionName, user, guild) {
    let embed = new MessageEmbed()
        .setColor(getColor('accent'))
        .setAuthor({
            name: user.tag,
            iconURL: user.displayAvatarURL()
        })
        .addField('ID', `#${errorId}`)
        .addField('Action', action, true)
        .addField('Name', actionName, true)
        .addField('Executor', `${user.tag} \`${user.id}\``)
        .addField('Server', `${guild.name} \`${guild.id}\``)
        .setThumbnail(guild.iconURL({ dynamic: true, format: 'png', size: 512 }))
        .setTimestamp()
        .setDescription(error.stack.length >= 4096 ? `\`\`\`${error}\`\`\`` : `\`\`\`${error.stack}\`\`\``);

    let server = await client.guilds.fetch(config.bot.support_server.id);
    let channel = await server.channels.fetch(config.bot.support_server.channels.bot_errors);

    return await channel.send({ embeds: [embed] });
}   

module.exports = createErrorEmbed;