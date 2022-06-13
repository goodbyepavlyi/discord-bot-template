/*
	*IMPORTING NODE CLASSES
*/
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, Client, Interaction, User, GuildMember, Guild, Channel } = require('discord.js');

/*
	*IMPORTING FILES
*/
const config = require('../config.json');
const messages = require('../assets/messages');
const { getColor } = require('../classes/Embed');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('I know you know how to use this command, so why are you looking at it?'),

	cooldown: 1,
	ephemeral: true,
	id: 'information',

	/**
	 * @param {Client} client
	 * @param {Interaction} interaction
	 * @param {User} user
	 * @param {GuildMember} guildMember
	 * @param {Guild} guild
	 * @param {Channel} channel
	*/
	async execute(client, interaction, user, guildMember, guild, channel) {
		let botCommands = client.commands.reduce((commands, { data, id }) => {
			let { name, options } = data.toJSON();
			let subcommands = options.map(option => {
				if (option.type != 1) return;

				return option.name;
			})

			subcommands.map(subcommand => {
				if (!subcommand) return
				return (commands[id] ??= []).push(`${name} ${subcommand}`);
			});

			(commands[id] ??= []).push(name);

			return commands;
		}, {});

		let embed = new MessageEmbed()
			.setColor(getColor('accent'))
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({
				text: messages.COMMANDS_HELP_FOOTER.replaceAll('{usage}', this.usage).replaceAll('{commandCount}', client.commands.size)
			})
			.setTitle(messages.COMMANDS_HELP_TITLE);

		for (const [category, commands] of Object.entries(botCommands)) embed.addField(config.bot.commands[category], commands.map((command, index) => `\`${command}\`${index != (commands.length-1) ? ', ' : ''}`).join(''));

		let buttons = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel(messages.COMMANDS_HELP_LINKS_WEBSITE)
					.setURL(config.bot.links.website)
					.setStyle('LINK'),
				new MessageButton()
					.setLabel(messages.COMMANDS_HELP_LINKS_SUPPORT)
					.setURL(config.bot.support_server.invite)
					.setStyle('LINK'),
				new MessageButton()
					.setLabel(messages.COMMANDS_HELP_LINKS_INVITE)
					.setURL(config.bot.links.invite)
					.setStyle('LINK'),
				new MessageButton()
					.setLabel(messages.COMMANDS_HELP_LINKS_VOTE)
					.setURL(config.bot.links.vote)
					.setStyle('LINK'));

		return interaction.editReply({ embeds: [embed], components: [buttons] });
	}
};