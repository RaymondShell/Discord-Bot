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
        if (interaction.member.roles.cache.find(r => r.name == "Whitelister") || (interaction.member.roles.cache.find(r => r.name == "Fuhrer")) || (interaction.member.roles.cache.find(r => r.name == "[OWNER]")) || (interaction.member.roles.cache.find(r => r.name == "English"))) {
            const duration = interaction.options.getString('length')
            const amount = interaction.options.getString('amount')
            keys = ""
            for (let i=0; i<amount; i++) {
                hash = generateKey(interaction.user.id, duration)
                const { error } = await supabase
                .from('keys')
                .insert({ key: hash, length: duration})
                keys += `\n${hash}`
            }
            await interaction.reply("```"+keys+"```")
        } else {
            await interaction.reply("You Do Not Have Whitelister Perms")
        }
    }

}

function generateKey(userId, Duration) {
    random_num = Math.floor(Math.random() * 999999999);
    input = userId+random_num+Duration
    const hash = crypto.createHash('sha256').update(input).digest('base64');
    return hash
}