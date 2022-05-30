/*
    *IMPORTING NODE CLASSES
*/
const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton, Collection } = require('discord.js');

/*
    *IMPORTING FILES
*/
const config = require('../config.json');
const messages = require('../assets/messages');
const { hasAgreedToRules } = require('../classes/User');
const reportError = require('../classes/Error');
const { getColor } = require('../classes/Embed');

module.exports = {
    name: 'interactionCreate',

    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        let { client, guild, channel, user, member: guildMember, commandName } = interaction;
        if (user.bot) return;

        let command = client.commands.find(command => command.data.name.toLowerCase() == commandName.toLowerCase());
        if (!command) return;

        let { cooldown: commandCooldown, botPermissions, userPermissions } = command;

        let isCommandEphemeral = command.ephemeral || false;
        await interaction.deferReply({ ephemeral: isCommandEphemeral });
        
        /*
            *COMMAND IN DMS
        */
        if (!guild) {
            let embed = new MessageEmbed()
                .setColor(getColor('accent'))
                .setImage(config.bot.embed.images.froggie_background_zoomed)
                .setTitle(messages.DMS_NOT_ALLOWED_TITLE)
                .setDescription(messages.DMS_NOT_ALLOWED_DESCRIPTION);

            return interaction.editReply({ embeds: [embed]});
        }
        
        try {
            /*
                *RULES AGREEING
            */
            let didUserAgreeToRules = await hasAgreedToRules(user.id);
            if (!didUserAgreeToRules) {
                let embed = new MessageEmbed()
                    .setColor(getColor('accent'))
                    .setAuthor({
                        name: messages.BOT_RULES_AUTHOR_NAME,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setImage(config.bot.embed.images.froggie_background_zoomed)
                    .setTitle(messages.BOT_RULES_TITLE)
                    .setDescription(messages.BOT_RULES_DESCRIPTION.replaceAll('{supportServerLink}', config.bot.support_server.invite));

                let buttons = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId('accept_rules')
                        .setLabel(messages.BOT_RULES_ACCEPT_BUTTON)
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setURL(config.bot.links.privacypolicy)
                        .setLabel(messages.BOT_RULES_PRIVACY_BUTTON)
                        .setStyle('LINK'));

                return interaction.editReply({ embeds: [embed], components: [buttons] });
            }

            /*
                *COOLDOWNS
            */
            if (!client.cooldowns.has(commandName)) client.cooldowns.set(commandName, new Collection());

            let timeNow = Date.now();
            let timestamps = client.cooldowns.get(commandName);
            let cooldownAmount = (commandCooldown || 3) * 1000;

            if (timestamps.has(user.id)) {
                let expirationTime = timestamps.get(user.id) + cooldownAmount;
                if (timeNow < expirationTime) {
                    let timeLeft = ((expirationTime - timeNow) / 1000).toFixed(1);
                    
                    let embed = new MessageEmbed()
                        .setColor(getColor('accent'))
                        .setTitle(messages.COOLDOWN_TITLE)
                        .setDescription(messages.COOLDOWN_DESCRIPTION.replaceAll('{time}', timeLeft));

                    return interaction.editReply({ embeds: [embed] });
                }
            }
            
            timestamps.set(user.id, timeNow);
            setTimeout(() => timestamps.delete(user.id), cooldownAmount);
            
            /*
                *BOT PERMISSION CHECKING
            */
            let botsPermissionsInGuild = guild.me.permissions;
            if (botPermissions && !botsPermissionsInGuild.has(botPermissions)) {
                let embed = new MessageEmbed()
                    .setColor(getColor('accent'))
                    .setTitle(messages.PERMISSIONS_TITLE)
                    .setDescription(messages.PERMISSIONS_DESCRIPTION_BOT.replaceAll('{permission}', botPermissions));

                return interaction.editReply({ embeds: [embed] });
            }

            /*
                *USER PERMISSION CHECKING
            */
            let usersPermissionsInGuild = guildMember.permissions;
            if (userPermissions && !usersPermissionsInGuild.has(userPermissions)) {
                let embed = new MessageEmbed()
                    .setColor(getColor("accent"))
                    .setTitle(messages.PERMISSIONS_TITLE)
                    .setDescription(messages.PERMISSIONS_DESCRIPTION_USER.replaceAll('{permission}', userPermissions));

                return interaction.editReply({ embeds: [embed] });
            }

            /*
                *COMMAND EXECUTION
            */
            console.log(`[User Action] '${user.tag}' (${user.id}) used command '${commandName}' in '${guild.name}' (${guild.id})`);
            return await command.execute(client, interaction, user, guildMember, guild, channel);
        } catch (error) {
            let errorResult = await reportError(client, user, error, 'Command', commandName, guild);
            return interaction.editReply(errorResult);
		}
    },
};