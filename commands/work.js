/*
	*IMPORTING NODE CLASSES
*/
const { SlashCommandBuilder } = require('@discordjs/builders');

/*
	*IMPORTING FILES
*/
const config = require('../config.json');
const messages = require('../assets/messages');
const works = require('../assets/work.json');
const { setTimeout, getTimeout, addBalance } = require('../classes/User');
const { milliseconds } = require('../classes/Format');

let timeout = 1800000;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('You can work on a job for a payout!'),

	cooldown: 5,
	id: 'economy',

	/**
	 * @param {Client} client
	 * @param {Interaction} interaction
	 * @param {User} user
	 * @param {GuildMember} guildMember
	 * @param {Guild} guild
	 * @param {TextChannel} channel
	*/
	async execute(client, interaction, user, guildMember, guild, channel) {
		let userTimeout = await getTimeout(user.id, 'work');

		if (userTimeout && timeout - (Date.now() - userTimeout) > 0) {
			let time = milliseconds(timeout - (Date.now() - userTimeout));

			let content = messages.COMMANDS_WORK_ALREADY_WORKED.replaceAll('{time}', time);
			return interaction.editReply({ content });
		}

		let reward = Math.floor(Math.random() * (150 - 100 + 1) + 100);
		let work = works[Math.floor(Math.random() * works.length)];
		await setTimeout(user.id, 'work', Date.now());
		await addBalance(user.id, reward);

		return interaction.editReply({ content: messages.COMMANDS_WORK_SUCCESS.replaceAll('{work}', work).replaceAll('{emoji}', config.bot.emojis.coins).replaceAll('{reward}', reward) });
	}
};
