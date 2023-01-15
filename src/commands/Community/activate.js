const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config();
const supabase = createClient(process.env.dburl, process.env.dbkey)
module.exports = {
    data: new SlashCommandBuilder()
    .setName('activatekey')
    .setDescription('Activates A Key')
    .addStringOption((option) =>
        option
        .setName("key")
        .setDescription("Key to be activated")
        .setRequired(true)
        )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        const key = interaction.options.getString("key")
        const duration = await supabase
        .from('keys')
        .select('length')
        .eq('key', key)
        if (duration.data.length !== 1) {
            await interaction.reply(`The Key is Invalid Please Try Again`)
        } else {
            const activated = await supabase
            .from('keys')
            .select('activated')
            .eq('key', key)
            if (activated.data[0].activated !== true) {
                await interaction.reply(`The Key has been activated and will last ${duration.data[0].length} days`)
                date = getFinalDate(duration.data[0].length)
                const { error } = await supabase
                .from('keys')
                .update({ activated: true, finish: date, user: interaction.user.id})
                .eq('key', key)
            } else {
                await interaction.reply(`The Key is already activated`)
            }
        }

    }

}

function getFinalDate(duration) {
    var today = new Date();
    var finaldate = new Date();
    finaldate.setDate(today.getDate() + duration);
    var newDate = finaldate.toISOString().split("T")[0];
    return newDate
}