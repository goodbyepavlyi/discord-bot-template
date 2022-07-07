const { CommandInteraction } = require('discord.js');
const reportError = require('../utils/errorReporting.js');
const { log } = require('../utils/logger.js');

module.exports = {
    name: 'interactionCreate',

    /**
     * @param {CommandInteraction} interaction
     */
    async run(interaction) {
        if (!interaction.isCommand()) return;

        const { client, user, commandName } = interaction;
        if (user.bot) return;

        const command = client.interactions.command.find(command => command.name == commandName);
        if (!command) return;

        try {
            log('User Action', `'${user.tag}' (${user.id}) executed command '${commandName}'`, `green`);
            return await command.runInteraction(interaction);
        } catch (error) {
            const errorEmbed = await reportError(client, user, error, 'Interaction Command', commandName);
            return interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
