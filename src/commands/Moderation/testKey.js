const { SlashCommandBuilder, PermissionFlagsBits, GuildMember } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config();
const supabase = createClient(process.env.dburl, process.env.dbkey)
module.exports = {
    data: new SlashCommandBuilder()
    .setName('keytest')
    .setDescription('tests the given key for duration')
    .addStringOption((option) =>
        option
        .setName("key")
        .setDescription("key To test")
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const key = interaction.options.getString("key")
        const finish = await supabase
        .from('keys')
        .select('finish')
        .eq('key', key)
        const difference = differenceDates(finish.data[0].finish)
        if (interaction.member.roles.cache.find(r => r.name == "Buyer") || (interaction.member.roles.cache.find(r => r.name == "Fuhrer")) || (interaction.member.roles.cache.find(r => r.name == "[OWNER]"))) {
            if (difference > 0) {
                await interaction.reply(`The Key is Still Active For Another ${difference} days`)
            } else {
                await interaction.reply("The Key Has Ran Out Of Duration and will be Disabled")
                const { error } = await supabase
                .from('keys')
                .update({ out_of_duration: true })
                .eq('key', key)
            }
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