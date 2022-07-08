const { AutocompleteInteraction } = require('discord.js');

module.exports = {
    name: 'interactionCreate',

    /**
     * @param {AutocompleteInteraction} interaction
     */
    async run(interaction) {
        if (!interaction.isAutocomplete()) return;

        const { client, commandName } = interaction;

        const command = client.interactions.command.get(commandName);
        if (!command) return;

        const choices = await command.autocomplete(interaction);
        const focusedValue = interaction.options.getFocused();
		const filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedValue.toLowerCase()));
        if (filtered.length > 25) filtered.splice(25);

		return await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
    },
};
