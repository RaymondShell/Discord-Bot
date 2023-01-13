const moment = require("moment");
require("moment-duration-format");
const { SlashCommandBuilder, PermissionFlagsBits, GuildMember } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Gets Uptime of bot'),
    async execute(interaction, client) {
        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        await interaction.reply(duration)
    }

}