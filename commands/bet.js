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
const { getBalance, addBalance, removeBalance } = require('../classes/User');

let coinsRequired = 750;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bet')
		.setDescription('Roll your dice against BOTNAME, if you get higher than the bot you\'ll win!')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('Enter amount of coins to bet.')
				.setRequired(true)),

	cooldown: 5,
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
		let amount = interaction.options.getInteger('amount');

		let balance = await getBalance(user.id);
		if (amount < coinsRequired) return interaction.editReply({ content: messages.COMMANDS_BET_AMOUNT_LESS_THAN_REQUIRED.replaceAll('{emoji}', config.bot.emojis.coins).replaceAll('{coinsRequired}', coinsRequired) });
		if (balance < amount) return interaction.editReply({ content: messages.COMMANDS_BET_BALANCE_LESS_THAN_AMOUNT });

		let usersChance = Math.round((695 / amount) + (695 / Math.sqrt(amount)) * 50) / 50 + 3;
		let chance = Math.random() * 50;
		let won = chance < usersChance;

		if (won) {
			amount = amount - Math.floor(Math.random() * (100 - 50 + 1) + 50);
			await addBalance(user.id, amount);
		} else await removeBalance(user.id, amount);

		let content = messages.COMMANDS_BET_SUCCESS
			.replaceAll('{result}', won ? 'won' : 'lost')
			.replaceAll('{emoji}', config.bot.emojis.coins)
			.replaceAll('{amount}', amount)
			.replaceAll('{chance}', Math.round(usersChance * 100) / 100);
		return interaction.editReply({ content });
	}
};
