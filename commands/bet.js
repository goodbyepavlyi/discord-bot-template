/*
	*IMPORTING NODE CLASSES
*/
const { SlashCommandBuilder } = require('@discordjs/builders');

/*
	*IMPORTING FILES
*/
const config = require('../config.json');
const languages = require('../assets/languages.json');
const { get_balance, add_balance, remove_balance } = require('../classes/User');

let moraRequired = 750;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bet')
		.setDescription('Roll your dice against Yae Miko, if you get higher than the bot you\'ll win!')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('Enter amount of mora to bet.')
				.setRequired(true)),

	name: 'bet',
	description: 'Roll your dice against Yae Miko, if you get higher than the bot you\'ll win!',
	usage: '/bet <amount>',

	cooldown: 5,
	id: 'economy',

	/**
	 * @param {Client} client
	 * @param {Interaction} interaction
	 * @param {User} user
	 * @param {GuildMember} guildMember
	 * @param {Guild} guild
	 * @param {TextChannel} channel
	 * @param {String} language
	*/
	async execute(client, interaction, user, guildMember, guild, channel, language) {
		//? Getting the argument
		let amount = interaction.options.getInteger('amount');

		if (!amount)
			return interaction.editReply({ content: languages[language].commands.bet.amount_not_found });

		let balance = await get_balance(user.id);
		if (amount < moraRequired)
			return interaction.editReply({ content: languages[language].commands.bet.amount_less_than_required.replaceAll('%1', `${config.bot.emojis.mora} ${moraRequired}`) });
		if (balance < amount)
			return interaction.editReply({ content: languages[language].commands.bet.balance_less_than_amount });

		let chances = Math.round((695 / amount) + (695 / Math.sqrt(amount)) * 50) / 50 + 3;
		let randomNum = Math.random() * 50;
		let userWon = randomNum < chances;

		if (userWon) {
			amount = amount - Math.floor(Math.random() * (100 - 50 + 1) + 50);
			await add_balance(user.id, amount);
		} else await remove_balance(user.id, amount);

		let content = languages[language].commands.bet.success
			.replaceAll('%1', userWon ? 'won' : 'lost')
			.replaceAll('%2', `${config.bot.emojis.mora} ${amount}`)
			.replaceAll('%3', Math.round(chances * 100) / 100);
		return interaction.editReply({ content });
	}
};
