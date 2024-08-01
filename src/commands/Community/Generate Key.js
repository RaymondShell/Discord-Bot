const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const crypto = require("crypto");
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.dburl, process.env.dbkey);

module.exports = {
    data: new SlashCommandBuilder()
    .setName('generatekeys')
    .setDescription('Generates a Key')
    .addStringOption((option) => 
        option
        .setName('length')
        .setDescription('Generate a Key with Specified Duration')
        .setRequired(true)
        .addChoices(
            { name: '1 Day', value: '1' },
            { name: '7 Day', value: '7' },
            { name: '30 Day', value: '30' },
            { name: '360 Day', value: '360' },
        ))
    .addStringOption((option) => 
        option
        .setName('amount')
        .setDescription('Amount of Keys To Generate')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        // Check for required roles
        const roles = ["Whitelister", "Fuhrer", "[OWNER]", "English"];
        const hasPermission = interaction.member.roles.cache.some(r => roles.includes(r.name));

        if (!hasPermission) {
            return await interaction.reply("You do not have Whitelister permissions.");
        }

        // Acknowledge the interaction
        await interaction.deferReply();

        // Get the options
        const duration = interaction.options.getString('length');
        const amount = parseInt(interaction.options.getString('amount'), 10);

        // Generate keys
        const keysData = Array.from({ length: amount }, () => {
            const key = generateKey(interaction.user.id, duration);
            return { key, length: duration };
        });

        // Batch insert keys into the database
        try {
            const { error } = await supabase
                .from('keys')
                .insert(keysData);

            if (error) {
                console.error('Error inserting keys:', error);
                return await interaction.editReply("There was an error generating the keys. Please try again.");
            }

            // Format the keys for the response
            const keysString = keysData.map(data => data.key).join('\n');
            await interaction.editReply(`Generated Keys:\n\`\`\`${keysString}\`\`\``);
        } catch (error) {
            console.error('Unexpected error:', error);
            await interaction.editReply("An unexpected error occurred. Please try again.");
        }
    }
};

function generateKey(userId, duration) {
    const randomNum = Math.floor(Math.random() * 999999999);
    const input = userId + randomNum + duration;
    const hash = crypto.createHash('sha256').update(input).digest('base64');
    return hash;
}
