const reportError = require('../utils/errorReporting.js');
const { log } = require('../utils/logger.js');

module.exports = {
    name: 'interactionCreate',
    
    async run(interaction) {
        if (!interaction.isButton()) return;
        const { client, user, customId: id } = interaction;
        
        if (user.bot) return;

        const button = client.interactions.button.find(button => button.id == id);
        if (!button) return;

        try {
            log('User Action', `'${user.tag}' (${user.id}) used button '${id}'`, `green`);
            await button.run(interaction);
        } catch (error) {
            const errorEmbed = await reportError(client, user, error, 'Button Interaction', id);
            return message.reply({ embeds: [errorEmbed] });
		}
    },
};