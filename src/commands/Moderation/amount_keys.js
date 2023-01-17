const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config();
const supabase = createClient(process.env.dburl, process.env.dbkey)
module.exports = {
    data: new SlashCommandBuilder()
    .setName('amountkeys')
    .setDescription('displays the amount of keys made')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        var { data, count} = await supabase
        .from('keys')
        .select('key', { count: 'exact' })
        .is('user', null)
        const total = count
        var { data, count} = await supabase
        .from('keys')
        .select('key', { count: 'exact' })
        .not('user', 'is', "null")
        await interaction.reply(`The Amount Of Keys Unactivated Are: ${total} and the amount of keys activated Are: ${count}`)
        
    }

}

function differenceDates(finishDate) {
    var date1 = new Date();
    var date2 = new Date(finishDate)
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Math.round(Difference_In_Days * 10) / 10
}