const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient('https://tsxzkbeqghrenfmzcetn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzeHprYmVxZ2hyZW5mbXpjZXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg2Mzc4NjQsImV4cCI6MTk4NDIxMzg2NH0.LBvpWDdltRu34t3plfGbG-4SGZ6DY0j8EIbdD_J9GDE')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('checktime')
    .setDescription('check remaining time on a key')
    .addStringOption((option) =>
        option
        .setName("key")
        .setDescription("Key to check remaining time for")
        .setRequired(true)
        )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        const key = interaction.options.getString("key")
        const date = await supabase
        .from('keys')
        .select('finish')
        .eq('key', key)
        if (date.data.length !== 0) {
            var true_date = date.data[0].finish
            remainingTime = differenceDates(true_date)
            await interaction.reply({ content:`The Time Remaining On Your Key is ${remainingTime} days`, ephemeral: true })
        } else {
            await interaction.reply({ content:`Either Your Key is Not Activated Or You Put The Wrong Key In Retard`, ephemeral: true })
        }
        
    }

}

function differenceDates(finishDate) {
    var date1 = new Date();
    var date2 = new Date(finishDate)
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Math.round(Difference_In_Days * 10) / 10
}