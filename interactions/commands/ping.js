const { AutocompleteInteraction, CommandInteraction, Message, MessageActionRow, MessageButton } = require(`discord.js`);
const { PING } = require(`../../assets/messages.js`);

module.exports = {
    type: `command`,
    name: `ping`,
    description: `Pong!`,
    options: [],

    /**
     * @param {AutocompleteInteraction} interaction 
     */
    async autocomplete(interaction) {
        const choices = [];
        return choices;
    },

    /**
     * @param {CommandInteraction} interaction 
     */
    async runInteraction(interaction) {
        const response = await this.run();
        return interaction.reply(response);
    },
    
    /**
     * @param {Message} message 
     */
    async runMessage(message) {
        const response = await this.run();
        return message.reply(response);
    },

	async run() {
        const content = PING;
        const pingButton = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('ping')
                .setLabel('Ping')
                .setEmoji('🏓')
                .setStyle('PRIMARY'),
        );

		return { content, components: [pingButton] };
	}
};