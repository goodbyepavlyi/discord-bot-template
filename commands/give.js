/*
	*IMPORTING NODE CLASSES
*/
const { SlashCommandBuilder } = require('@discordjs/builders');

/*
	*IMPORTING FILES
*/
const languages = require('../assets/languages.json');
const { add_balance, remove_balance, get_balance } = require('../classes/User');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Give mora to your friends.')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Select a user.')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('Enter amount of mora to transfer.')
				.setRequired(true)),

	name: 'give',
	description: 'Give mora to your friends.',
	usage: '/give <user> <amount>',

	cooldown: 10,
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
		let mentioned = interaction.options.getUser('user');
		let amount = interaction.options.getInteger('amount');

		if (!mentioned)
			return interaction.editReply({ content: languages[language].commands.give.no_user });
		if (user.id == mentioned.id)
			return interaction.editReply({ content: languages[language].commands.give.transfer_to_yourself });
		if (!amount)
			return interaction.editReply({ content: languages[language].commands.give.no_amount });

		let balance = await get_balance(user.id);	
		if (balance < amount)
			return interaction.editReply({ content: languages[language].commands.give.insufficient_balance });

		await remove_balance(user.id, amount);
		await add_balance(mentioned.id, amount);

		let content = languages[language].commands.give.success.replaceAll('%1', `**${config.bot.emojis.mora} ${amount}**`).replaceAll('%2', `**${mentioned.tag}**`);
		return interaction.editReply({ content });
	}
};
