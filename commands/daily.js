/*
	*IMPORTING NODE CLASSES
*/
const { SlashCommandBuilder } = require('@discordjs/builders');

/*
	*IMPORTING FILES
*/
const config = require('../config.json');
const languages = require('../assets/languages.json');
const { get_balance, get_timeout, add_balance, set_timeout } = require('../classes/User');
const { milliseconds } = require('../classes/Format');

let timeout = 86400000;
let reward = 250;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Get daily mora.'),

	name: 'daily',
	description: 'Get daily mora.',
	usage: '/daily',

	cooldown: 3,
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
		let user_timeout = await get_timeout(user.id, 'reward_daily');

		if (user_timeout && timeout - (Date.now() - user_timeout) > 0) {
			let time = milliseconds(timeout - (Date.now() - user_timeout));

			let content = languages[language].commands.daily.already_claimed.replaceAll('%1', time);
			return interaction.editReply({ content });
		}

		await set_timeout(user.id, 'reward_daily');
		await add_balance(user.id, reward);

		let balance = await get_balance(user.id);
		let content = languages[language].commands.daily.claimed.replaceAll('%1', `${config.bot.emojis.mora}${reward}`).replaceAll('%2', `${config.bot.emojis.mora}${balance}`);
		return interaction.editReply({ content });
	}
};
