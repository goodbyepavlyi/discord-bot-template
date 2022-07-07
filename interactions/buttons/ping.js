const { ButtonInteraction } = require(`discord.js`);
const { PING } = require(`../../assets/messages.js`);

module.exports = {
    type: `button`,
    id: `ping`,

    /**
     * @param {ButtonInteraction} interaction 
     */
	async run(interaction) {
        const content = PING;
		return interaction.reply(content)
	}
};