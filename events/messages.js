/*
    *IMPORTING NODE CLASSES
*/
const { Permissions } = require('discord.js');

/*
    *IMPORTING FILES
*/
const messages = require('../assets/messages');
const reportError = require('../classes/Error.js');

module.exports = {
    name: 'messageCreate',

    async execute(message) {
        let { client, guild, channel, author: user, content } = message;

        if (!guild) return;
        if (user.bot) return;

        let mentioned = content.match(new RegExp(`^<@!?${client.user.id}>`));
        if (!mentioned) return;

        try {
            let canSendMessages = guild.me.permissionsIn(channel.id).has(Permissions.FLAGS.SEND_MESSAGES);
            if (!canSendMessages) return;

            let content = messages.PREFIX_REMINDER.replaceAll('{user}', `<@${user.id}>`).replaceAll('{prefix}', '/');
            return message.reply({ content });
        } catch (error) {
            let errorResult = await reportError(client, user, error, 'Message Create', '@froggie', guild);
            return message.reply(errorResult);
		}
    },
};