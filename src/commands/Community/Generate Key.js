const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
var crypto = require("crypto");
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient('https://tsxzkbeqghrenfmzcetn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzeHprYmVxZ2hyZW5mbXpjZXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg2Mzc4NjQsImV4cCI6MTk4NDIxMzg2NH0.LBvpWDdltRu34t3plfGbG-4SGZ6DY0j8EIbdD_J9GDE')

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
    }

}

function generateKey(userId, Duration) {
    random_num = Math.floor(Math.random() * 999999999);
    input = userId+random_num+Duration
    const hash = crypto.createHash('sha256').update(input).digest('base64');
    return hash
}