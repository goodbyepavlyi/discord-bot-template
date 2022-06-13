/*
	*IMPORTING NODE CLASSES
*/
const { Client, CommandInteraction, User, GuildMember, Guild, Channel } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

/*
	*IMPORTING FILES
*/
const config = require('../config.json');
const messages = require('../assets/messages');
const { getBalance } = require('../classes/User');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Displays the balance of the user.')
		.addUserOption(option => 
			option.setName('user')
				.setDescription('Select a user.')),

	cooldown: 3,
	id: 'economy',

	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {User} user
	 * @param {GuildMember} guildMember
	 * @param {Guild} guild
	 * @param {Channel} channel
	*/
	async execute(client, interaction, user, guildMember, guild, channel) {
		let mentioned = interaction.options.getUser('user') || user;

		let balance = await getBalance(mentioned.id) || 0;

		let content = messages.COMMANDS_BALANCE_TEXT.replaceAll('{username}', mentioned.tag).replaceAll('{emoji}', config.bot.emojis.coins).replaceAll('{balance}', balance);
		return interaction.editReply({ content });
	}
};
