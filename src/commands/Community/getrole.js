const { SlashCommandBuilder, PermissionFlagsBits, GuildMember } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config();
const supabase = createClient(process.env.dburl, process.env.dbkey)
module.exports = {
    data: new SlashCommandBuilder()
    .setName('getrole')
    .setDescription('Gives Buyer Role'),
    async execute(interaction, client) {
        const user = await supabase
        .from('keys')
        .select('activated')
        .eq('user', interaction.user.id)
        if (user.data[0].activated === true && !(interaction.member.roles.cache.find(r => r.name == "Buyer"))) {
            const role = interaction.guild.roles.cache.find(r => r.name == "Buyer");
            await interaction.member.roles.add(role)
            await interaction.reply(`You Have Been Given The Buyer Role`)
        } else if (interaction.member.roles.cache.find(r => r.name == "Buyer")) {
            await interaction.reply("You Already Have The Role")
        } else {
            await interaction.reply(`You Have Not Redeemed A Key On Your Discord Id`)
        }
    }

}

