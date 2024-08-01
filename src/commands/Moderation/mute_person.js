const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poopybutthole')
        .setDescription('Mutes a person')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('User to mute')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        // Check for the required permissions
        if (interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return await interaction.reply('You do not have permission to use this command.');
        }

        // Get the user to mute
        const user = interaction.options.getUser('user');
        const specifiedUser = await interaction.guild.members.fetch(user.id);

        // Check if the bot has permission to mute

        // Perform the mute operation
        try {
            // Mute the user by disabling their communication
            await specifiedUser.timeout(60 * 60 * 1000, 'Muted by command'); // 1 hour timeout
            await interaction.reply(`${specifiedUser.user.tag} has been poopied.`);
        } catch (error) {
            console.error('Error muting user:', error);
            await interaction.reply('An error occurred while trying to poopy the user.');
        }
    }
};
