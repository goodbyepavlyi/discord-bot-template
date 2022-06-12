/*
	*IMPORTING NODE CLASSES
*/
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, CommandInteraction, User, GuildMember, Guild, Channel } = require('discord.js');

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

	name: 'balance',
	description: 'Displays the balance of the user.',
	usage: '/balance [user]',

	cooldown: 3,
	id: 'economy',

	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {User} user
	 * @param {GuildMember} guildMember
	 * @param {Guild} guild
	 * @param {Channel} channel
	 * @param {String} language
	*/
	async execute(client, interaction, user, guildMember, guild, channel, language) {
		let mentioned = interaction.options.getUser('user') || user;
		if (!mentioned) return interaction.editReply({ content: messages.commands_balance_target_not_found });

		let balance = await getBalance(mentioned.id) || 0;

		let content = messages.commands_balance_text.replaceAll('%{user}', mentioned.tag).replaceAll('%{balance}', balance);
		return interaction.editReply({ content });
	}
};
