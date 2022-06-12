/*
	*IMPORTING NODE CLASSES
*/
const { SlashCommandBuilder } = require('@discordjs/builders');

/*
	*IMPORTING FILES
*/
const config = require('../config.json');
const languages = require('../assets/languages.json');
const works = require('../assets/jsons/work.json');
const { set_timeout, get_timeout, add_balance } = require('../classes/User');
const { milliseconds } = require('../classes/Format');

let timeout = 1800000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('You can work on a job for a payout!'),

	name: 'work',
	description: 'You can work on a job for a payout!',
	usage: '/work',

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
		let user_timeout = await get_timeout(user.id, 'work');

		if (user_timeout && timeout - (Date.now() - user_timeout) > 0) {
			let time = milliseconds(timeout - (Date.now() - user_timeout));

			let content = languages[language].commands.work.already_worked.replaceAll('%1', time);
			return interaction.editReply({ content });
		}

		let amount = Math.floor(Math.random() * 120) + 1;
		let work = works[Math.floor(Math.random() * works.length)];
		await set_timeout(user.id, 'work');
		await add_balance(user.id, amount);

		let content = `${work} ${config.bot.emojis.mora}${amount} mora.`;
		return interaction.editReply({ content });
	}
};
