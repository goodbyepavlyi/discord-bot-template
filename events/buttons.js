/*
    *IMPORTING FILES
*/
const reportError = require('../classes/Error.js');

module.exports = {
    name: 'interactionCreate',
    
    async execute(interaction) {
        if (!interaction.isButton()) return;
        let { client, guild, channel, user, member: guildMember, customId: id } = interaction;
        
        if (user.bot) return;

        let button = client.interactionButtons.find(button => button.id == id);
        if (!button) return;

        try {
            return await button.execute(interaction, client, user, guildMember, guild, channel);
        } catch (error) {
            let errorResult = await reportError(client, user, error, 'Button', id, guild);
            return interaction.reply(errorResult);
		}
    },
};