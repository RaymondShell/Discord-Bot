const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient('https://tsxzkbeqghrenfmzcetn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzeHprYmVxZ2hyZW5mbXpjZXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg2Mzc4NjQsImV4cCI6MTk4NDIxMzg2NH0.LBvpWDdltRu34t3plfGbG-4SGZ6DY0j8EIbdD_J9GDE')

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