const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
var crypto = require("crypto");
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config();
const supabase = createClient(process.env.dburl, process.env.dbkey)

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
        if (interaction.member.roles.cache.some(r => 
            ["Whitelister", "Fuhrer", "[OWNER]", "English"].includes(r.name))) {
            const duration = interaction.options.getString('length');
            const amount = parseInt(interaction.options.getString('amount'), 10);

            // Acknowledge the interaction
            await interaction.deferReply();

            let keys = "";
            for (let i = 0; i < amount; i++) {
                const hash = generateKey(interaction.user.id, duration);
                const { error } = await supabase
                    .from('keys')
                    .insert({ key: hash, length: duration });
                if (error) {
                    console.log(error);
                    continue; // Skip adding this key if there's an error
                }
                keys += `\n${hash}`;
            }

            // Send the response
            await interaction.editReply(`Generated Keys:\n\`\`\`${keys}\`\`\``);
        } else {
            await interaction.reply("You do not have Whitelister permissions.");
        }
    }
}

function generateKey(userId, Duration) {
    const randomNum = Math.floor(Math.random() * 999999999);
    const input = userId + randomNum + Duration;
    const hash = crypto.createHash('sha256').update(input).digest('base64');
    return hash;
}
