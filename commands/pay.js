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
const { addBalance, removeBalance, getBalance } = require('../classes/User');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pay')
		.setDescription('Pay coins to your friends.')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Select a user.')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('Enter amount of coins to transfer.')
				.setRequired(true)),

	cooldown: 10,
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
		let mentioned = interaction.options.getUser('user');
		let amount = interaction.options.getInteger('amount');

		if (user.id == mentioned.id) return interaction.editReply({ content: messages.COMMANDS_PAY_TRANSFER_TO_YOURSELF });

		let balance = await getBalance(user.id);	
		if (balance < amount) return interaction.editReply({ content: messages.COMMANDS_PAY_INSUFFICIENT_BALANCE });

		await removeBalance(user.id, amount);
		await addBalance(mentioned.id, amount);

		return interaction.editReply({ content: messages.COMMANDS_PAY_SUCCESS.replaceAll('{emoji}', config.bot.emojis.coins).replaceAll('{amount}', amount).replaceAll('{user}', mentioned.tag) });
	}
};
